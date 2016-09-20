# -*- coding: utf-8 -*-

import os


def get_editor_data_dir():
    """Return the editor data directory."""

    # Read editor data directory from environment variable
    editor_data_dir = os.environ.get('EDITOR_DATA_DIR')
    if editor_data_dir is None:
        print(
            'Warning: editor data directory is not set.\n'
            'You can specify it through the EDITOR_DATA_DIR environment '
            'variable.\n'
            )
        return ''

    # Editor data directory must be a valid directory
    if not os.path.isdir(editor_data_dir):
        print 'Warning: "{}" is not a directory\n'.format(editor_data_dir)
        return ''

    return editor_data_dir


def generate_content_pages(editor_data_dir):
    """Generate app content ("Contenuti") pages."""

    print 'Generating content pages'
    return []


def import_editor_data():
    """Read the editor output data and generate the corresponding app pages."""

    # If editor data directory is empty it means that something is wrong, so
    # we do not generate any page
    editor_data_dir = get_editor_data_dir()
    if editor_data_dir == '':
        return []

    # Generate pages from editor data
    generated_pages = []
    generated_pages += generate_content_pages(editor_data_dir)

    return generated_pages
