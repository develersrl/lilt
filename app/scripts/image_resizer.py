#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import shutil
from PIL import Image


if __name__ == '__main__':
    if (len(sys.argv) != 4 or
            not os.path.isdir(sys.argv[1])):
        print 'Usage: python image_resizer.py <dir> <base_width> <base_height>'
        sys.exit(1)

    imgs = [f for f in os.listdir(sys.argv[1]) if f.endswith('png')]

    outdir = os.path.join(sys.argv[1], 'out')
    if os.path.isdir(outdir):
        shutil.rmtree(outdir)
    os.makedirs(outdir)

    for img in imgs:
        input_fn = os.path.join(sys.argv[1], img)
        print 'Processing ' + img
        (filename, fileext) = os.path.splitext(img)
        filenames = [
            img,
            filename + '@2x' + fileext,
            filename + '@3x' + fileext
        ]

        for (i, fn) in enumerate(filenames):
            output_fn = os.path.join(outdir, fn)
            multiplier = i + 1
            try:
                im = Image.open(input_fn)
                sz = (int(sys.argv[2]) * multiplier,
                      int(sys.argv[3]) * multiplier)
                im.thumbnail(sz, Image.ANTIALIAS)
                print '\t-> {} ({} x {})'.format(fn, sz[0], sz[1])
                im.save(output_fn)
            except:
                pass

    print 'Done'
