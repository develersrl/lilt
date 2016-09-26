#! /usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
from base64 import b32encode
import errno
import json
import os
import re
from shutil import rmtree

CONTENT_SECTION_NAMES = [
    'SAPERNE DI PIÙ',
    'PREVENZIONE',
    'DIAGNOSI PRECOCE'
    ]
GLOSSARY_SECTION_NAME = "WIKI"

CONTENTS_DIR_NAME = "Contenuti"
GLOSSARY_DIR_NAME = "Glossario"

CONTENTS_PAGE = 0
GLOSSARY_PAGE = 1

### Helpers
def peekline(f):
    pos = f.tell()
    line = f.readline()
    f.seek(pos)
    return line

def check_dir(directory):
    curr_dir = os.getcwd()
    try:
        os.chdir(directory)
    except OSError as e:
        raise SystemExit("Error navigating to {}: {}".format(
                         directory, e.strerror))
    os.chdir(curr_dir)

def make_dir(directory):
    try:
        os.mkdir(directory)
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise SystemExit("Error creating directory {}: {}".format(
                             directory, e.strerror))

def run(args):
    # Avoid doing any real work if there is a mistake with the output directory
    check_dir(args.output_dir)

    (contents, glossary) = analyze_file(args.input_file)
    contents_subsections = get_contents_subsections(contents)
    glossary_subsections = get_glossary_subsections(glossary)

    os.chdir(args.output_dir)
    populate(CONTENTS_DIR_NAME, contents_subsections, CONTENTS_PAGE)
    populate(GLOSSARY_DIR_NAME, glossary_subsections, GLOSSARY_PAGE)

### Stuff needed for the first pass on the file
def analyze_file(md_file):
    try:
        with open(md_file, 'r') as f:
            contents = ''
            for content_section_name in CONTENT_SECTION_NAMES:
                contents += read_section(f, content_section_name)
            return (contents, read_section(f, GLOSSARY_SECTION_NAME))
    except IOError as e:
        raise SystemExit("Error opening {}: {}".format(md_file, e.args[1]))

def read_section(input_file, section_name):
    section_text = ""
    while True:
        line = input_file.readline()
        if not line: break
        if is_section_start(input_file, line, section_name):
            # if this line is a section start, this means the next is just
            # equals signs. We don't want that in the section text
            input_file.readline() # discard '=======' line
            section_text = read_one_section(input_file)
            break
    input_file.seek(0)
    return section_text

def is_section_start(input_file, line, section_name = ""):
    # if a line starts with the section name it _may_ start a section
    could_start_section = \
        line.strip().startswith(section_name) if section_name else True

    # we only peek because in case this line is not in fact a section start
    # the next line could
    next_line = peekline(input_file).strip() if could_start_section else ""

    # but in fact it's a section start only if the next line is wholly made
    # of '=' characters (markdown highest heading)
    return all(map(lambda x: x == '=', next_line)) if next_line else False

def read_one_section(input_file):
    section_text = ""
    while True:
        line = input_file.readline()
        if not line or is_section_start(input_file, line):
            break
        else:
            section_text += line
    return section_text

### Stuff needed for the second pass
def get_contents_subsections(section_str):
    regex = re.compile(r"""
        \n*  # Zero or more newlines before subsection name
        (.+) # One or more characters captured (subsection name)
        \n   # A newline at end of subsection name
        -+   # One or more '-' characters (heading syntax)
        \n+  # One or more newlines at end of '---' line
    """, re.VERBOSE)
    raw_list = re.split(regex, section_str)
    not_empty = lambda x: x != ""
    final_list = filter(not_empty, raw_list)

    # the final list will be made up of strings, with the first being the first
    # subsection name, the second being the first subsection text, and so on
    # alternating between subsection name and text. It is implicitly assumed
    # that every subsection has some text
    if len(final_list) % 2 != 0:
        raise AssertionError("Subsection list has non-even number of elements")

    # We generate a list of dictionaries for ease of use later on
    dict_list = []
    for idx in range(len(final_list) / 2):
        dict_list.append({
            "name": final_list[idx*2],
            "text": final_list[idx*2 + 1]
        })

    return dict_list

