from . import db
from sqlalchemy.orm import relationship

class Likes(db.Model):
    __tablename__ = 'likes'
    like_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)

    # Relationships
    post = relationship('Posts', backref='likes')
    client = relationship('Clients', backref='likes')

    def __repr__(self):
        return f'<Likes {self.like_id}, Post {self.post_id}, Client {self.client_id}>'
