# -*- coding: utf-8 -*-
import logging
from flask import Blueprint, render_template


_logger = logging.getLogger(__name__)


mod = Blueprint('home', __name__, template_folder='templates')


@mod.route('/')
def index():
    return render_template('home/index.html')


@mod.route('/debug')
def debug():
    _logger.debug('index')
    _logger.info('index')
    _logger.warn('index')
    _logger.error('index')

    return 'DEBUG'
