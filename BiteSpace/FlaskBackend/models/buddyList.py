from . import db

class BuddyList(db.Model):
    __tablename__ = 'buddyList'

    friend_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    friend_user_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'rejected', name='status_enum'), default='pending', nullable=False)

    user = db.relationship("Clients", foreign_keys=[user_id])
    friend_user = db.relationship("Clients", foreign_keys=[friend_user_id])

    def __repr__(self):
        return f'<BuddyList {self.user_id} -> {self.friend_user_id}, Status: {self.status}>'
