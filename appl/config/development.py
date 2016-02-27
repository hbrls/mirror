# -*- coding: utf-8 -*-
from .default import DefaultConfig


class DevelopmentConfig(DefaultConfig):

    DEBUG = True

    # SQLAlchemy connection options
    SQLALCHEMY_DATABASE_URI = 'postgresql://mirror:mirror@10.2.0.101/mirror'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_RECORD_QUERIES = False
