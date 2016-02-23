#!/usr/bin/env python
from appl import create_app
from appl.config.production import ProductionConfig


application = create_app(ProductionConfig)
