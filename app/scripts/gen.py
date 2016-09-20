#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import json
import shutil
from jinja2 import Environment, FileSystemLoader
import mistune

from renderer_wrapper import RendererWrapper
from rn_renderer import RNRenderer
from editor_data_importer import *


__content_dir = None  # content directory path
__pages_json_fn = None  # pages.json filename
__templates_dir = None  # js templates directory path
__target_pages_dir = None  # generated pages directory
__target_navigation_dir = None  # app "navigation" directory
__j2_env = None  # jinja2 environment
__pages_obj = {}


def __init():
    """Initialize global variables."""
    global __content_dir, __pages_json_fn, __templates_dir, __target_pages_dir
    global __target_navigation_dir, __j2_env

    script_dir = os.path.dirname(os.path.realpath(__file__))
    app_dir = os.path.dirname(script_dir)
    __content_dir = os.path.join(app_dir, 'content')
    __pages_json_fn = os.path.join(__content_dir, 'pages.json')
    __templates_dir = os.path.join(app_dir, 'templates')
    __target_pages_dir = os.path.join(app_dir, 'js', 'pages', 'generated')
    __target_navigation_dir = os.path.join(app_dir, 'js', 'navigation')

    # initialize Jinja environment to work on "templates" directory
    __j2_env = Environment(loader=FileSystemLoader(__templates_dir))

    # create the target "pages" directory if it does not exist
    if not os.path.exists(__target_pages_dir):
        os.makedirs(__target_pages_dir)

    return (os.path.isdir(__content_dir) and
            os.path.isfile(__pages_json_fn) and
            os.path.isdir(__templates_dir) and
            os.path.isdir(__target_pages_dir) and
            os.path.isdir(__target_navigation_dir))


def __get_page_component_filename_from_page_data(page_data):
    """Return a generated page component filename from json page data."""
    return "{}_{}.js".format(page_data["style"], str(page_data["id"]).zfill(2))


def __get_page_component_classname_from_page_data(page_data):
    """Return a generated page component classname from json page data."""
    return "{}{}".format(
        page_data["style"].capitalize(),
        str(page_data["id"]).zfill(2)
        )


def __get_page_dir(page_id):
    global __content_dir
    return os.path.join(__content_dir, 'pages', page_id)


def __gen_markdown(page_id, markdown_data):
    """Generate react-native code from markdown."""
    page_dir = __get_page_dir(page_id)
    rn_renderer = RNRenderer(images_dir=page_dir)
    # Use log=True to print the actual renderer calls from mistune engine
    wrapper = RendererWrapper(rn_renderer, log=False)
    renderer = mistune.Markdown(renderer=wrapper)

    # read input markdown file
    with open(os.path.join(page_dir, markdown_data["source"]), 'r') as f:
        markdown_code = f.read()

    react_native_code = renderer(markdown_code)

    # The following line ensures that all react native code related to images
    # is flushed from the renderer wrapper (e.g. when a markdown document
    # terminates with an image stripe with no following text)
    react_native_code += wrapper.flush_images()

    return (
        '<View style={{markdown.container}}>\n{}\n</View>').format(
        react_native_code
        )


def __gen_button(page_id, button_data):
    """Generate a button block inside a page."""
    pressImpl = 'this.props.navigator.push(this.props.getRoute("{}"))'.format(
        button_data["link"]
        )

    return "<Button text={{'{}'}} onPress={{() => {}}} />".format(
        button_data["text"],
        pressImpl
        )


def __gen_link_list_item(page_id, item_data):
    linkcode = "() => navigator.push(getRoute('{}'))".format(item_data['link'])
    return (
        "<LinkListItem title={{'{}'}} caption={{'{}'}} onLinkPress={{{}}} />"
        .format(
            item_data['title'],
            item_data['caption'],
            linkcode
            ))


def __gen_image_require(page_id, image_data):
    if image_data['name'] == '':
        return 'require("../../../images/header_fallback.png")'

    return 'require("../../../content/pages/{}/{}")'.format(
        page_id,
        image_data['name']
        )


def __gen_pdf(page_id, pdf_data):
    return pdf_data['name']


def __gen_raw_text(page_id, text_data):
    return text_data['value']


def __gen_array(page_id, array_data):
    """Generate an array of elements."""
    content = []
    for item in array_data['items']:
        genfun = globals()['__gen_' + item['type']]
        content.append(genfun(page_id, item))

    if array_data['enclosedInView']:
        if array_data['orientation'] == 'vertical':
            container_style = 'flexible'
        else:
            container_style = '[flexible, row]'

        return '<View style={{{}}}>\n{}\n</View>'.format(
            container_style,
            '\n'.join(content)
            )

    return '\n'.join(content)


