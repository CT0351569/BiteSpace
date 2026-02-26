from . import db
from datetime import datetime

class Quests(db.Model):
    __tablename__ = 'quests'

    quest_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quest_name = db.Column(db.String(255), nullable=False)
    quest_exp = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    end_date = db.Column(db.DateTime, nullable=False)
    image_url = db.Column(db.String(400), nullable =False)
    quest_type = db.Column(db.Enum('review', 'checkin', 'post', name='quest_types'), nullable=False)

    def __repr__(self):
        return f'<Quests {self.quest_id}: {self.quest_name}>'
