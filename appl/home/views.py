# -*- coding: utf-8 -*-
import logging
from flask import Blueprint, render_template
from appl.workspace.models import list_workspace


_logger = logging.getLogger(__name__)


mod = Blueprint('home', __name__, template_folder='templates')


@mod.route('/')
def index():
    return render_template('home/index.html')


@mod.route('/dashboard')
def dashboard():
    workspaces = list_workspace()
    _logger.info(workspaces)
    return render_template('home/dashboard.html')


@mod.route('/debug')
def debug():
    _logger.debug('index')
    _logger.info('index')
    _logger.warn('index')
    _logger.error('index')

    return 'DEBUG'
