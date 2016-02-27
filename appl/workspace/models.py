# -*- coding: utf-8 -*-
from sqlalchemy import Column, Integer, String
from appl.utils.db_base import Base
from appl.extensions import db


class Workspace(Base):
    __tablename__ = 'workspace'
    id = Column(Integer, primary_key=True)
    name = Column('name', String(31), nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Workspace> %s' % self.name


def list_workspace():
    records = db.session.query(Workspace) \
                .all()
    return records


def read_workspace(wid):
    exist = db.session.query(Workspace) \
              .filter_by(id=wid) \
              .first()

    return exist