def get_glossary_subsections(section_str):
    regex = re.compile(r"""
        \*\* # Glossary terms are bold, so they are enclosed in **
        (.+) # We caputre the glossary term itself
        \*\* # These are the ending ** that enclose the glossary term
        \:\s # Glossary terms are followed by a colon and a space
    """, re.VERBOSE)
    raw_list = re.split(regex, section_str)
    final_list = []

    # Glossary terms are all-caps. To make things easy, the docx contains
    # something that pandoc converts to **stuff** right at the start of the
    # glossary section, but that _is not_ a glossary term. Luckily, that stuff
    # is not all-caps like glossary terms, so we can remove it if necessary.
    #
    # I don't know if later versions of the docx might remove that, so instead
    # of blindly removing the first element of raw_list I check if it's not all
    # caps first
    if not raw_list[0].isupper():
        final_list = raw_list[1:]
    else:
        final_list = raw_list

    if len(final_list) % 2 != 0:
        raise AssertionError("Glossary list has non-even number of elements")

    # We generate a list of dictionaries for ease of use later on
    dict_list = []
    for idx in range(len(final_list) / 2):
        dict_list.append({
            "term": final_list[idx*2],
            "definition": final_list[idx*2 + 1]
        })

    return dict_list

### Stuff to actually create the directory structure and files
def populate(directory, page_list, page_type):
    make_dir(directory)
    os.chdir(directory)
    for page in page_list:
        try:
            dirname = get_dirname(page, page_type)
            os.mkdir(dirname)
        except OSError as e:
            # If the directory already exists, we overwrite everything. In
            # truth we just delete it and make it anew, but the end effect is
            # the same.
            if e.errno == errno.EEXIST:
                rmtree(dirname)
                os.mkdir(dirname)
            else:
                raise

        os.chdir(dirname)
        write_content(page, page_type)
        write_json(page, page_type)
        os.chdir("..") # move up to CONTENTS_DIR_NAME or GLOSSARY_DIR_NAME
    os.chdir("..") # move up to target dir

def get_dirname(page, page_type):
    base_name = ""
    if page_type == CONTENTS_PAGE:
        base_name = page["name"]
    elif page_type == GLOSSARY_PAGE:
        base_name = page["term"]
    else:
        raise RuntimeError("Unknown page type computing dirname")

    # We generate a base32 name for these reasons
    # 1: An user-unfriendly name has less chance to catch attention by the
    #    user, lowering the chance he'll stumble into one of these dirs and
    #    manually change stuff.
    # 2: We need to generate the name in a referentially-transparent way;
    #    that is, given the same input, we get the same output. An uuid is
    #    not the right choice here like it is for file names inside the page
    #    directories, because in that case given the same file name (perhaps
    #    from different directories) we _need_ to generate unique names for the
    #    copied files. Here we want the opposite.
    # 4: Since we are generating directory names, it is important that the
    #    generated name contains characters that can be used by every
    #    filesystem, even case-insensitive ones. Base32 can do this because its
    #    output is single-cased.
    # 5: It's 20% smaller than the raw hex representation of the name.
    #
    # Also, we lower the page name because in case-insensitive filesystems we
    # want the generated name for "foo" and "FOO" to be the same. We also lower
    # the resulting string because I like lowercase better.
    return b32encode(base_name.lower()).lower()

def write_content(page, page_type):
    with open("content.md", 'w') as out_md:
        if page_type == CONTENTS_PAGE:
            out_md.write(page["text"])
        elif page_type == GLOSSARY_PAGE:
            out_md.write(page["definition"])
        else:
            raise RuntimeError("Unknown page type writing content")

def write_json(page, page_type):
    json_dict = {}
    if page_type == CONTENTS_PAGE:
        json_dict["title"] = page["name"]
        json_dict["sharedText"] = ""
        json_dict["pdfFile"] = ""
        json_dict["headerImage"] = ""
    elif page_type == GLOSSARY_PAGE:
        json_dict["title"] = page["term"]
    else:
        raise RuntimeError("Unknown page type writing json")

    json_str = json.dumps(json_dict, indent=4, separators=(',', ': '))
    with open("page.json", 'w') as out_json:
        out_json.write(json_str)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create a pre-populated directory structure readable by "
        "the markdown editor"
    )
    parser.add_argument("input_file", help="input cleaned markdown file")
    parser.add_argument("output_dir", help="output directory")
    args = parser.parse_args()
    run(args)
