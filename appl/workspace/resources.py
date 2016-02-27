# -*- coding: utf-8 -*-
from flask_restful import Resource, fields, marshal_with
from .models import list_workspace, read_workspace


resource_fields_workspace = {
    'id': fields.Integer,
    'name': fields.String,
}


class RWorkspace(Resource):

    @marshal_with(resource_fields_workspace)
    def get(self, wid=None):
        if wid:
            return read_workspace(wid)
        else:
            return list_workspace()
