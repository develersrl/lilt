#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import mistune
import requests


class Wrapper(object):
    """Generic class wrapper.

    Use case: you need to add the support for a new markdown feature but you
    do not know which renderer method to override.
    In this case you can build mistune renderer this way:

        renderer = mistune.Markdown(renderer=Wrapper(RNRenderer()))
        renderer(<markdown-code-here>)

    Called methods will be printed on stdout.
    """
    def __init__(self, wrapped_class):
        self.wrapped_class = wrapped_class

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
        return """
            <View style={{markdown.paragraph}}>
                <Text>\n{}\n</Text>
            </View>
            """.format(text)

    def image(self, src, title, text):
        """Rendering a image with title and text.

        :param src: source link of the image.
        :param title: title text of the image (not supported yet).
        :param text: alt text of the image.
        """

        # TODO: (3) [MD Image] Add support to alt text and image title.

        if src == '':
            return ''

        # this variable will hold the complete path to the local image file
        target_image_fn = ''

        if src.startswith('http://') or src.startswith('https://'):
            # if image source is an external url we download the image and
            # save it to the images folder
            print '\t\tdownloading image: {}..'.format(src)

            # compute the target image file basename (e.g. image_002.png)
            image_basename = 'image_{}.png'.format(
                str(self.__image_counter).zfill(3)
                )
            self.__image_counter += 1

            # download image from url and save it to target image file
            target_image_fn = os.path.join(
                self.__images_dir,
                'downloaded',
                image_basename
                )

            with open(target_image_fn, 'wb') as f:
                f.write(requests.get(src).content)
        else:
            # in case of local image..
            target_image_fn = os.path.join(self.__images_dir, 'static', src)

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

        return '<Image style={{image}} source={{{}}} />\n'.format(source_value)

    def text(self, txt):
        """Rendering unformatted text.

        :param text: text content.
        """
        return '<Text>{}</Text>'.format(txt)

    def emphasis(self, text):
        """Generate emphasized (italic) text from markdown."""
        return '<Text style={{{{fontStyle: "italic"}}}}>{}</Text>'.format(text)

    def double_emphasis(self, text):
        """Generate double-emphasized (bold) text from markdown."""
        return '<Text style={{{{fontWeight: "bold"}}}}>{}</Text>'.format(text)
