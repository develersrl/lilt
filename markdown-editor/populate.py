# -*- coding: utf-8 -*-

import argparse
import os
import re

CONTENT_SECTION_NAME = "SAPERNE DI PIÙ"
GLOSSARY_SECTION_NAME = "WIKI"

CONTENTS_DIR_NAME = "Contenuti"
GLOSSARY_DIR_NAME = "Glossario"

### Helpers
def peekline(f):
    pos = f.tell()
    line = f.readline()
    f.seek(pos)
    return line

def change_dir(directory):
    try:
        os.chdir(directory)
    except OSError as e:
        raise SystemExit("Error navigating to {}: {}".format(directory, e.strerror))

def make_dir(directory):
    try:
        os.mkdir(directory):
    except OSError as e:
        if e.errno != 17: # errno == 17 means directory already existing
            raise SystemExit("Error creating directory {}: {}".format(
                             directory, e.strerror))

def run(args):
    change_dir(args.output_dir)
    (contents, glossary) = analyze_file(args.input_file)
    contents_subsections = get_subsections(contents)
    glossary_subsections = get_subsections(glossary)
    populate(CONTENTS_DIR_NAME, contents_subsections)
    populate(GLOSSARY_DIR_NAME, glossary_subsections)

### Stuff needed for the first pass on the file
def analyze_file(md_file):
    try:
        f = open(md_file, 'r')
    except IOError as e:
        raise SystemExit("Error opening {}: {}".format(md_file, e.args[1]))
    return (
        read_section(f, CONTENT_SECTION_NAME),
        read_section(f, GLOSSARY_SECTION_NAME)
    )

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
def get_subsections(section_str):
    regex = re.compile(r"""
        \n*  # Zero or more newlines before subsection name
        (.+) # One or more characters captured (subsection name)
        \n   # A newline at end of subsection name
        -+   # One or more '-' characters (heading syntax)
        \n+  # One or more newlines at end of '---' line
    """, re.VERBOSE)
    raw_list = re.split(r'', section_str)
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

### Stuff to actually create the directory structure and files
def populate(directory, page_list):
    make_dir(directory)
    os.chdir(directory)
    for page in page_list:
        try:
            # TODO the name does not matter but we should create an
            # user-unfriendly name as with everything else in these dirs. We
            # still need the user-unfriendly name to be generated in a
            # referentially-transparent way. base32 is probably sufficient, and
            # preferred over other base* functions because its output is
            # single-cased, which is useful for case-insensitive filesystems
            # (hello, Windows)
            os.mkdir(page.name)
        except OSError as e:
            # TODO we should probably overwrite stuff in this case actually
            if e.errno == 17: continue
        # TODO enter directory
        # TODO create content.md with page.text
        # TODO create page.json with page.name as "title" key

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create a pre-populated directory structure readable by "
        "the markdown editor"
    )
    parser.add_argument("input_file", help="input cleaned markdown file")
    parser.add_argument("output_dir", help="output directory")
    args = parser.parse_args()
    run(args)
