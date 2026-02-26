from . import db
from sqlalchemy.orm import relationship

class Posts(db.Model):
    __tablename__ = 'posts'
    post_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), nullable=False)
    post_time = db.Column(db.DateTime, nullable=False)
    image_url = db.Column(db.String(512), nullable=True)
    post_title = db.Column(db.String(400), nullable=False)

    # Relationships
    client = relationship('Clients', backref='posts')

    def __repr__(self):
        return f'<Posts {self.post_id}, Client {self.client_id}, Title: {self.post_title}>'
