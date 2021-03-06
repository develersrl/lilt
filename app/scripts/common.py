# -*- coding: utf-8 -*-

import os
import shutil
import json
import mistune

from renderer_wrapper import RendererWrapper
from rn_renderer import RNRenderer


# Base assumption: this script must be placed in the "scripts" directory
scripts_dir = os.path.dirname(os.path.realpath(__file__))

# "app" directory
app_dir = os.path.dirname(scripts_dir)

# The "content" directory contains input data for the generation script
content_dir = os.path.join(app_dir, 'content')

# Generation script takes pages data from this directory
content_pages_dir = os.path.join(content_dir, 'pages')

# Generation script takes structures free-text description from this dir
content_structures_dir = os.path.join(content_dir, 'structures')

# App images dir
app_images_dir = os.path.join(app_dir, 'images')

# Where to place asset catalogs (es. app icons and launchscreens)
asset_catalogs_dir = os.path.join(app_images_dir, 'catalogs')

# Full path to the application icon
app_icon_fn = os.path.join(app_images_dir, 'app-icon.png')

# Path to launchscreen background image
launchscreen_base_fn = os.path.join(app_images_dir, 'launchscreen_base.png')

# Full path to json file containing pages description
content_json_fn = os.path.join(content_dir, 'pages.json')

# Full path to glossary json file
content_glossary_fn = os.path.join(content_dir, 'glossary.json')

# Full path to structures json file
content_structures_fn = os.path.join(content_dir, 'structures.json')

# The following json file contains glossary words "bindings": it defines,
# for each glossary word, which is the corresponding app page
content_glossary_bindings_fn = os.path.join(
    content_dir,
    'glossary_bindings.json')

# Pdf files used by app pages are located inside this folder
pdf_dir = os.path.join(content_dir, 'pdf')

# Target directory (on android) for pdf files.
android_target_pdf_dir = os.path.join(app_dir, 'android', 'app', 'src', 'main', 'assets', 'pdf')

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


def clean_android_target_pdf_dir():
    """Prepare the target directory for pdf files on android."""
    if os.path.exists(android_target_pdf_dir):
        shutil.rmtree(android_target_pdf_dir)


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

    # Remove whitespaces from pdf filename otherwise there could be errors while opening the
    # document on iOS devices
    basename = '_'.join(basename.split(' '))

    same_pdf = 0
    for f in os.listdir(pdf_dir):
        if f.decode('utf-8').lower().startswith(basename):
            same_pdf += 1

    suffix = '' if same_pdf == 0 else '{}'.format(same_pdf)
    return basename + suffix + '.pdf'


def load_json(fn):
    if not os.path.isfile(fn):
        print '\t\tFAIL: cannot find page.json file'
        return None

    try:
        with open(fn, 'r') as f:
            json_content = json.loads(f.read().decode('utf-8-sig'))
    except ValueError:
        print '\t\tFAIL: malformed json file'
        return None

    return json_content


def generate_react_native_from_markdown(mdfile, images_dir):
    """Generate react-native code from markdown file."""
    rn_renderer = RNRenderer(images_dir=images_dir, warning_prefix='\t\t')

    # Use log=True to print the actual renderer calls from mistune engine
    wrapper = RendererWrapper(rn_renderer, log=False)
    renderer = mistune.Markdown(renderer=wrapper)

    # Produce react-native code
    react_native_code = renderer(open(mdfile, 'r').read())

    # The following line ensures that all react native code related to images
    # is flushed from the renderer wrapper (e.g. when a markdown document
    # terminates with an image stripe with no following text)
    react_native_code += wrapper.flush_images()

    # Wrap react-native code inside a container view
    return ('<View style={{markdown.container}}>\n{}\n</View>').format(
        react_native_code)


def import_editor_markdown_file(mdfile_dir,
                                output_content_dir,
                                output_dirname,
                                create_empty_mdfile=False):
    """Import markdown file and data from editor to app directory tree."""

    # Create output directory if it does not exist
    if not os.path.isdir(output_content_dir):
        os.makedirs(output_content_dir)

    # Make sure source directory exists
    if not os.path.isdir(mdfile_dir):
        print 'Cannot find directory:', mdfile_dir
        return

    # Compute output directory
    output_markdown_dir = os.path.join(output_content_dir, output_dirname)

    # Create empty target structure directory
    if os.path.isdir(output_markdown_dir):
        shutil.rmtree(output_markdown_dir)
    os.makedirs(output_markdown_dir)

    # We know that input directory has only one markdown file with
    # the same name (content.md)
    input_mdfile = os.path.join(mdfile_dir, 'content.md')
    output_mdfile = os.path.join(output_markdown_dir, 'content.md')

    # Copy markdown file or create empty one if requested
    if os.path.isfile(input_mdfile):
        shutil.copy(input_mdfile, output_mdfile)
    else:
        if create_empty_mdfile:
            print 'Generating empty markdown file.'
            with open(output_mdfile, 'w') as f:
                f.write('# Empty Markdown\n')
        else:
            # If there is nothing to import then return
            print 'Cannot find markdown file in {}', mdfile_dir
            return

    # Copy markdown images if needed
    input_mdimages_dir = os.path.join(mdfile_dir, 'md-imgs')
    if os.path.isdir(input_mdimages_dir):
        output_mdimages_dir = os.path.join(output_markdown_dir, 'md-imgs')
        shutil.copytree(input_mdimages_dir, output_mdimages_dir)