def __gen_page(page_data):
    """Generate a page component."""
    global __templates_dir, __target_pages_dir, __j2_env

    print "\tGenerating page {}".format(page_data["id"])
    content = page_data.get("content", {})

    # Each template is instantiated with a replacement dict
    replacements = {}

    # Iterate over page content items
    for (block_id, block_data) in content.iteritems():
        # Use content type to call generation fun by name.
        # For example, if "type" is "button" then the "__gen_button" function
        # will be called to generate the react native code.
        genfun = globals()["__gen_" + block_data["type"]]

        # The react native code for the specific content item is generated by
        # calling the generator function and decoding the result from utf-8
        # string to Unicode, because Jinja works in "Unicode" mode when it
        # comes to render a template.
        react_native_code = genfun(page_data['id'], block_data).decode('utf-8')
        replacements[block_id] = react_native_code

    # Write the instantiated component to file
    target_basename = __get_page_component_filename_from_page_data(page_data)
    target_fn = os.path.join(__target_pages_dir, target_basename)
    template_name = page_data["style"] + ".tmpl.js"
    with open(target_fn, 'w') as f:
        tmpl = __j2_env.get_template(template_name)
        rendered_tmpl = tmpl.render(**replacements)

        # Since Jinja works with Unicode we need to convert react native code
        # back to utf-8 encoding before writing to target file.
        f.write(rendered_tmpl.encode('utf-8'))

    return True


def clean_pdf_dir():
    """Clean the pdf directory which is populated later."""
    mypath = os.path.dirname(os.path.realpath(__file__))  # "scripts" dir
    appdir = os.path.dirname(mypath)
    pdf_dir = os.path.join(appdir, 'content', 'pdf')

    # Create the pdf directory if it does not exist
    if not os.path.isdir(pdf_dir):
        os.makedirs(pdf_dir)

    # Get the pdf files list and remove them
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('pdf')]
    for pdf_name in pdf_files:
        os.remove(os.path.join(pdf_dir, pdf_name))


def __gen_pages():
    """Generate application pages."""
    global __content_dir, __pages_json_fn, __target_pages_dir, __j2_env
    global __pages_obj

    # Clean the pdf directory
    clean_pdf_dir()

    # load source json file
    with open(__pages_json_fn, 'r') as f:
        pages_data = json.load(f)

    # Enrich json pages with data imported from editor
    pages_data += import_editor_data()
    __pages_obj = pages_data

    # delete and recreate target pages directory
    print '***** Generating app code from app data *****'
    print 'Cleaning generated pages directory'
    if os.path.isdir(__target_pages_dir):
        shutil.rmtree(__target_pages_dir)
    os.mkdir(__target_pages_dir)

    print 'Generating code for {} pages..'.format(len(pages_data))
    index_imports, index_exports = [], []
    for page_data in pages_data:
        # generate page component file
        if not __gen_page(page_data):
            return False

        # generate component data for pages index.js file
        comp_name = __get_page_component_classname_from_page_data(page_data)
        comp_file = __get_page_component_filename_from_page_data(page_data)
        import_line = "import {} from './{}';".format(comp_name, comp_file)
        index_imports.append(import_line)
        index_exports.append(comp_name)

    # generate index.js file
    pages_index_fn = os.path.join(__target_pages_dir, 'index.js')

    with open(os.path.join(__target_pages_dir, 'index.js'), 'w') as indexf:
        indexf.write(__j2_env.get_template('index.tmpl.js').render(
            imports='\n'.join(index_imports),
            exports=', '.join(index_exports)
            ))

    return True


def __gen_navigation():
    """Generate app navigation code."""
    global __content_dir, __pages_json_fn, __target_pages_dir, __j2_env
    global __target_navigation_dir, __pages_obj
    print 'Generating navigation'

    # iterate over json pages and build react-native navigation routes
    routes_list = []
    for page_data in __pages_obj:
        # compute navigation component (e.g. "pages.Glossary")
        comp_class = __get_page_component_classname_from_page_data(page_data)
        comp_class = 'pages.generated.{}'.format(comp_class)

        # store route code
        routes_list.append("'{}': {{ title: '{}', component: {} }}".format(
            '#{}'.format(page_data['id']),
            page_data.get('title', ''),
            comp_class
            ))

    # assemble routes data
    routes_code = 'const generatedRoutes = {{\n  {},\n}};'.format(
        ',\n  '.join(routes_list)
        )

    # compute jinja template replacements
    replacements = {
        "generatedRoutes": routes_code
    }

    # generate navigator_data.js file
    target_file = os.path.join(__target_navigation_dir, 'navigator_data.js')
    with open(target_file, 'w') as f:
        f.write(__j2_env.get_template('navigator_data.tmpl.js').render(
            **replacements
            ))

    print '\nDone!'
    return True


if __name__ == '__main__':
    ok = __init() and __gen_pages() and __gen_navigation()
    sys.exit(0 if ok else 1)
