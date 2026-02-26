from . import db


class Messages(db.Model):
    __tablename__ = 'messages'

    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.conversation_id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    time_sent = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    sender = db.relationship("Clients", foreign_keys=[sender_id], backref="sent_messages")
    receiver = db.relationship("Clients", foreign_keys=[receiver_id], backref="received_messages")

    def __repr__(self):
        return f'<message_id {self.message_id}, Sender: {self.sender_id}, Receiver: {self.receiver_id}, Time Sent: {self.time_sent}, message: {self.message} >'
