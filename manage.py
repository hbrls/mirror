# -*- coding: utf-8 -*-
from flask.ext.script import Manager, Server
from appl import create_app
from appl.config.development import DevelopmentConfig


app = create_app(config=DevelopmentConfig)
manager = Manager(app)

# ** The Flask-Script will override app.config['DEBUG']
_USE_DEBUGGER = app.debug

# Run local server
manager.add_command("runserver", Server(host='localhost',
                                        port=5000,
                                        use_debugger=_USE_DEBUGGER))


if __name__ == "__main__":
    manager.run()
