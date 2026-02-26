from . import db
from sqlalchemy.orm import relationship

class Comments(db.Model):
    __tablename__ = 'comments'
    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id'), nullable=False)
    comment_time = db.Column(db.DateTime, nullable=False)
    comment_text = db.Column(db.String(200), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)

    # Relationships
    post = relationship('Posts', backref='comments')
    client = relationship('Clients', backref='comments')

    def __repr__(self):
        return f'<Comments {self.comment_id}, Post {self.post_id}, Client {self.client_id}>'
