# -*- coding: utf-8 -*-
from flask_restful import Api
from appl.utils.errors import APIWarning
from appl.workspace.resources import RWorkspace


class ExceptionAwareApi(Api):
    def handle_error(self, e):
        if isinstance(e, APIWarning):
            return self.make_response(e.__dict__, 200)
        else:
            return super(ExceptionAwareApi, self).handle_error(e)


def init(app):
    api = ExceptionAwareApi(app, prefix='/api')
    # print(app.view_functions)

    api.add_resource(RWorkspace, '/r_workspaces', endpoint='api.r_workspaces')
    app.add_url_rule('/api/workspaces', 'api.r_workspaces', methods=['GET'])
    app.add_url_rule('/api/workspaces/<int:wid>', 'api.r_workspaces', methods=['GET'])
