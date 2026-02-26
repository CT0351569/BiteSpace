# models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models
from .restaurants import Restaurants
from .outlet_details import OutletDetails
from .clients import Clients
from .reviews import Reviews
from .checkIn import Checkin
from .posts import Posts
from .likes import Likes
from .comments import Comments
from .buddyList import BuddyList
from .quests import Quests
from .promotions import Promotion
from .Messages import Messages
from .completedQuests import CompletedQuest
from .conversations import Conversations