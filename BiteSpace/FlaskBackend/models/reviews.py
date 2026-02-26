from . import db
from sqlalchemy.orm import relationship
from sqlalchemy import func
from datetime import datetime

class Reviews(db.Model):
    __tablename__ = 'reviews'
    review_id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlet_details.outlet_id'), nullable = False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable = False)
    review = db.Column(db.String(500), nullable = False)
    rating = db.Column(db.Integer, nullable = False)
    reviewDateTime = db.Column(db.DateTime, default=datetime)


    outlet = relationship('OutletDetails', backref= 'reviews')
    client = relationship('Clients', backref = 'reviews')

    def __repr__(self):
        return f'<Reviews {self.review_id}>'
    
    # to calculate average rating of each restaurant
    @classmethod
    def average_rating(cls, outlet_id):
        avg_rating = db.session.query(func.avg(cls.rating)).filter(cls.outlet_id == outlet_id).scalar()
        return avg_rating
    