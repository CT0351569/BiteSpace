from . import db
from sqlalchemy.orm import relationship

class OutletDetails(db.Model):
    __tablename__ = 'outlet_details'
    outlet_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    likes = db.Column(db.Integer, nullable=False)
    profile_pic = db.Column(db.String(400), nullable=False)
    featured = db.Column(db.Boolean, nullable=False)
    promotion = db.Column(db.Boolean, nullable =False)

    restaurant = relationship('Restaurants', backref='outlet_details')

    def __repr__(self):
        return f'<OutletDetails {self.outlet_id}>'
