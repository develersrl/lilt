#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import json
import shutil
from jinja2 import Environment, FileSystemLoader

import common
from editor_data_importer import *


# jinja2 environment
j2_env = Environment(loader=FileSystemLoader(common.templates_dir))
pages_array = []


def __get_page_component_filename_from_page_data(page_data):
    """Return a generated page component filename from json page data."""
    return "{}_{}.js".format(page_data["style"], str(page_data["id"]).zfill(2))


def __get_page_component_classname_from_page_data(page_data):
    """Return a generated page component classname from json page data."""
    return "{}{}".format(page_data["style"].capitalize(),
                         str(page_data["id"]).zfill(2))


def __gen_markdown(page_id, markdown_data):
    """Generate react-native code from markdown."""
    page_dir = common.get_content_page_dir(page_id)
    mdfile = os.path.join(page_dir, markdown_data["source"])
    return common.generate_react_native_from_markdown(mdfile, page_dir)


def __gen_button(page_id, button_data):
    """Generate a button block inside a page."""
    pressImpl = 'this.props.navigator.push(this.props.getRoute("{}"))'.format(
        button_data["link"])

    return "<Button text={{'{}'}} onPress={{() => {}}} />".format(
        button_data["text"],
        pressImpl)


def __gen_link_list_item(page_id, item_data):
    linkcode = "() => navigator.push(getRoute('{}'))".format(item_data['link'])

    final_item = item_data.get('final', False)
    show_separator = not final_item

    return (
        "<LinkListItem title={{\"{}\"}} caption={{\"{}\"}} "
        "onLinkPress={{{}}} showSeparator={{{}}}/>"
        .format(item_data['title'].encode('utf-8'),
                item_data['caption'].encode('utf-8'),
                linkcode, 'true' if show_separator else 'false'))


def __gen_image_require(page_id, image_data):
    if image_data['name'] == '':
        return 'require("../../../images/header_fallback.png")'

    return 'require("../../../content/pages/{}/{}")'.format(
        page_id,
        image_data['name'])


def __gen_pdf(page_id, pdf_data):
    return pdf_data['name'].encode('utf-8')


def __gen_raw_text(page_id, text_data):
    return text_data['value'].encode('utf-8')


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
            '\n'.join(content))

    return '\n'.join(content)


def __gen_page(page_data):
    """Generate a page component."""
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
    target_fn = os.path.join(common.target_pages_dir, target_basename)
    template_name = page_data["style"] + ".tmpl.js"
    with open(target_fn, 'w') as f:
        tmpl = j2_env.get_template(template_name)
        rendered_tmpl = tmpl.render(**replacements)

        # Since Jinja works with Unicode we need to convert react native code
        # back to utf-8 encoding before writing to target file.
        f.write(rendered_tmpl.encode('utf-8'))

    return True


def __fill_pages_array():
    """Fill the array of to-be-generated pages."""
    global pages_array

    # load source json file
    with open(common.content_json_fn, 'r') as f:
        pages_data = json.load(f)

    # Enrich json pages with data imported from editor
    pages_array = pages_data + import_editor_data()


def __gen_pages():
    """Generate application pages."""
    common.clean_target_pages_dir()
    common.clean_pdf_dir()

    if not (os.path.isdir(common.content_dir) and
            os.path.isfile(common.content_json_fn) and
            os.path.isdir(common.templates_dir) and
            os.path.isdir(common.target_pages_dir) and
            os.path.isdir(common.target_navigation_dir)):
        return False

    __fill_pages_array()

    print '***** Generating app code from app data *****'
    print 'Generating code for {} pages..'.format(len(pages_array))
    index_imports, index_exports = [], []
    for page_data in pages_array:
        # generate page component file
        if not __gen_page(page_data):
            return False

        # generate component data for pages index.js file
        comp_name = __get_page_component_classname_from_page_data(page_data)
        comp_file = __get_page_component_filename_from_page_data(page_data)
        import_line = "import {} from './{}';".format(comp_name, comp_file)
        index_imports.append(import_line)
        index_exports.append(comp_name)

    index_imports.append(
        "import getStructureDescription from './structures_descriptions';")
    index_exports.append('getStructureDescription');

    # generate index.js file
    pages_index_fn = os.path.join(common.target_pages_dir, 'index.js')
    with open(pages_index_fn, 'w') as indexf:
        indexf.write(j2_env.get_template('index.tmpl.js').render(
            imports='\n'.join(index_imports),
            exports=', '.join(index_exports)))

    return True


