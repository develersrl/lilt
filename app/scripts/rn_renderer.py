#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import cgi
import mistune
from PIL import Image



class RNRenderer(mistune.Renderer):
    """Markdown to react-native renderer.

    Methods documentation taken from mistune default html renderer:
    https://github.com/lepture/mistune/blob/master/mistune.py

    Renderer methods are splitted in two blocks: the first block holds the
    "supported" renderer methods (the ones that actually produce react
    native code) while the second block just overrides the remaining
    mistune.Renderer methods by returning empty strings and printing a
    warning message.
    """

    def __init__(self, **kwargs):
        super(RNRenderer, self).__init__(**kwargs)
        # all images will be downloaded-in/fetched-from a particular directory
        self.__images_dir = kwargs.get('images_dir', '')
        self.__warning_prefix = kwargs.get('warning_prefix', '')

    # ------------- Supported renderer methods --------------------------------
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
        txt_tmpl = '<Text style={{markdown.paragraphText}}>{}</Text>'
        txt = txt_tmpl.format(text)
        tmpl = '<View style={{markdown.paragraph}}>{}</View>'
        return tmpl.format(txt)


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
        return '<Text style={{markdown.text}}>{}</Text>'.format(
            self.escape(txt))


    def emphasis(self, text):
        """Generate emphasized (italic) text from markdown."""
        return '<Text style={{markdown.emphasis}}>{}</Text>'.format(text)


    def double_emphasis(self, text):
        """Generate double-emphasized (bold) text from markdown."""
        return '<Text style={{markdown.doubleEmphasis}}>{}</Text>'.format(text)


    def placeholder(self):
        """Returns the default, empty output value for the renderer.
        All renderer methods use the '+=' operator to append to this value.
        Default is a string so rendering HTML can build up a result string with
        the rendered Markdown.
        Can be overridden by Renderer subclasses to be types like an empty
        list, allowing the renderer to create a tree-like structure to
        represent the document (which can then be reprocessed later into a
        separate format like docx or pdf).
        """
        return ''


    def link(self, link, title, text):
        """Rendering a given link with content and title.
        :param link: href link for ``<a>`` tag.
        :param title: title content for `title` attribute.
        :param text: text content for description.
        """
        onPressCode = '() => openURL("{}")'.format(link)
        tmpl = '<Text style={{markdown.link}} onPress={{{}}}>{}</Text>'
        return tmpl.format(onPressCode, text)
    # -------------------------------------------------------------------------


    # ------------- Not supported renderer methods ----------------------------
    def block_code(self, code, lang=None):
        """Rendering block level code. ``pre > code``.
        :param code: text content of the code block.
        :param lang: language of the given code.
        """

        """
        code = code.rstrip('\n')
        if not lang:
            code = escape(code, smart_amp=False)
            return '<pre><code>%s\n</code></pre>\n' % code
        code = escape(code, quote=True, smart_amp=False)
        return '<pre><code class="lang-%s">%s\n</code></pre>\n' % (lang, code)
        """

        self.print_warning('block_code')
        return ''


    def block_quote(self, text):
        """Rendering <blockquote> with the given text.
        :param text: text content of the blockquote.
        """

        # return '<blockquote>%s\n</blockquote>\n' % text.rstrip('\n')

        self.print_warning('block_quote')
        return ''


    def block_html(self, html):
        """Rendering block level pure html content.
        :param html: text content of the html snippet.
        """

        """
        if self.options.get('skip_style') and \
           html.lower().startswith('<style'):
            return ''
        if self.options.get('escape'):
            return escape(html)
        return html
        """

        self.print_warning('block_html')
        return ''


    def hrule(self):
        """Rendering method for ``<hr>`` tag."""

        """
        if self.options.get('use_xhtml'):
            return '<hr />\n'
        return '<hr>\n'
        """

        self.print_warning('hrule')
        return ''


    def list(self, body, ordered=True):
        """Rendering list tags like ``<ul>`` and ``<ol>``.
        :param body: body contents of the list.
        :param ordered: whether this list is ordered or not.
        """

        """
        tag = 'ul'
        if ordered:
            tag = 'ol'
        return '<%s>\n%s</%s>\n' % (tag, body, tag)
        """

        self.print_warning('list')
        return ''


    def list_item(self, text):
        """Rendering list item snippet. Like ``<li>``."""

        # return '<li>%s</li>\n' % text

        self.print_warning('list_item')
        return ''


    def table(self, header, body):
        """Rendering table element. Wrap header and body in it.
        :param header: header part of the table.
        :param body: body part of the table.
        """

        """
        return (
            '<table>\n<thead>%s</thead>\n'
            '<tbody>\n%s</tbody>\n</table>\n'
        ) % (header, body)
        """

        self.print_warning('table')
        return ''


    def table_row(self, content):
        """Rendering a table row. Like ``<tr>``.
        :param content: content of current table row.
        """

        # return '<tr>\n%s</tr>\n' % content

        self.print_warning('table_row')
        return ''


    def table_cell(self, content, **flags):
        """Rendering a table cell. Like ``<th>`` ``<td>``.
        :param content: content of current table cell.
        :param header: whether this is header or not.
        :param align: align of current table cell.
        """

        """
        if flags['header']:
            tag = 'th'
        else:
            tag = 'td'
        align = flags['align']
        if not align:
            return '<%s>%s</%s>\n' % (tag, content, tag)
        return '<%s style="text-align:%s">%s</%s>\n' % (
            tag, align, content, tag
        )
        """

        self.print_warning('table_cell')
        return ''


    def codespan(self, text):
        """Rendering inline `code` text.
        :param text: text content for inline code.
        """

        """
        text = escape(text.rstrip(), smart_amp=False)
        return '<code>%s</code>' % text
        """

        self.print_warning('codespan')
        return ''


    def linebreak(self):
        """Rendering line break like ``<br>``."""

        """
        if self.options.get('use_xhtml'):
            return '<br />\n'
        return '<br>\n'
        """

        self.print_warning('linebreak')
        return ''


    def strikethrough(self, text):
        """Rendering ~~strikethrough~~ text.
        :param text: text content for strikethrough.
        """

        # return '<del>%s</del>' % text

        self.print_warning('strikethrough')
        return ''


    def autolink(self, link, is_email=False):
        """Rendering a given link or email address.
        :param link: link content or email address.
        :param is_email: whether this is an email or not.
        """

        """
        text = link = escape(link)
        if is_email:
            link = 'mailto:%s' % link
        return '<a href="%s">%s</a>' % (link, text)
        """

        self.print_warning('autolink')
        return ''


    def inline_html(self, html):
        """Rendering span level pure html content.
        :param html: text content of the html snippet.
        """

        """
        if self.options.get('escape'):
            return escape(html)
        """

        self.print_warning('inline_html')
        return ''


    def newline(self):
        """Rendering newline element."""
        self.print_warning('newline')
        return ''


    def footnote_ref(self, key, index):
        """Rendering the ref anchor of a footnote.
        :param key: identity key for the footnote.
        :param index: the index count of current footnote.
        """

        """
        html = (
            '<sup class="footnote-ref" id="fnref-%s">'
            '<a href="#fn-%s" rel="footnote">%d</a></sup>'
        ) % (escape(key), escape(key), index)
        """

        self.print_warning('footnote_ref')
        return ''


    def footnote_item(self, key, text):
        """Rendering a footnote item.
        :param key: identity key for the footnote.
        :param text: text content of the footnote.
        """

        """
        back = (
            '<a href="#fnref-%s" rev="footnote">&#8617;</a>'
        ) % escape(key)
        text = text.rstrip()
        if text.endswith('</p>'):
            text = re.sub(r'<\/p>$', r'%s</p>' % back, text)
        else:
            text = '%s<p>%s</p>' % (text, back)
        html = '<li id="fn-%s">%s</li>\n' % (escape(key), text)
        """

        self.print_warning('footnote_item')
        return ''


    def footnotes(self, text):
        """Wrapper for all footnotes.
        :param text: contents of all footnotes.
        """

        # html = '<div class="footnotes">\n%s<ol>%s</ol>\n</div>\n'

        self.print_warning('footnotes')
        return ''
    # -------------------------------------------------------------------------

    # ------------- Misc ------------------------------------------------------
    def print_warning(self, meth_name):
        print '{}WARNING: markdown "{}" rendering is not supported'.format(
            self.__warning_prefix,
            meth_name)

    def escape(self, text):
        """Rendering escape sequence.
        :param text: text content.
        """
        return cgi.escape(text)
    # -------------------------------------------------------------------------
