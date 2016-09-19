#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import mistune
from PIL import Image



class RNRenderer(mistune.Renderer):
    """Markdown to react-native renderer.

    Methods documentation taken from mistune default html renderer:
    https://github.com/lepture/mistune/blob/master/mistune.py
    """

    def __init__(self, **kwargs):
        super(RNRenderer, self).__init__(**kwargs)
        # all images will be downloaded-in/fetched-from a particular directory
        self.__images_dir = kwargs.get('images_dir', '')

        # if a markdown image refers to an external url, then we download
        # the image using the following counter as suffix
        self.__image_counter = 1


    def header(self, text, level, raw=None):
        """Render header/heading tags like ``<h1>`` ``<h2>``.

        :param text: rendered text content for the header.
        :param level: a number for the header level, for example: 1.
        :param raw: raw text content of the header.
        """
        return '<Text style={{markdown.header}}>{}</Text>\n'.format(raw)


    def paragraph(self, text):
        """Render a paragraph."""
        # We enclose everything inside a View component to apply paragraph
        # margins (see markdown.paragraph style).
        return '<View style={{markdown.paragraph}}>{}</View>'.format(text)


    def image(self, src, title, text):
        """Rendering a image with title and text.

        :param src: source link of the image.
        :param title: title text of the image (not supported yet).
        :param text: alt text of the image.
        """

        # Return nothing since images are always rendered as image stripes
        return ''


    def image_stripe(self, images):
        # This shouldn't be possible..
        if len(images) == 0:
            return ''

        # All images in the stripe must have the same size.
        # Such size must be passed as property to the Stripe component, so
        # we read the size of the first image.
        first_img_fn = os.path.join(self.__images_dir, images[0][0])
        im = Image.open(first_img_fn)
        image_size = '[{}, {}]'.format(im.size[0], im.size[1])

        # Generate a list of "require" statement for the stripe images
        sources = []
        for (imgsrc, _, _) in images:
            imgfn = os.path.join(self.__images_dir, imgsrc)
            sources.append("require('{}')".format(imgfn))
        sources_code = '[{}]'.format(','.join(sources))

        # Assemble the generated code
        return '\n<Stripe imageSize={{{}}} sources={{{}}} />\n'.format(
            image_size,
            sources_code
            )


    def text(self, txt):
        """Rendering unformatted text.

        :param text: text content.
        """
        return '<Text style={{markdown.text}}>{}</Text>'.format(txt)


    def emphasis(self, text):
        """Generate emphasized (italic) text from markdown."""
        return '<Text style={{markdown.emphasis}}>{}</Text>'.format(text)


    def double_emphasis(self, text):
        """Generate double-emphasized (bold) text from markdown."""
        return '<Text style={{markdown.doubleEmphasis}}>{}</Text>'.format(text)
