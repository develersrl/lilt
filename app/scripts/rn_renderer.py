#!/usr/bin/env python
# -*- coding: utf-8 -*-

import mistune


class Wrapper(object):
    """Generic class wrapper.

    Use case: you need to add the support for a new markdown feature but you
    do not know which renderer method to override.
    In this case you can build mistune renderer this way:

        renderer = mistune.Markdown(renderer=Wrapper(RNRenderer))
        renderer(<markdown-code-here>)

    Called methods will be printed on stdout.
    """
    def __init__(self, wrapped_class):
        self.wrapped_class = wrapped_class()

    def __getattr__(self, attr):
        orig_attr = self.wrapped_class.__getattribute__(attr)
        if callable(orig_attr):
            def hooked(*args, **kwargs):
                self.log(attr, args, kwargs)
                result = orig_attr(*args, **kwargs)
                # prevent wrapped_class from becoming unwrapped
                if result == self.wrapped_class:
                    return self
                return result
            return hooked
        else:
            return orig_attr

    def log(self, methname, *args, **kwargs):
        print "{}\n\tArgs: {}\n\tKwArgs: {}\n".format(methname, args, kwargs)


class RNRenderer(mistune.Renderer):
    """Markdown to react-native renderer.

    Methods documentation taken from mistune default html renderer:
    https://github.com/lepture/mistune/blob/master/mistune.py
    """

    def header(self, text, level, raw=None):
        """Render header/heading tags like ``<h1>`` ``<h2>``.

        :param text: rendered text content for the header.
        :param level: a number for the header level, for example: 1.
        :param raw: raw text content of the header.
        """
        return '<Text style={{markdown.header}}>{}</Text>\n'.format(raw)

    def paragraph(self, text):
        """Render a text paragraph."""
        return '<View style={{markdown.paragraph}}>\n{}\n</View>'.format(text)

    def image(self, src, title, text):
        """Rendering a image with title and text.

        :param src: source link of the image.
        :param title: title text of the image (not supported yet).
        :param text: alt text of the image.
        """

        # TODO: (3) [MD Image] Add support to alt text and image title.

        if src == '':
            return ''

        if src.startswith('http://') or src.startswith('https://'):
            source_value = '{{uri: "{}"}}'.format(src)
        else:
            # If the image is "local" we require it from a fixed location.
            # Since the markdown is part of an application page, we know the
            # relative path of that fixed location from "pages" folder.
            # TODO: (2) [Renderer] pass img directory in renderer constructor.
            source_value = 'require("../../content/images/{}")'.format(src)

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

        return '<Image style={{image}} source={{{}}} />\n'.format(source_value)

    def text(self, txt):
        """Rendering unformatted text.

        :param text: text content.
        """
        return '<Text>{}</Text>'.format(txt)
