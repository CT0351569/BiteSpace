from . import db
from datetime import datetime

class Checkin(db.Model):
    __tablename__ = 'checkins'

    checkin_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlet_details.outlet_id'), nullable=False)
    checkin_datetime = db.Column(db.DateTime, nullable=False, default=datetime.now)
    checkin_comment = db.Column(db.String(500))

    client = db.relationship('Clients', backref=db.backref('checkins', lazy=True))
    outlet = db.relationship('OutletDetails', backref=db.backref('checkins', lazy=True))

    def __repr__(self):
        return f'<Checkin {self.checkin_id}>'
