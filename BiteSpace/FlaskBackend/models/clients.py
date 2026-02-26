from . import db
from sqlalchemy import event
from elasticsearch import Elasticsearch

# Initialize Elasticsearch client with authentication
es = Elasticsearch(
    ["http://localhost:9200"],
    basic_auth=("elastic", "ce306_sg")
)

# Check connection to Elasticsearch
if not es.ping():
    print("Elasticsearch is not running!")
else:
    print("Connected to Elasticsearch")

class Clients(db.Model):
    __tablename__ = 'clients'

    client_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_name = db.Column(db.String(100), nullable =False)
    username = db.Column(db.String(50), nullable=False)
    passcode = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    tier = db.Column(db.String(20), nullable=False)
    profilepic = db.Column(db.String(400), nullable=False)
    bio = db.Column(db.String(200), nullable = True, default = None)
    private = db.Column(db.Boolean, nullable= False, default = False)
    exp = db.Column(db.Integer, nullable=False, default=0)

def __repr__(self):
    return f'<Clients {self.client_id}>'


@event.listens_for(Clients, 'after_insert')
def update_elasticsearch_after_insert(mapper, connection, target):
    """
    Listener to update Elasticsearch after a new client is added
    """
    client_data = {
        'client_id': target.client_id,
        'client_name': target.client_name,
        'profilepic': target.profilepic
    }

    # Index the new client data into Elasticsearch
    es.index(index='clients', id=target.client_id, body=client_data)
    print(f"Added client {target.client_name} to Elasticsearch")

@event.listens_for(Clients, 'after_update')
def update_elasticsearch_after_update(mapper, connection, target):
    """
    Listener to update Elasticsearch after a client is updated
    """
    client_data = {
        'client_id': target.client_id,
        'client_name': target.client_name,
        'profilepic': target.profilepic
    }

    # Update the client data in Elasticsearch
    es.index(index='clients', id=target.client_id, body=client_data)
    print(f"Updated client {target.client_name} in Elasticsearch")

@event.listens_for(Clients, 'after_delete')
def delete_from_elasticsearch_after_delete(mapper, connection, target):
    """
    Listener to delete from Elasticsearch after a client is deleted
    """
    es.delete(index='clients', id=target.client_id)
    print(f"Deleted client {target.client_name} from Elasticsearch")