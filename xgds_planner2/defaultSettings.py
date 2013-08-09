# __BEGIN_LICENSE__
# Copyright (C) 2008-2010 United States Government as represented by
# the Administrator of the National Aeronautics and Space Administration.
# All Rights Reserved.
# __END_LICENSE__

"""
This app may define some new parameters that can be modified in the
Django settings module.  Let's say one such parameter is FOO.  The
default value for FOO is defined in this file, like this:

  FOO = 'my default value'

If the admin for the site doesn't like the default value, they can
override it in the site-level settings module, like this:

  FOO = 'a better value'

Other modules can access the value of FOO like this:

  from xgds_planner2 import settings
  print settings.FOO

Don't try to get the value of FOO from django.conf.settings.  That
settings object will not know about the default value!


###
# DJANGO-PIPELINE ADDENDUM:

For this module to work, the site-level config file (siteSettings.py), must
merge the XGDS_PLANNER_PIPELINE_JS and XGDS_PLANNER_PIPELINE_CSS settings
into global PIPELINE_{JS|CSS} settings dicts.

If no other django-pipeline includes are defined,
the relevant siteSettings.py secion might look like this:

PIPELINE_JS = {}
PIPELINE_JS.update(plannerSettings.XGDS_PLANNER_PIPELINE_JS)

PIPELINE_CSS = {}
PIPELINE_CSS.update(plannerSettings.XGDS_PLANNER_PIPELINE_CSS)

#
###
"""

import os

XGDS_PLANNER_OFFLINE = False  # Don't load google earth if this is true
XGDS_PLANNER_TEMPLATE_DEBUG = True  # If this is true, handlebars templates will not be cached.

XGDS_PLANNER_SIMULATOR = 'xgds_kn.Simulator'

XGDS_PLANNER_PIPELINE_JS = {
    'planner_app': {
        'source_filenames': (

            'external/js/jquery-1.9.0.min.js',
            'external/js/jquery-migrate-1.1.1.min.js',
            'external/js/jquery-ui.js',
            'external/js/lodash.js',
            'external/js/handlebars.js',
            'external/js/backbone.js',
            'external/js/backbone.marionette.js',
            'external/js/backbone-relational.js',
            'external/js/backbone-forms.js',
            'external/js/bootstrap.min.js',
            'external/js/extensions-0.2.1.pack.js',
            'external/js/string-format.js',
            'external/js/kmltree.min.js',

            'xgds_planner2/js/handlebars-helpers.js',
            'xgds_planner2/js/geo.js',
            'xgds_planner2/js/forms.js',
            'xgds_planner2/js/app.js',
            'xgds_planner2/js/models.js',
            'xgds_planner2/js/views.js',
            'xgds_planner2/js/mapviews.js',
            'xgds_planner2/js/router.js',
            'xgds_planner2/js/simulatorDriver.js',
        ),
        'output_filenames': 'js/planner_app.js'
    },
    # must create 'simulator' entry in top-level siteSettings.py
}

XGDS_PLANNER_PIPELINE_CSS = {
    'planner_app': {
        'source_filenames': (
            'external/css/bootstrap.css',
            'external/css/backbone.forms.default.css',
            'external/css/kmltree.css',
            'xgds_planner2/css/planner.css',
        ),
        'output_filenames': 'css/planner_app.css',
        'template_name': 'xgds_planner2/pipelineCSS.css',
    },
}

_thisDir = os.path.dirname(__file__)

# You will generally want to override these with your domain-specific
# schema and library.  Note that manage.py prep builds simplified
# versions of the schema and library. their locations are found in
# models.py, e.g. SIMPLIFIED_SCHEMA_PATH.
XGDS_PLANNER_SCHEMA_PATH = os.path.join(_thisDir, 'xpjsonSpec', 'examplePlanSchema.json')
XGDS_PLANNER_LIBRARY_PATH = os.path.join(_thisDir, 'xpjsonSpec', 'examplePlanLibrary.json')

# list of (formatCode, extension, exporterClass)
XGDS_PLANNER_PLAN_EXPORTERS = (
    ('xpjson', '.json', 'xgds_planner2.planExporter.XpjsonPlanExporter'),
    ('kml', '.kml', 'xgds_planner2.kmlPlanExporter.KmlPlanExporter'),
    ('stats', '-stats.json', 'xgds_planner2.statsPlanExporter.StatsPlanExporter'),
)

# list of (formatCode, extension, importerClass)
XGDS_PLANNER_PLAN_IMPORTERS = (
    ('kml', '.kml', 'xgds_planner2.kmlPlanImporter.KmlLineStringPlanImporter'),
)

# kml root from xgds_map_server
XGDS_PLANNER_LAYER_FEED_URL = "/xgds_map_server/feed/all/"
