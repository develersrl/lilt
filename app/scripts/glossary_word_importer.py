# -*- coding: utf-8 -*-

import os
import shutil
from collections import defaultdict
import json

import common


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


def generate_glossary(glossary_words):
    """Generate glossary.json file inside "content" directory.

    The glossary_words parameter is an array of dictionaries.
    Each dictionary describes a single glossary word.
    The dictionary shape is the one returned by "import_glossary_word_page"
    function in this file.
    """

    # Compute a dict where keys are uppercase letters and values are lists
    # of words that begin with that letter
    glossary_dict = defaultdict(list)
    words = [d['title'].upper() for d in glossary_words]
    for word in words:
        if word != '':
            glossary_dict[word[0]].append(word)

    # Sort letter words
    for (_, l) in glossary_dict.iteritems():
        l.sort()

    # Compute glossary python object that will bu dumped to json
    glossary_array = []
    for (letter, letterwords) in glossary_dict.iteritems():
        letterarray = []
        for letterword in letterwords:
            letterarray.append({'label': letterword, 'value': letterword})
        glossary_array.append({'label': letter, 'items': letterarray})

    # Pretty prints glossary to json file
    with open(common.content_glossary_fn, 'w') as f:
        json.dump(glossary_array, f,
                  sort_keys=True, indent=4, separators=(',', ': '))

    # Compute bindings between words and corresponding page ids
    glossary_bindings = {}
    for d in glossary_words:
        glossary_bindings[d['title'].upper()] = d['id']

    # Save bindings to json file
    with open(common.content_glossary_bindings_fn, 'w') as f:
        json.dump(glossary_bindings, f,
                  sort_keys=True, indent=4, separators=(',', ': '))
