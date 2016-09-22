# -*- coding: utf-8 -*-

import os
import shutil


def import_glossary_word_page(
        page_id,
        page_descriptor,
        input_page_dir,
        output_page_dir):
    # Copy source markdown file into the output page directory.
    # The name of input markdown file is not contained in the page descriptor
    # and it is hardcoded to "content.md".
    input_markdown_file = os.path.join(input_page_dir, 'content.md')
    output_markdown_file = os.path.join(output_page_dir, 'content.md')
    if not os.path.isfile(input_markdown_file):
        print '\t\tWARNING: cannot find markdown file. Generating empty one.'
        with open(output_markdown_file, 'w') as f:
            f.write('# Empty Glossary Word Page\n')
    else:
        shutil.copy(input_markdown_file, output_markdown_file)

    # Copy images from source directory to destination directory.
    pngs = [f for f in os.listdir(input_page_dir) if f.lower().endswith('png')]
    for png in pngs:
        input_png_fn = os.path.join(input_page_dir, png)
        output_png_fn = os.path.join(output_page_dir, png)
        shutil.copy(input_png_fn, output_png_fn)

    # Return the python dictionary that describes the generated page
    return {
        'id': page_id,
        'style': 'glossary_word',
        'title': page_descriptor.get('title', ''),
        'content': {
            'title': {
                'type': 'raw_text',
                'value': page_descriptor.get('title', ''),
            },
            'body': {
                'type': 'markdown',
                'source': 'content.md'  # hardcoded markdown filename
            }
        }
    }
