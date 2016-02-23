# -*- coding: utf-8 -*-
import os
from .default import DefaultConfig


class ProductionConfig(DefaultConfig):

    DEBUG = False
