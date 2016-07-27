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
        return '<Text style={{markdown.header}}>{}</Text>'.format(text)

    def paragraph(self, text):
        return '<Text style={{markdown.paragraph}}>{}</Text>'.format(text)
