# -*- coding: utf-8 -*-

import os

import common


def import_structures():
    pass


def import_structure_fake(
        page_id,
        page_descriptor,
        input_page_dir,
        output_page_dir):
    return None


def import_structure_json(structure_id, structure_dir, structures_json):
    # Make sure json descriptor exists
    json_descriptor_fn = os.path.join(structure_dir, 'page.json')
    json_descriptor = common.load_json(json_descriptor_fn)
    if json_descriptor is None:
        return

    # Append structure description to the output json object
    s_type = json_descriptor['structuretype']
    if s_type not in structures_json:
        structures_json[s_type] = []

    # Copy structure markdown file (that contains structure's free text
    # description) to the content "structures" directory
    common.import_editor_markdown_file(structure_dir,
                                       common.content_structures_dir,
                                       structure_id,
                                       create_empty_mdfile=False)

    # Append structure id to json data.
    # The structure id is used to associate a structure to its free text
    json_descriptor['structureid'] = structure_id
    structures_json[s_type].append(json_descriptor)
