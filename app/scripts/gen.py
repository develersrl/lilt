#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import json
from jinja2 import Environment, FileSystemLoader

__content_dir = None  # content directory path
__pages_json_fn = None  # pages.json filename
__templates_dir = None  # js templates directory path
__target_pages_dir = None  # generated pages directory
__j2_env = None


def __init():
    """Initialize global variables."""
    global __content_dir, __pages_json_fn, __templates_dir, __target_pages_dir
    global __j2_env

    script_dir = os.path.dirname(os.path.realpath(__file__))
    app_dir = os.path.dirname(script_dir)
    __content_dir = os.path.join(app_dir, 'content')
    __pages_json_fn = os.path.join(__content_dir, 'pages.json')
    __templates_dir = os.path.join(__content_dir, 'templates')
    __target_pages_dir = os.path.join(app_dir, 'js', 'pages')

    # initialize Jinja environment to work on "templates" directory
    __j2_env = Environment(loader=FileSystemLoader(__templates_dir))

    # create the target "pages" directory if it does not exist
    if not os.path.exists(__target_pages_dir):
        os.makedirs(__target_pages_dir)

    return (os.path.isdir(__content_dir) and
            os.path.isfile(__pages_json_fn) and
            os.path.isdir(__templates_dir) and
            os.path.isdir(__target_pages_dir))


def __get_page_component_filename_from_page_data(page_data):
    """Return a generated page component filename from json page data."""
    return "{}_{}.js".format(page_data["style"], str(page_data["id"]).zfill(2))


def __get_page_component_classname_from_page_data(page_data):
    """Return a generated page component classname from json page data."""
    return "{}{}".format(
        page_data["style"].capitalize(),
        str(page_data["id"]).zfill(2)
        )


def __gen_page(page_data):
    """Generate a page component."""
    global __templates_dir, __target_pages_dir
    print "Generating page {}..".format(page_data["id"])
    template_basename = page_data["style"] + ".tmpl.js"
    template_fn = os.path.join(__templates_dir, template_basename)

    # read input template file
    code = ''
    with open(template_fn, 'r') as in_file:
        code = in_file.read()

    # TODO: instantiate template here

    # write output file
    target_basename = __get_page_component_filename_from_page_data(page_data)
    target_fn = os.path.join(__target_pages_dir, target_basename)
    with open(target_fn, 'w') as f:
        f.write(code)

    return True


def __gen_pages():
    """Generate application pages."""
    global __content_dir, __pages_json_fn, __target_pages_dir, __j2_env

    # load source json file
    with open(__pages_json_fn, 'r') as f:
        pages_data = json.load(f)

    # generate pages components (exit as soon as one page generation fails)
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


if __name__ == '__main__':
    ok = __init() and __gen_pages()
    sys.exit(0 if ok else 1)