def __gen_structures():
    print 'Generating structures..'

    # Simple markdown component template
    mdComp = """
class {} extends Component {{
  render() {{
    return (
      {}
      );
  }}
}}
    """

    ccodes = []
    mappings = []
    for struct_dir in common.listdir_nohidden(common.content_structures_dir):
        # Nothing to generate if there is no markdown file
        input_dir = os.path.join(common.content_structures_dir, struct_dir)
        input_mdfile = os.path.join(input_dir, 'content.md')
        if not os.path.isfile(input_mdfile):
            continue

        # Generate structure description code
        component_class_name = struct_dir.strip().capitalize()
        print 'Generating component: ' + component_class_name
        react_native_code = common.generate_react_native_from_markdown(
            input_mdfile, input_dir)

        # Generate component descriptor
        component_code = mdComp.format(component_class_name, react_native_code)
        ccodes.append(component_code.decode('utf-8'))
        mappings.append("  '{}': () => <{} />,".format(
            struct_dir, component_class_name))

    # Generate jinja replacements
    replacements = {
        'components': '\n\n'.join(ccodes),
        'mappings': '\n'.join(mappings)
    }

    # Generate structures
    target_fn = os.path.join(common.target_pages_dir,
                             'structures_descriptions.js')
    with open(target_fn, 'w') as f:
        tmpl = j2_env.get_template('structures_descriptions.tmpl.js')
        rendered_tmpl = tmpl.render(**replacements)
        f.write(rendered_tmpl.encode('utf-8'))

    return True


def __gen_navigation():
    """Generate app navigation code."""
    print 'Generating navigation'

    # iterate over json pages and build react-native navigation routes
    routes_list = []
    for page_data in pages_array:
        # compute navigation component (e.g. "pages.Glossary")
        comp_class = __get_page_component_classname_from_page_data(page_data)
        comp_class = 'pages.generated.{}'.format(comp_class)

        # store route code
        routes_list.append("'{}': {{ title: \"{}\", component: {} }}".format(
            '#{}'.format(page_data['id']),
            page_data.get('title', '').encode('utf-8'),
            comp_class))

    # assemble routes data
    routes_code = 'const generatedRoutes = {{\n  {},\n}};'.format(
        ',\n  '.join(routes_list))

    # Load "glossary bindings" json file which contains correspondences
    # between glossary words and app pages ids.
    # We translate the correspondences to a Javascript object.
    glossary_bindings = common.load_json(common.content_glossary_bindings_fn)
    bindings = []
    for (word, page_id) in glossary_bindings.iteritems():
        bindings.append("  '{}': '#{}'".format(word, page_id))

    bindings_code = 'const glossaryBindings = {{\n{}\n}};'.format(
        ',\n'.join(bindings))

    # compute jinja template replacements
    replacements = {
        'generatedRoutes': routes_code.decode('utf-8'),
        'glossaryBindings': bindings_code.decode('utf-8')
    }

    # generate navigator_data.js file
    target_file = os.path.join(
        common.target_navigation_dir,
        'navigator_data.js')

    with open(target_file, 'w') as f:
        tmpl = j2_env.get_template('navigator_data.tmpl.js')
        rendered_tmpl = tmpl.render(**replacements)
        f.write(rendered_tmpl.encode('utf-8'))

    return True


def __copy_pdf():
    print 'Copy pdf'
    common.clean_android_target_pdf_dir()
    shutil.copytree(common.pdf_dir, common.android_target_pdf_dir)
    return True


def __finalcleanup():
    print 'Final cleanup'

    # This is the list of generated pages id
    generated_pages = [descriptor['id'] for descriptor in pages_array]

    # Get directory names inside "content/pages" folder
    data_dirs = common.listdir_nohidden(common.content_pages_dir)

    # Compute "dead" directories inside "content/pages" folder and remove them
    dirs_to_delete = [d for d in data_dirs if d not in generated_pages]
    for d in dirs_to_delete:
        shutil.rmtree(os.path.join(common.content_pages_dir, d))

    print '\nDone!'
    return True


if __name__ == '__main__':
    ok = (
        __gen_pages() and
        __gen_structures() and
        __gen_navigation() and
        __copy_pdf() and
        __finalcleanup()
        )
    sys.exit(0 if ok else 1)
