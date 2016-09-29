#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import shutil
from PIL import Image

import common


# Various directories needed by the script
ios_catalogs_dir = os.path.join(common.asset_catalogs_dir, 'ios')
android_catalogs_dir = os.path.join(common.asset_catalogs_dir, 'android')
ios_app_icons_dir = os.path.join(ios_catalogs_dir, 'app-icons')
ios_launchscreens_dir = os.path.join(ios_catalogs_dir, 'launchscreens')

# iOS app icon sizes
ios_app_icons = [
    ('20pt-1x', [20, 20]),
    ('20pt-2x', [40, 40]),
    ('20pt-3x', [60, 60]),
    ('29pt-1x', [29, 29]),
    ('29pt-2x', [58, 58]),
    ('29pt-3x', [87, 87]),
    ('40pt-1x', [40, 40]),
    ('40pt-2x', [80, 80]),
    ('40pt-3x', [120, 120]),
    ('60pt-2x', [120, 120]),
    ('60pt-3x', [180, 180]),
    ('76pt-1x', [76, 76]),
    ('76pt-2x', [152, 152]),
    ('83-5pt-2x', [167, 167])
]

ios_launch_images = [
    ('iphone-portrait-1x', [320, 480]),
    ('iphone-portrait-2x', [640, 960]),
    ('iphone-portrait-retina-4', [640, 1136]),
    ('ipad-portrait-no-status-bar-1x', [768, 1004]),
    ('ipad-portrait-no-status-bar-2x', [1536, 2048]),
    ('ipad-portrait-1x', [768, 1024]),
    ('ipad-portrait-2x', [1536, 2048]),
    ('ipad-landscape-no-status-bar-1x', [1024, 748]),
    ('ipad-landscape-no-status-bar-2x', [2048, 1496]),
    ('ipad-landscape-1x', [1024, 768]),
    ('ipad-landscape-2x', [2048, 1536]),
    ('iphone-portrait-retina-hd-55', [1242, 2208]),
    ('iphone-portrait-retina-hd-47', [750, 1334]),
    ('iphone-landscape-retina-hd-55', [2208, 1242]),
    ('ipad-pro-12', [2048, 2732])
]


def prepare_folders():
    # Remove the current catalog
    print 'Cleaning current catalogs'
    if os.path.isdir(common.asset_catalogs_dir):
        shutil.rmtree(common.asset_catalogs_dir)
    os.makedirs(common.asset_catalogs_dir)

    # Create needed directories
    dirs_to_create = [ios_app_icons_dir, ios_launchscreens_dir]
    for path in dirs_to_create:
        os.makedirs(path)


def generate_ios_app_icons():
    print 'Generating iOS App Icons..'
    for (desc, size) in ios_app_icons:
        target_fn = os.path.join(ios_app_icons_dir, desc + '.png')
        try:
            print '\tGenerating icon size {}x{} ({})'.format(
                size[0], size[1], desc)
            im = Image.open(common.app_icon_fn)
            im.thumbnail(size, Image.ANTIALIAS)
            im.save(target_fn)
        except IOError:
            print 'Cannot create app icon "{}"'.format(desc)


def generate_app_icons():
    generate_ios_app_icons()


def assemble_launchscreen(size):
    image = Image.open(common.launchscreen_base_fn)
    return image.resize(size, Image.ANTIALIAS)


def generate_ios_launchscreens():
    print 'Generating iOS Launch Screens..'
    for (desc, size) in ios_launch_images:
        target_fn = os.path.join(ios_launchscreens_dir, desc + '.png')
        try:
            print '\tGenerating launchscreen size {}x{} ({})'.format(
                size[0], size[1], desc)
            im = assemble_launchscreen(size)
            im.save(target_fn)
        except IOError:
            print 'Cannot create launchscreen "{}"'.format(desc)


def generate_launchscreens():
    generate_ios_launchscreens()


if __name__ == '__main__':
    if not os.path.isfile(common.app_icon_fn):
        print 'Cannot find app icon file'
        sys.exit(1)

    if not os.path.isfile(common.launchscreen_base_fn):
        print 'Cannot find launch screen file'
        sys.exit(1)

    prepare_folders()
    generate_app_icons()
    generate_launchscreens()

    sys.exit(0)
