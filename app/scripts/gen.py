#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import json
from jinja2 import Environment, FileSystemLoader
import mistune

from rn_renderer import RNRenderer, Wrapper


__content_dir = None  # content directory path
__pages_json_fn = None  # pages.json filename
__templates_dir = None  # js templates directory path
__target_pages_dir = None  # generated pages directory
__target_navigation_dir = None  # app "navigation" directory
__markdown_dir = None  # source markdown files directory
__j2_env = None  # jinja2 environment
__md_renderer = None  # react-native markdown renderer


def __init():
    """Initialize global variables."""
    global __content_dir, __pages_json_fn, __templates_dir, __target_pages_dir
    global __target_navigation_dir, __markdown_dir, __j2_env, __md_renderer

    script_dir = os.path.dirname(os.path.realpath(__file__))
    app_dir = os.path.dirname(script_dir)
    __content_dir = os.path.join(app_dir, 'content')
    __pages_json_fn = os.path.join(__content_dir, 'pages.json')
    __templates_dir = os.path.join(__content_dir, 'templates')
    __markdown_dir = os.path.join(__content_dir, 'markdown')
    __target_pages_dir = os.path.join(app_dir, 'js', 'pages')
    __target_navigation_dir = os.path.join(app_dir, 'js', 'navigation')

    # initialize Jinja environment to work on "templates" directory
    __j2_env = Environment(loader=FileSystemLoader(__templates_dir))

    # initialize markdown-to-react-native renderer
    # Use the Wrapper class if you want to see which renderer function are
    # called (e.g. when adding the support for new markdown tokens).
    # __md_renderer = mistune.Markdown(renderer=Wrapper(RNRenderer))
    __md_renderer = mistune.Markdown(renderer=RNRenderer())

    # create the target "pages" directory if it does not exist
    if not os.path.exists(__target_pages_dir):
        os.makedirs(__target_pages_dir)

    return (os.path.isdir(__content_dir) and
            os.path.isfile(__pages_json_fn) and
            os.path.isdir(__templates_dir) and
            os.path.isdir(__markdown_dir) and
            os.path.isdir(__target_pages_dir) and
            os.path.isdir(__target_navigation_dir))


def __get_page_component_filename_from_page_data(page_data):
    """Return a generated page component filename from json page data."""
    return "{}_{}.js".format(page_data["style"], str(page_data["id"]).zfill(2))


def __get_page_component_classname_from_page_data(page_data):
    """Return a generated page component classname from json page data."""

    if page_data.get("start_page", False):
        return "StartPage"

    return "{}{}".format(
        page_data["style"].capitalize(),
        str(page_data["id"]).zfill(2)
        )


def __gen_markdown(markdown_data):
    """Generate react-native code from markdown."""
    global __markdown_dir, __md_renderer

    # read input markdown file
    with open(os.path.join(__markdown_dir, markdown_data["source"]), 'r') as f:
        markdown_code = f.read()

    # render react-native code and enclose everything inside a View
    return '<View>{}</View>'.format(__md_renderer(markdown_code))


def __gen_button(button_data):
    """Generate a button block inside a page."""
    pressImpl = "this.props.navigator.push(this.props.getRoute({}))".format(
        button_data["link"]
        )

    return "<Button text={{'{}'}} onPress={{() => {}}} />".format(
        button_data["text"],
        pressImpl
        )


def __gen_page(page_data):
    """Generate a page component."""
    global __templates_dir, __target_pages_dir, __j2_env

    print "Generating page {}..".format(page_data["id"])

    # generate page content
    content = page_data.get("content", {})
    replacements = {}
    for (block_id, block_data) in content.iteritems():
        # use content type (e.g. "button") to call generation fun by name
        genfun = globals()["__gen_" + block_data["type"]]
        replacements[block_id] = genfun(block_data)

    # write output file
    target_basename = __get_page_component_filename_from_page_data(page_data)
    target_fn = os.path.join(__target_pages_dir, target_basename)
    template_name = page_data["style"] + ".tmpl.js"
    with open(target_fn, 'w') as f:
        f.write(__j2_env.get_template(template_name).render(**replacements))

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


def __gen_navigation():
    """Generate app navigation code."""
    global __content_dir, __pages_json_fn, __target_pages_dir, __j2_env
    global __target_navigation_dir

    # load source json file
    with open(__pages_json_fn, 'r') as f:
        pages_data = json.load(f)

    # iterate over json pages and build react-native navigation routes
    initial_route_id = -1
    routes_list = []
    for page_data in pages_data:
        # store initial route id for later use
        if page_data.get('start_page', False):
            initial_route_id = page_data["id"]

        # compute navigation component (e.g. "pages.Glossary")
        comp_class = __get_page_component_classname_from_page_data(page_data)
        comp_class = 'pages.{}'.format(comp_class)

        # store route code
        routes_list.append("{}: {{ title: '{}', component: {} }}".format(
            page_data['id'],
            page_data.get('title', ''),
            comp_class
            ))

    # assemble routes data
    routes_code = 'const routes = {{\n  {},\n}};'.format(
        ',\n  '.join(routes_list))

    # stop generation if initial route is not found
    if initial_route_id < 0:
        print 'Initial route not found!'
        return False

    # generate initial route code
    initial_route_code = 'const initialRouteId = {};'.format(initial_route_id)

    # compute jinja template replacements
    replacements = {
        "routes": routes_code,
        "initialRouteId": initial_route_code
    }

    # generate navigator_data.js file
    target_file = os.path.join(__target_navigation_dir, 'navigator_data.js')
    with open(target_file, 'w') as f:
        f.write(__j2_env.get_template('navigator_data.tmpl.js').render(
            **replacements
            ))

    return True


if __name__ == '__main__':
    ok = __init() and __gen_pages() and __gen_navigation()
    sys.exit(0 if ok else 1)
