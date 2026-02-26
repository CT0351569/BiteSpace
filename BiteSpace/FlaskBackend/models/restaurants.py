from . import db

class Restaurants(db.Model):
    __tablename__ = 'restaurants'
    restaurant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    brandName = db.Column(db.String(50), nullable=False)
    cuisine = db.Column(db.String(50), nullable = False)
    halal= db.Column(db.Boolean, nullable= False)
    promotion = db.Column(db.Boolean, nullable =False)

    def __repr__(self):
        return f'<Restaurants {self.restaurant_id}>'
