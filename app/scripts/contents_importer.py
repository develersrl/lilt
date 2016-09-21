# -*- coding: utf-8 -*-

import os
import shutil
import json

import common


appdir = os.path.dirname(common.scripts_dir)
pages_dir = os.path.join(appdir, 'content', 'pages')
pdf_dir = os.path.join(appdir, 'content', 'pdf')


def get_output_page_dir(page_id):
    """Return full path to page target directory."""
    return os.path.join(pages_dir, page_id)


def get_output_pdfname(pdf_name):
    """Return bundled pdf filename, given a page id and a pdf_name."""

    # Since we use the pdf name as output filename (e.g. "foo.pdf") there
    # could be conflicts if two different generated pages have pdf files with
    # the same name. To avoid the problem we add a suffix to the pdf name.
    basename = os.path.splitext(pdf_name)[0]
    same = [f for f in os.listdir(pdf_dir) if f.lower().startswith(basename)]
    suffix = '' if len(same) == 0 else '{}'.format(len(same))
    return basename + suffix + '.pdf'


def import_content_page(page_id, input_page_dir):
    print '\tGenerating page "{}"'.format(page_id)

    # The editor saves a json file inside each page directory.
    # Such file describe the various page tokens so we abort the generation
    # if this file is not found.
    input_json_fn = os.path.join(input_page_dir, 'page.json')
    if not os.path.isfile(input_json_fn):
        print '\t\tFAIL: cannot find page.json file'
        return None

    # Read page descriptor file
    try:
        with open(input_json_fn, 'r') as f:
            page_descriptor = json.load(f)
    except ValueError:
        print '\t\tFAIL: malformed page.json file'
        return None

    # The page descriptor is a dictionary with the following entries:
    # * title -> content page title
    # * headerImage -> name of the image to be shown below the title
    # * pdfFile -> name of the pdf file to be downloaded from the page
    # * sharedText -> text to be shared from the page

    # Remove and recreate output directory if exists
    output_page_dir = get_output_page_dir(page_id)
    if os.path.isdir(output_page_dir):
        shutil.rmtree(output_page_dir)
    os.mkdir(output_page_dir)

    # If a pdf file is specified in the page descriptor then copy it inside
    # the pdf directory, which is in turn bundled into the app resources.
    json_pdf_name = page_descriptor.get('pdfFile', '')
    pdf_name = ''
    if json_pdf_name != '':
        input_pdf_fn = os.path.join(input_page_dir, json_pdf_name)
        if not os.path.isfile(input_pdf_fn):
            print '\t\tWARNING: cannot find file "{}"'.format(input_pdf_fn)
        else:
            pdf_name = get_output_pdfname(json_pdf_name)
            output_pdf_fn = os.path.join(pdf_dir, pdf_name)
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


def import_contents(contents_dir):
    """Generate content pages from a given directory."""

    # Exclude hidden folders from the list of to be processed folders
    content_dirs = [d for d in os.listdir(contents_dir) if d[0] != '.']

    print 'Generating {} content pages..'.format(len(content_dirs))
    generated_pages = []
    for (i, dirname) in enumerate(content_dirs):
        # We use a prefix ("c_" in this case) for the page_id to prevent
        # conflicts with other type of generated pages (e.g. glossary pages)
        page_object = import_content_page(
            'c_gen_{}'.format(i + 1),
            os.path.join(contents_dir, dirname)
            )

        # If generated page is None then something went wrong
        if page_object is not None:
            generated_pages.append(page_object)

    return generated_pages
