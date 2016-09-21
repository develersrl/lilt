# -*- coding: utf-8 -*-

import os


# Base assumption: this script must be placed in the "scripts" directory
scripts_dir = os.path.dirname(os.path.realpath(__file__))

# "app" directory
app_dir = os.path.dirname(scripts_dir)

# The "content" directory contains input data for the generation script
content_dir = os.path.join(app_dir, 'content')

# The "templates" directory contains react native component templates.
# Templates will be instanced with Jinja during the generation phase.
templates_dir = os.path.join(app_dir, 'templates')

# This is the directory where react native pages will be generated
target_pages_dir = os.path.join(app_dir, 'js', 'pages', 'generated')

# App navigation code will be generated inside the following directory
target_navigation_dir = os.path.join(app_dir, 'js', 'navigation')
