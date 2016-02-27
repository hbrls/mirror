# -*- coding: utf-8 -*-
import logging
from flask import Flask, render_template, request
from .extensions import db


def create_app(config=None):
    app = Flask(__name__)

    app.config.from_object('appl.config.default.DefaultConfig')
    app.config.from_object(config)

    configure_logging(app)
    configure_extensions(app)
    configure_blueprints(app)

    configure_error_handlers(app)

    return app


def configure_logging(app):
    formatter = '[%(asctime)s] %(levelname)s %(name)s: %(message)s'
    logging.basicConfig(format=formatter)
    appl_logger = logging.getLogger('appl')

    if app.debug:
        appl_logger.setLevel(logging.DEBUG)
    else:
        appl_logger.setLevel(logging.INFO)


def configure_extensions(app):
    # Flask-SQLAlchemy
    db.init_app(app)


def configure_blueprints(app):
    from appl.home.views import mod as home_views
    app.register_blueprint(home_views)


def configure_error_handlers(app):
    @app.errorhandler(403)
    def ERROR403(e):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def ERROR404(e):
        app.logger.warning('404: %s, %s, %s' % (request.url,
                                                request.remote_addr,
                                                request.user_agent.string))
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def ERROR500(e):
        # ** Flask will by default call app.logger.error
        return render_template('errors/500.html', error=str(e)), 500
