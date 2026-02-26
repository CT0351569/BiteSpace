from . import db

class Conversations(db.Model):
    __tablename__ = 'conversations'

    conversation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updated_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    person1 = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    person2 = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)

    # Establishing relationship with Messages
    messages = db.relationship("Messages", backref="conversation", lazy=True)

    # Establishing relationships to the Clients model for person1 and person2
    person1_client = db.relationship("Clients", foreign_keys=[person1], backref="conversations_as_person1")
    person2_client = db.relationship("Clients", foreign_keys=[person2], backref="conversations_as_person2")

    def __repr__(self):
        return f'<Conversation {self.conversation_id}, Created At: {self.created_at}>'
