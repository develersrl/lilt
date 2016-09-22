# -*- coding: utf-8 -*-

import os
import shutil
import json


# Base assumption: this script must be placed in the "scripts" directory
scripts_dir = os.path.dirname(os.path.realpath(__file__))

# "app" directory
app_dir = os.path.dirname(scripts_dir)

# The "content" directory contains input data for the generation script
content_dir = os.path.join(app_dir, 'content')

# Generation script takes pages data from this directory
content_pages_dir = os.path.join(content_dir, 'pages')

# Full path to json file containing pages description
content_json_fn = os.path.join(content_dir, 'pages.json')

# Full path to glossary json file
content_glossary_fn = os.path.join(content_dir, 'glossary.json')

# The following json file contains glossary words "bindings": it defines,
# for each glossary word, which is the corresponding app page
content_glossary_bindings_fn = os.path.join(
    content_dir,
    'glossary_bindings.json')

# Pdf files used by app pages are located inside this folder
pdf_dir = os.path.join(content_dir, 'pdf')

# The "templates" directory contains react native component templates.
# Templates will be instanced with Jinja during the generation phase.
templates_dir = os.path.join(app_dir, 'templates')

# This is the directory where react native pages will be generated
target_pages_dir = os.path.join(app_dir, 'js', 'pages', 'generated')

# App navigation code will be generated inside the following directory
target_navigation_dir = os.path.join(app_dir, 'js', 'navigation')


def listdir_nohidden(path):
    result = []
    for f in os.listdir(path):
        if not f.startswith('.'):
            yield f


def clean_pdf_dir():
    """Clean the pdf directory which is populated later."""
    # Create the pdf directory if it does not exist
    if not os.path.isdir(pdf_dir):
        os.makedirs(pdf_dir)
        return

    # Get the pdf files list and remove them
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('pdf')]
    for pdf_name in pdf_files:
        os.remove(os.path.join(pdf_dir, pdf_name))


def clean_target_pages_dir():
    """Prepare target pages dir for the generation script."""
    if not os.path.exists(target_pages_dir):
        os.makedirs(target_pages_dir)
    else:
        shutil.rmtree(target_pages_dir)
        os.mkdir(target_pages_dir)


def get_content_page_dir(page_id):
    """Return page data directory from page id."""
    return os.path.join(content_pages_dir, page_id)


def get_output_pdfname(pdf_name):
    """Return bundled pdf filename, given a pdf_name."""

    # Since we use the pdf name as output filename (e.g. "foo.pdf") there
    # could be conflicts if two different generated pages have pdf files with
    # the same name. To avoid the problem we add a suffix to the pdf name.
    basename = os.path.splitext(pdf_name)[0]

    same_pdf = 0
    for f in os.listdir(pdf_dir):
        if f.lower().startswith(basename):
            same_pdf += 1

    suffix = '' if same_pdf == 0 else '{}'.format(same_pdf)
    return basename + suffix + '.pdf'


def load_json(fn):
    if not os.path.isfile(fn):
        print '\t\tFAIL: cannot find page.json file'
        return None

    try:
        with open(fn, 'r') as f:
            json_content = json.load(f)
    except ValueError:
        print '\t\tFAIL: malformed json file'
        return None

    return json_content
