# -*- coding: utf-8 -*-

import os
import shutil
import json

import common



def import_content_page(
        page_id,
        page_descriptor,
        input_page_dir,
        output_page_dir):
    # If a pdf file is specified in the page descriptor then copy it inside
    # the pdf directory, which is in turn bundled into the app resources.
    json_pdf_name = page_descriptor.get('pdfFile', '')
    pdf_name = ''
    if json_pdf_name != '':
        input_pdf_fn = os.path.join(input_page_dir, json_pdf_name)
        if not os.path.isfile(input_pdf_fn):
            print '\t\tWARNING: cannot find file "{}"'.format(input_pdf_fn)
        else:
            pdf_name = common.get_output_pdfname(json_pdf_name)
            output_pdf_fn = os.path.join(common.pdf_dir, pdf_name)
            shutil.copy(input_pdf_fn, output_pdf_fn)

    # Copy source markdown file into the output page directory.
    # The name of input markdown file is not contained in the page descriptor
    # and it is hardcoded to "content.md".
    input_markdown_file = os.path.join(input_page_dir, 'content.md')
    output_markdown_file = os.path.join(output_page_dir, 'content.md')
    if not os.path.isfile(input_markdown_file):
        print '\t\tWARNING: cannot find markdown file. Generating empty one.'
        with open(output_markdown_file, 'w') as f:
            f.write('# Empty Content Page\n')
    else:
        shutil.copy(input_markdown_file, output_markdown_file)

    # Copy images from source directory to destination directory.
    # This automatically copies the page header image plus all the images
    # referenced inside the markdown file.
    pngs = [f for f in os.listdir(input_page_dir) if f.lower().endswith('png')]
    for png in pngs:
        input_png_fn = os.path.join(input_page_dir, png)
        output_png_fn = os.path.join(output_page_dir, png)
        shutil.copy(input_png_fn, output_png_fn)

    # Return the python dictionary that describes the generated page
    return {
        'id': page_id,
        'style': 'content',
        'title': page_descriptor.get('title', ''),
        'content': {
            'title': {
                'type': 'raw_text',
                'value': page_descriptor.get('title', ''),
            },
            'headerImage': {
                'type': 'image_require',
                'name': page_descriptor.get('headerImage', '')
            },
            'pdfName': {
                'type': 'pdf',
                'name': pdf_name
            },
            'sharedText': {
                'type': 'raw_text',
                'value': page_descriptor.get('sharedText', '')
            },
            'body': {
                'type': 'markdown',
                'source': 'content.md'  # hardcoded markdown filename
            }
        }
    }
