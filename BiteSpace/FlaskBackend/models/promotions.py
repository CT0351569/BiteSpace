from . import db
from datetime import date
from sqlalchemy.orm import relationship

class Promotion(db.Model):
    __tablename__ = 'promotions'

    promotionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlet_details.outlet_id'), nullable=False)
    PromotionTitle = db.Column(db.String(100), nullable=False)
    PromotionPicture = db.Column(db.String(400), nullable=False)
    PromotionTier = db.Column(db.String(20), nullable=False)
    PromotionDateStart = db.Column(db.Date, nullable=False)
    PromotionDateEnd = db.Column(db.Date, nullable=False)

    outlet = relationship('OutletDetails', backref='promotions', lazy=True)

    def __repr__(self):
        return f"<Promotion(promotionID={self.promotionID}, title={self.PromotionTitle})>"
