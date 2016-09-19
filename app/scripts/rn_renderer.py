#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import mistune
import requests



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
        """Render a text paragraph."""
        # We enclose everything inside a View component to apply paragraph
        # margins (see markdown.paragraph style). The paragraph body is
        # enclosed in a Text, too. In this wary we can emphasize wingle words
        # on the same line (see http://stackoverflow.com/questions/35718143)
        return '<Text style={{markdown.paragraph}}>{}</Text>'.format(text)


    def image(self, src, title, text):
        """Rendering a image with title and text.

        :param src: source link of the image.
        :param title: title text of the image (not supported yet).
        :param text: alt text of the image.
        """

        # TODO: (3) [MD Image] Add support to alt text and image title.

        if src == '':
            return ''

        # this variable holds the complete path to the local image file
        target_image_fn = os.path.join(self.__images_dir, src)

        # compute the react-native require statement to use the local image
        source_value = 'require("{}")'.format(target_image_fn)

        # NOTE: (0) Image size from markdown is not currently supported.
        # But it should be, otherwise there is no easy way to generate a
        # resized image.
        # Unfortunately image size support in gfm is defunct, but we could
        # implement it for our renderer (we should also make sure that such
        # syntax is supported in the user editor):
        #
        #   ![alt-text](logo.png =200x200)
        #
        # Note the space after the image source.

        return '<Image style={{markdown.image}} source={{{}}} />\n'.format(source_value)


    def image_stripe(self, images):
        # print images
        image_size = '[420, 420]'  # TODO: compute image size

        sources = []
        for (imgsrc, _, _) in images:
            imgfn = os.path.join(self.__images_dir, imgsrc)
            sources.append("require('{}')".format(imgfn))
        sources_code = '[{}]'.format(','.join(sources))

        return '\n<Stripe imageSize={{{}}} sources={{{}}} />\n'.format(
            image_size,
            sources_code
            )


    def text(self, txt):
        """Rendering unformatted text.

        :param text: text content.
        """
        return '<Text>{}</Text>'.format(txt)


    def emphasis(self, text):
        """Generate emphasized (italic) text from markdown."""
        return '<Text style={{markdown.emphasis}}>{}</Text>'.format(text)


    def double_emphasis(self, text):
        """Generate double-emphasized (bold) text from markdown."""
        return '<Text style={{markdown.doubleEmphasis}}>{}</Text>'.format(text)
