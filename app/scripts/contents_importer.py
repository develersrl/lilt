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

    # Import markdown data
    common.import_editor_markdown_file(input_page_dir,
                                       os.path.dirname(output_page_dir),
                                       page_id,
                                       create_empty_mdfile=True)

    # Copy all images from source directory to destination directory.
    # This automatically copies the page header image.
    imgs = []
    for f in os.listdir(input_page_dir):
        if f.lower().endswith('png') or f.lower().endswith('jpg'):
            imgs.append(f)

    for img in imgs:
        input_img_fn = os.path.join(input_page_dir, img)
        output_img_fn = os.path.join(output_page_dir, img)
        shutil.copy(input_img_fn, output_img_fn)

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
