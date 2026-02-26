from . import db
from sqlalchemy.orm import relationship

class CompletedQuest(db.Model):
    __tablename__ = 'completedQuests'
    completionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quest_id = db.Column(db.Integer, db.ForeignKey('quests.quest_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    quests = relationship('Quests', backref='completed_quests')
    clients = relationship('Clients', backref='completed_quests')

    def __repr__(self):
        return f'<CompletedQuest {self.completionID}>'
