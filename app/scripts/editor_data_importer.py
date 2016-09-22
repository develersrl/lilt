# -*- coding: utf-8 -*-

import os
import shutil

import common
from contents_importer import import_content_page
from glossary_word_importer import import_glossary_word_page, generate_glossary


# The following array describes the templates to be imported from editor dir
editor_templates_descriptors = [
    {
        'dirname': 'Contenuti',
        'genprefix': 'c_gen_',
        'importfun': import_content_page,
        'endfun': None
    },
    {
        'dirname': 'Glossario',
        'genprefix': 'gw_gen_',
        'importfun': import_glossary_word_page,
        'endfun': generate_glossary
    }
]


def get_editor_data_dir():
    """Return the editor data directory."""

    # Read editor data directory from environment variable
    editor_data_dir = os.environ.get('LILT_EDITOR_DATA_DIR')
    if editor_data_dir is None:
        print(
            'Warning: editor data directory is not set.\n'
            'You can specify it through the LILT_EDITOR_DATA_DIR environment '
            'variable.\n'
            )
        return ''

    # Editor data directory must be a valid directory
    if not os.path.isdir(editor_data_dir):
        print 'Warning: "{}" is not a directory\n'.format(editor_data_dir)
        return ''

    return editor_data_dir


def generate_page_data(page_id, input_page_dir, descriptor):
    print '\tGenerating page "{}"'.format(page_id)

    # The editor saves a json file inside each page directory.
    # Such file describe the various page tokens so we abort the generation
    # if this file is not found.
    input_json_fn = os.path.join(input_page_dir, 'page.json')
    page_descriptor = common.load_json(input_json_fn)
    if page_descriptor is None:
        return None

    # Remove and recreate output directory if exists
    output_page_dir = common.get_content_page_dir(page_id)
    if os.path.isdir(output_page_dir):
        shutil.rmtree(output_page_dir)
    os.mkdir(output_page_dir)

    # Call custom import function to complete page generation
    importfun = descriptor['importfun']
    return importfun(page_id, page_descriptor, input_page_dir, output_page_dir)


def generate_pages_data(editor_data_dir, descriptor):
    # Compute editor template dir (e.g. "Contenuti", "Glossario") full path
    editor_template_dir = os.path.join(editor_data_dir, descriptor['dirname'])
    if not os.path.isdir(editor_template_dir):
        print 'Warning: cannot find dir "{}"'.format(descriptor['dirname'])
        return []

    print 'Generating pages "{}"'.format(descriptor['dirname'])
    generated_pages = []
    dirs = common.listdir_nohidden(editor_template_dir)
    for (i, dirname) in enumerate(dirs):
        # We use a prefix for the page_id to prevent
        # conflicts with other type of generated pages (e.g. glossary pages)
        page_object = generate_page_data(
            '{}{}'.format(descriptor['genprefix'], i + 1),
            os.path.join(editor_template_dir, dirname),
            descriptor)

        # If generated page is None then something went wrong
        if page_object is not None:
            generated_pages.append(page_object)

    # Run custom "end" function if any
    if descriptor['endfun'] is not None:
        descriptor['endfun'](generated_pages)

    return generated_pages


def import_editor_data():
    """Read the editor output data and generate the corresponding app pages."""

    print '***** Generating app data from editor data *****'
    # If editor data directory is empty it means that something is wrong, so
    # we do not generate any page
    editor_data_dir = get_editor_data_dir()
    if editor_data_dir == '':
        return []

    # Generate pages from editor data
    print 'Editor data directory: {}'.format(editor_data_dir)
    generated_pages = []
    for descriptor in editor_templates_descriptors:
        generated_pages += generate_pages_data(editor_data_dir, descriptor)
    print

    return generated_pages
