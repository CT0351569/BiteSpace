from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import logging
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from math import ceil
from sqlalchemy.exc import IntegrityError
from dateutil import parser
import traceback

from elasticsearch import Elasticsearch

from models import db, Restaurants, OutletDetails, Clients, Reviews, Checkin, Posts, Likes, Comments, BuddyList, Quests, Promotion, Messages, CompletedQuest, Conversations

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:newpassword@localhost/BiteSpace'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print('connected ')

db.init_app(app)
CORS(app)

# Initialize Elasticsearch client
es = Elasticsearch(
   ["http://localhost:9200"],
   basic_auth=("elastic", "ce306_sg")
)


#Route to retrieve clients data from Elasticsearch
@app.route('/getClientsElasticSearch', methods=['GET'])
def get_clients_ElasticsSearch():
    try:
        response = es.search(index='clients', body={
            "query": {
                "match_all": {}
            },
            "size": 100
        })

        clients = []
        for hit in response['hits']['hits']:
            client_data = hit['_source']
            clients.append(client_data)

        return jsonify(clients)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#check quest status for review screen
@app.route('/api/checkQuestStatusReview', methods=['GET'])
def check_quest_status_review():
    username = request.args.get('username')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    try:
        print(f"Received username: {username}")
        
        client = Clients.query.filter_by(username=username).first()
        
        if not client:
            print(f"Error: Client with username {username} not found")
            return jsonify({"error": "Client not found"}), 404

        client_id = client.client_id
        print(f"Found client with client_id: {client_id}")

        #Check for ongoing quests with quest_type 'review'
        now = datetime.now()
        print(f"Current datetime: {now}")

        ongoing_quest = Quests.query.filter(
            Quests.quest_type == 'review',
            Quests.start_date <= now,
            Quests.end_date >= now
        ).first()

        if not ongoing_quest:
            print(f"No ongoing review quests found")
            return jsonify({"status": 0})

        print(f"Ongoing quest found with quest_id: {ongoing_quest.quest_id}")

        #Check if the client has completed the quest
        completed_quest = CompletedQuest.query.filter_by(client_id=client_id, quest_id=ongoing_quest.quest_id).first()

        if completed_quest:
            print(f"Client with client_id {client_id} has already completed the quest with quest_id {ongoing_quest.quest_id}")
            return jsonify({"status": 0})

        print(f"Client with client_id {client_id} has not completed the quest with quest_id {ongoing_quest.quest_id}")
        return jsonify({"status": 1, "quest_id": ongoing_quest.quest_id})
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


#Route to retrieve usertier for promotions screen
@app.route('/userTier', methods=['GET'])
def get_userTier():
    username = request.headers.get('Username')
    if not username:
        return jsonify({'error': 'Username not provided'}), 400
    try:
        client = Clients.query.filter_by(username=username).first()
        if not client:
            return jsonify({'error': 'User not found'}), 404
        user_tier = client.tier
        return jsonify({'tier': user_tier}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#for promotions card used on promotion screen
@app.route('/promotions', methods=['GET'])
def get_promotions():
    try:
        current_date = datetime.now().date()
        promotions = Promotion.query.all()

        promotions_list = []
        for promo in promotions:
            outlet_details = db.session.query(OutletDetails).filter_by(outlet_id=promo.outlet_id).first()
            if outlet_details:
                restaurant = db.session.query(Restaurants).filter_by(restaurant_id=outlet_details.restaurant_id).first()

                if promo.PromotionDateStart <= current_date <= promo.PromotionDateEnd:
                    promotion_data = {
                        'promotionID': promo.promotionID,
                        'PromotionTitle': promo.PromotionTitle,
                        'PromotionPicture': promo.PromotionPicture,
                        'PromotionTier': promo.PromotionTier,
                        'PromotionDateStart': promo.PromotionDateStart.strftime('%Y-%m-%d'),
                        'PromotionDateEnd': promo.PromotionDateEnd.strftime('%Y-%m-%d'),
                        'restaurant_brandName': restaurant.brandName,
                        'outlet_address': outlet_details.address,
                        'outlet_profile_pic': outlet_details.profile_pic,
                        'outlet_id': outlet_details.outlet_id
                    }
                    promotions_list.append(promotion_data)

        return jsonify(promotions_list), 200


    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f"Error occurred: {error_message}")
        print(f"Traceback: {error_traceback}")

        return jsonify({'error': error_message, 'traceback': error_traceback}), 500



#Route to get quests
@app.route('/api/getQuests', methods=['GET'])
def get_quests():
    try:
        # Query all quests from the database
        all_quests = Quests.query.all()

        # Format the quests as a list of dictionaries
        quests_list = [
            {
                "quest_id": quest.quest_id,
                "quest_name": quest.quest_name,
                "quest_exp": quest.quest_exp,
                "start_date": quest.start_date.strftime('%Y-%m-%d'),
                "end_date": quest.end_date.strftime('%Y-%m-%d'),
                "image_url": quest.image_url
            }
            for quest in all_quests
        ]

        return jsonify({"status": "success", "quests": quests_list}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/getExp', methods=['POST'])
def get_exp():
    data = request.get_json()

    username = data.get('username')
    
    user = Clients.query.filter_by(username=username).first()
    
    if user:
        return jsonify({
            'exp': user.exp,
            'client_name': user.client_name,
            'profilepic': user.profilepic
        })
    
    return jsonify({'exp': 0, 'client_name': '', 'profilepic': ''}), 404


#Route for explore
@app.route('/explore', methods=['GET'])
def explore():
    #Find all public clients (private = 0)
    public_clients = Clients.query.filter_by(private=0).all()
    public_client_ids = [client.client_id for client in public_clients]
    
    if not public_client_ids:
        return jsonify({"error": "No public users available"}), 404

    #Retrieve posts from these public clients within the last 3 days
    three_days_ago = datetime.now(timezone.utc) - timedelta(days=20)
    posts = db.session.query(
        Posts.post_id.label('post_id'),
        Posts.client_id,
        Posts.post_time,
        Posts.post_title,
        Posts.image_url,
        Clients.client_name,
        Clients.profilepic,
    ).join(Clients, Clients.client_id == Posts.client_id) \
     .filter(Posts.client_id.in_(public_client_ids), Posts.post_time >= three_days_ago) \
     .all()

    posts_data = []

    #Collect data from Likes and Comments tables
    for post in posts:
        comment_count = Comments.query.filter_by(post_id=post.post_id).count()
        like_count = Likes.query.filter_by(post_id=post.post_id).count()

        # Prepare the data for each post with client details
        post_data = {
            'client_id': post.client_id,
            'client_name': post.client_name,
            'profile_picture': post.profilepic,
            'post_id': post.post_id,
            'post_time': post.post_time.isoformat(),
            'post_title': post.post_title,
            'image_url': post.image_url,
            'comment_count': comment_count,
            'like_count': like_count,
        }

        posts_data.append(post_data)
    return jsonify(posts_data), 200


@app.route('/postsfrombuddies', methods=['POST'])
def posts_from_buddies():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    client = Clients.query.filter_by(username=username).first()
    if not client:
        return jsonify({"error": "User not found"}), 404

    client_id = client.client_id

    #Find the user's buddies (both the user and their friends)
    buddies = BuddyList.query.filter(
        (BuddyList.user_id == client_id) | (BuddyList.friend_user_id == client_id)
    ).all()

    # Get the IDs of the buddies (exclude the user themselves from the list)
    buddy_ids = [
        buddy.friend_user_id if buddy.user_id == client_id else buddy.user_id
        for buddy in buddies
    ]
    buddy_ids.append(client_id)

    if not buddy_ids:
        return jsonify({"error": "No buddies to display"}), 404

    #Retrieve posts from the buddies (including the user) in the last 5 days
    five_days_ago = datetime.now(timezone.utc) - timedelta(days=15)

    posts = db.session.query(
        Posts.post_id.label('post_id'),
        Posts.client_id,
        Posts.post_time,
        Posts.post_title,
        Posts.image_url,
        Clients.client_name,
        Clients.profilepic,
    ).join(Clients, Clients.client_id == Posts.client_id) \
     .filter(Posts.client_id.in_(buddy_ids), Posts.post_time >= five_days_ago) \
     .all()

    posts_data = []

    for post in posts:
        # Retrieve the number of comments and likes for this post
        comment_count = Comments.query.filter_by(post_id=post.post_id).count()
        like_count = Likes.query.filter_by(post_id=post.post_id).count()

        post_data = {
            'client_id': post.client_id,
            'client_name': post.client_name,
            'profile_picture': post.profilepic,
            'post_id': post.post_id,
            'post_time': post.post_time.isoformat(),
            'post_title': post.post_title,
            'image_url': post.image_url,
            'comment_count': comment_count,
            'like_count': like_count,
        }

        posts_data.append(post_data)

    return jsonify(posts_data), 200


#Route for posting
@app.route('/userpost', methods=['POST'])
def create_post():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'post_title', 'image_url']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f"Missing required field: {field}"}), 400
        
        # Validate data types and content
        username = str(data['username']).strip()
        post_title = str(data['post_title']).strip()
        image_url = str(data['image_url']).strip()
        
        # Ensure post_title length is within the allowed limit
        if len(post_title) > 400:
            return jsonify({'error': 'Post title exceeds maximum length of 400 characters'}), 400
        
        if len(image_url) > 512:
            return jsonify({'error': 'Image URL exceeds maximum length of 150 characters'}), 400
        
        client = Clients.query.filter_by(username=username).first()
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        # Create a new post using the retrieved client_id
        new_post = Posts(
            client_id=client.client_id,
            post_title=post_title,
            image_url=image_url,
            post_time=datetime.now()
        )
        db.session.add(new_post)
        db.session.commit()
        
        return jsonify({'message': 'Post created successfully!', 'post_id': new_post.post_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


#Route for posts (other user profiles)
@app.route('/api/otheruserposts', methods=['POST'])
def get_other_user_posts():
    data = request.get_json()
    client_id = data.get('client_id')
    
    if not client_id:
        return jsonify({'error': 'Client ID is required'}), 400
    
    client_info = db.session.query(Clients.client_id, Clients.client_name, Clients.profilepic).filter_by(client_id=client_id).first()
    
    if not client_info:
        return jsonify({'error': 'Client not found'}), 403

    # Subquery to count likes per post
    likes_count_subquery = (
        db.session.query(Likes.post_id, func.count(Likes.like_id).label('likes_count'))
        .group_by(Likes.post_id)
        .subquery()
    )

    # Subquery to count comments per post
    comments_count_subquery = (
        db.session.query(Comments.post_id, func.count(Comments.comment_id).label('comments_count'))
        .group_by(Comments.post_id)
        .subquery()
    )

    # Query to get the client's posts with like and comment counts
    posts = (
        db.session.query(
            Posts.post_id,
            Posts.post_time,
            Posts.image_url,
            Posts.post_title,
            func.coalesce(likes_count_subquery.c.likes_count, 0).label('likes_count'),
            func.coalesce(comments_count_subquery.c.comments_count, 0).label('comments_count')
        )
        .filter(Posts.client_id == client_id)
        .outerjoin(likes_count_subquery, Posts.post_id == likes_count_subquery.c.post_id)
        .outerjoin(comments_count_subquery, Posts.post_id == comments_count_subquery.c.post_id)
        .all()
    )

    response = {
        'client_name': client_info.client_name,
        'profilepic': client_info.profilepic,
        'posts': [
            {
                'post_id': post.post_id,
                'post_time': post.post_time,
                'image_url': post.image_url,
                'post_title': post.post_title,
                'likes': post.likes_count,
                'comments': post.comments_count
            }
            for post in posts
        ]
    }

    return jsonify(response)

#Route to delete buddy
@app.route('/api/cancelBuddyRequest', methods=['POST'])
def cancel_buddy_request():
    data = request.get_json()
    username = data.get('username')
    friend_client_id = data.get('client_id')

    if not username or not friend_client_id:
        return jsonify({'success': False, 'message': 'Missing required parameters'}), 400

    # Fetch user_id for the username
    user = Clients.query.filter_by(username=username).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    # Find and delete the buddy request
    buddy_request = BuddyList.query.filter_by(
        user_id=user.client_id,
        friend_user_id=friend_client_id
    ).first()

    if not buddy_request:
        return jsonify({'success': False, 'message': 'Buddy request not found.'}), 404

    try:
        db.session.delete(buddy_request)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Buddy request canceled.'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


#Route for add buddy
@app.route('/api/addBuddy', methods=['POST'])
def add_buddy():
    data = request.get_json()
    username = data.get('username')
    friend_client_id = data.get('client_id')

    if not username or not friend_client_id:
        return jsonify({'success': False, 'message': 'Missing required parameters'}), 400

    # Fetch user_id for the username
    user = Clients.query.filter_by(username=username).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    # Ensure friend_client_id is an integer if needed
    try:
        friend_client_id = int(friend_client_id)
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid client_id format'}), 400

    # Create a buddy request
    try:
        new_request = BuddyList(
            user_id=user.client_id,
            friend_user_id=friend_client_id,
            status='pending'
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Buddy request sent.'})
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Buddy request already exists.'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


#route for posts(user profile)
@app.route('/api/userposts', methods=['POST'])
def get_user_posts():
    data = request.get_json()
    username = data.get('username')
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    client_info = db.session.query(Clients.client_id, Clients.client_name, Clients.profilepic).filter_by(username=username).first()
    
    if not client_info:
        return jsonify({'error': 'Client not found'}), 405

    client_id = client_info.client_id

    # Subquery to count likes per post
    likes_count_subquery = (
        db.session.query(Likes.post_id, func.count(Likes.like_id).label('likes_count'))
        .group_by(Likes.post_id)
        .subquery()
    )

    # Subquery to count comments per post
    comments_count_subquery = (
        db.session.query(Comments.post_id, func.count(Comments.comment_id).label('comments_count'))
        .group_by(Comments.post_id)
        .subquery()
    )

    # Query to get the client's posts with like and comment counts
    posts = (
        db.session.query(
            Posts.post_id,
            Posts.post_time,
            Posts.image_url,
            Posts.post_title,
            func.coalesce(likes_count_subquery.c.likes_count, 0).label('likes_count'),
            func.coalesce(comments_count_subquery.c.comments_count, 0).label('comments_count')
        )
        .filter(Posts.client_id == client_id)
        .outerjoin(likes_count_subquery, Posts.post_id == likes_count_subquery.c.post_id)
        .outerjoin(comments_count_subquery, Posts.post_id == comments_count_subquery.c.post_id)
        .all()
    )

    response = {
        'client_name': client_info.client_name,
        'profilepic': client_info.profilepic,
        'posts': [
            {
                'post_id': post.post_id,
                'post_time': post.post_time,
                'image_url': post.image_url,
                'post_title': post.post_title,
                'likes': post.likes_count,
                'comments': post.comments_count
            }
            for post in posts
        ]
    }

    return jsonify(response)


# route for posts
@app.route('/api/posts')
def get_posts():
    # Subquery to count likes per post
    likes_count_subquery = (
        db.session.query(Likes.post_id, func.count(Likes.like_id).label('likes_count'))
        .group_by(Likes.post_id)
        .subquery()
    )

    # Subquery to count comments per post
    comments_count_subquery = (
        db.session.query(Comments.post_id, func.count(Comments.comment_id).label('comments_count'))
        .group_by(Comments.post_id)
        .subquery()
    )

    # Main query to get post details along with likes and comments counts
    posts = (
        db.session.query(
            Posts.post_id,
            Posts.client_id,
            Posts.post_time,
            Posts.image_url,
            Posts.post_title,
            func.coalesce(likes_count_subquery.c.likes_count, 0).label('likes_count'),
            func.coalesce(comments_count_subquery.c.comments_count, 0).label('comments_count')
        )
        .outerjoin(likes_count_subquery, Posts.post_id == likes_count_subquery.c.post_id)
        .outerjoin(comments_count_subquery, Posts.post_id == comments_count_subquery.c.post_id)
        .all()
    )

    return jsonify([
        {
            'post_id': post.post_id,
            'client_id': post.client_id,
            'post_time': post.post_time,
            'image_url': post.image_url,
            'post_title': post.post_title,
            'likes': post.likes_count,
            'comments': post.comments_count
        }
        for post in posts
    ])

# for testing
@app.route('/api/likes')
def get_likes():
    likes = Likes.query.all()
    return jsonify([{
        'like_id': like.like_id,
        'post_id': like.post_id,
        'client_id': like.client_id
    } for like in likes])

# for testing
@app.route('/api/comments')
def get_comments():
    comments = Comments.query.all()
    return jsonify([{
        'comment_id': comment.comment_id,
        'post_id': comment.post_id,
        'comment_time': comment.comment_time,
        'comment_text': comment.comment_text,
        'client_id': comment.client_id
    } for comment in comments])


#for testing
@app.route('/api/checkin')
def get_checkin():
    checkins = Checkin.query.all()
    checkin_list = []
    
    for checkin in checkins:
        checkin_data = {
            'checkin_id': checkin.checkin_id,
            'client_id': checkin.client_id,
            'outlet_id': checkin.outlet_id,
            'checkin_datetime': checkin.checkin_datetime,
            'comment': checkin.checkin_comment
        }
        
        if checkin.checkin_comment is not None:
            checkin_data['comment'] = checkin.checkin_comment
        
        checkin_list.append(checkin_data)
    
    return jsonify(checkin_list)


#query the data required for leavereview 
@app.route('/api/leavereviewdata', methods=['POST'])
def getLeaveReviewData():
    data = request.get_json()
    username = data.get('username')

    try:
        client_details = db.session.query(
            Clients.client_id,
            Clients.profilepic,
            Clients.client_name
        ).filter(Clients.username == username).first()

        if not client_details:
            return jsonify({'error': 'Client not found'}), 404

        review_count = db.session.query(
            db.func.count(Reviews.review_id)
        ).filter(Reviews.client_id == client_details.client_id).scalar()

        response_data = {
            'client_id': client_details.client_id,
            'profilepic': client_details.profilepic,
            'client_name': client_details.client_name,
            'review_count': review_count
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while fetching leave review data'}), 500


#Route to retrieve data for other profile screen
@app.route('/api/getClientData', methods=['POST'])
def get_client_data():
    try:
        data = request.get_json()
        client_id = data.get('client_id')

        if not client_id:
            return jsonify({'error': 'Client ID is required'}), 400

        # Fetch client details using client_id
        client_details = db.session.query(
            Clients.client_id,
            Clients.client_name,
            Clients.tier,
            func.coalesce(Clients.bio, '').label('bio'),
            Clients.profilepic,
            Clients.exp
        ).filter(Clients.client_id == client_id).first()

        if not client_details:
            return jsonify({'error': 'Client not found'}), 404

        # Get buddy count (those who are accepted buddies)
        buddy_count = db.session.query(
            func.count(BuddyList.friend_id.distinct())
        ).filter(
            (BuddyList.user_id == client_id) & (BuddyList.status == 'accepted') |
            (BuddyList.friend_user_id == client_id) & (BuddyList.status == 'accepted')
        ).scalar()

        # Get check-ins count for the client
        checkins_count = db.session.query(
            func.count(Checkin.checkin_id)
        ).filter(Checkin.client_id == client_id).scalar()

        # Get posts count for the client
        posts_count = db.session.query(
            func.count(Posts.post_id)
        ).filter(Posts.client_id == client_id).scalar()

        # Prepare the response data
        response_data = {
            'client_name': client_details.client_name,
            'tier': client_details.tier,
            'bio': client_details.bio,
            'profilepic': client_details.profilepic,
            'buddy_count': buddy_count,
            'checkins_count': checkins_count,
            'posts_count': posts_count,
            'exp': client_details.exp
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while fetching client data'}), 500


#app route to retrieve data for user profile card using buddylist
@app.route('/api/profiledata2', methods=['POST'])
def get_profile_data2():
    data = request.get_json()
    username = data.get('username')

    try:
        # Fetch client details from the Clients table
        client_details = db.session.query(
            Clients.client_id,
            Clients.client_name,
            Clients.tier,
            func.coalesce(Clients.bio, '').label('bio'),
            Clients.profilepic,
            Clients.exp
        ).filter(Clients.username == username).first()

        if not client_details:
            return jsonify({'error': 'User not found'}), 404

        client_id = client_details.client_id

        # Get buddy count (those who are accepted buddies)
        buddy_count = db.session.query(
            func.count(BuddyList.friend_id.distinct())
        ).filter(
            (BuddyList.user_id == client_id) & (BuddyList.status == 'accepted') |
            (BuddyList.friend_user_id == client_id) & (BuddyList.status == 'accepted')
        ).scalar()

        # Get check-ins count for the client
        checkins_count = db.session.query(
            func.count(Checkin.checkin_id)
        ).filter(Checkin.client_id == client_id).scalar()

        # Get posts count for the client
        posts_count = db.session.query(
            func.count(Posts.post_id)
        ).filter(Posts.client_id == client_id).scalar()

        # Prepare the response data
        response_data = {
            'client_name': client_details.client_name,
            'tier': client_details.tier,
            'bio': client_details.bio,
            'profilepic': client_details.profilepic,
            'buddy_count': buddy_count,
            'checkins_count': checkins_count,
            'posts_count': posts_count,
            'exp': client_details.exp
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while fetching profile data'}), 500



#query the data required for reviewcard
@app.route('/api/reviewCard')
def fetch_reviews():
    try:
        results = db.session.query(
            Reviews.review_id,
            Reviews.outlet_id,
            Reviews.client_id,
            Reviews.review,
            Reviews.rating,
            Reviews.reviewDateTime,
            Clients.client_name,
            Clients.profilepic
        ).join(Clients, Reviews.client_id == Clients.client_id).all()

        review_data = []
        for review in results:
            num_reviews = db.session.query(func.count()).filter(Reviews.client_id == review.client_id).scalar()
            review_info = {
                'review_id': review.review_id,
                'outlet_id': review.outlet_id,
                'review': review.review,
                'rating': review.rating,
                'review_datetime': review.reviewDateTime,
                'client_id': review.client_id,
                'client_name': review.client_name,
                'profile_pic': review.profilepic,
                'num_reviews': num_reviews
            }
            review_data.append(review_info)

        return jsonify(review_data)

    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({'error': 'Failed to fetch reviews'})


 #restaurantcard + filter details
@app.route('/api/restaurantcard')
def get_restaurantcard_data():
    try:
        results = db.session.query(
            Restaurants.brandName,
            Restaurants.cuisine,
            Restaurants.restaurant_id,
            Restaurants.halal,
            OutletDetails.address,
            OutletDetails.featured,
            OutletDetails.promotion,
            OutletDetails.location,
            OutletDetails.outlet_id,
            OutletDetails.profile_pic,
            func.avg(Reviews.rating).label('average_rating')
        ).join(
            OutletDetails, Restaurants.restaurant_id == OutletDetails.restaurant_id
        ).outerjoin(
            Reviews, OutletDetails.outlet_id == Reviews.outlet_id
        ).group_by(
            Restaurants.brandName, OutletDetails.address, Restaurants.cuisine, Restaurants.halal, OutletDetails.featured
            , OutletDetails.promotion, OutletDetails.location, OutletDetails.outlet_id, Restaurants.restaurant_id, OutletDetails.profile_pic
        ).all()

        restaurant_cards = []
        for result in results:
            restaurant_cards.append({
                'restaurant': result.brandName,
                'address': result.address,
                'rating': result.average_rating if result.average_rating is not None else 'No reviews yet',
                'cuisine': result.cuisine,
                'halal': result.halal,
                'featured': result.featured,
                'promotion': result.promotion,
                'location': result.location,
                'outlet_id': result.outlet_id,
                'restaurant_id': result.restaurant_id,
                'profile_pic': result.profile_pic
            })

        return jsonify(restaurant_cards)
    except Exception as e:
        logging.error(f"Error fetching restaurant card data: {e}")
        return jsonify({'error': f"Error fetching restaurant card data: {str(e)}"}), 500

#login authentication
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = Clients.query.filter_by(username=username).first()

    if not user:
        print('username not found')
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    # Check if the provided password matches the stored password
    if user.passcode == password:
        return jsonify({'success': True, 'message': 'Login successful!'})
    else:
        return jsonify({'success': False, 'message': 'Invalid password'}), 401

    
# registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if Clients.query.filter_by(username=username).first():
        return jsonify({'success': True, 'message': 'Username already taken'}), 409

    try:

        new_client = Clients(
            client_name=name,
            username=username,
            passcode=password,
            email=email,
            tier='bronze',
            profilepic='https://adybybuoqeunggekybzl.supabase.co/storage/v1/object/public/BiteSpace/c0.jpg?t=2024-11-06T15%3A52%3A05.318Z',
            bio = None,
            private = False,
            exp = 0
        )

        db.session.add(new_client)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Registration successful'})
    except Exception as e:
        print(f"Error during registration: {e}")
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Registration failed'}), 500


#route for quest data.
@app.route('/api/submitQuestData', methods=['POST'])
def submit_quest_data():
    data = request.get_json()
    client_id = data.get('client_id')
    quest_id = data.get('quest_id')

    if not client_id or not quest_id:
        return jsonify({"success": False, "message": "Client ID and Quest ID are required"}), 400

    try:
        # Fetch the quest and client data
        quest = Quests.query.filter_by(quest_id=quest_id).first()
        if not quest:
            return jsonify({"success": False, "message": "Quest not found"}), 404

        client = Clients.query.filter_by(client_id=client_id).first()
        if not client:
            return jsonify({"success": False, "message": "Client not found"}), 404

        # Update client experience points
        client.exp += quest.quest_exp
        print(client.exp)
        if client.exp >= 1000:
            client.tier = 'gold'
        elif client.exp >= 500:
            client.tier = 'silver'
        else: client.tier = 'bronze'
        print(client.tier)

        db.session.commit()

        # Log the quest completion
        completed_quest = CompletedQuest(client_id=client_id, quest_id=quest_id)
        db.session.add(completed_quest)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Quest completed successfully",
            "exp": client.exp,
            "updated_tier": client.tier
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error in submitQuestData: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500



#Update database with the review data
@app.route('/api/submitreview', methods=['POST'])
def submit_review():
    try:
        data = request.get_json()
        
        # Ensure required fields are present
        if not all(key in data for key in ['outlet_id', 'client_id', 'rating', 'review', 'review_datetime']):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Parse and validate data
        try:
            outlet_id = int(data.get('outlet_id'))
            client_id = int(data.get('client_id'))
            rating = int(data.get('rating'))
            review_text = str(data.get('review'))
            review_datetime = parser.isoparse(data.get('review_datetime'))  # Use dateutil.parser
        except ValueError as e:
            return jsonify({'success': False, 'message': f'Invalid data format: {str(e)}'}), 400

        print({
            'outlet_id': outlet_id,
            'client_id': client_id,
            'rating': rating,
            'review_text': review_text,
            'review_datetime': review_datetime
        })

        new_review = Reviews(
            outlet_id=outlet_id,
            client_id=client_id,
            review=review_text,
            rating=rating,
            reviewDateTime=review_datetime
        )

        db.session.add(new_review)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Review submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

#route to get details for inbox screen
@app.route('/get_inbox', methods=['GET'])
def get_inbox():
    try:
        username = request.headers.get('username')
        print(f"Received username: {username}")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        client = Clients.query.filter_by(username=username).first()

        if not client:
            return jsonify({"error": "Client not found"}), 404

        client_id = client.client_id
        print(f"Client ID: {client_id}")

        # Query the Conversations table to find all conversations where the client is either person1 or person2
        conversations = Conversations.query.filter(
            (Conversations.person1 == client_id) | (Conversations.person2 == client_id)
        ).all()
        print(conversations)

        if not conversations:
            return jsonify({"message": "No conversations found"}), 200

        message_data = []
        for conversation in conversations:
            # Determine the "friend" based on the client_id
            if conversation.person1 == client_id:
                friend_id = conversation.person2
            else:
                friend_id = conversation.person1

            friend = Clients.query.get(friend_id)
            print(friend)
            if not friend:
                continue

            # Get the latest message from the Messages table for this conversation
            latest_message = Messages.query.filter_by(conversation_id=conversation.conversation_id) \
                                           .order_by(Messages.time_sent.desc()).first()
            print(latest_message)

            message_data.append({
                "friend_id": friend.client_id,
                "friend_profile_pic": friend.profilepic,
                "friend_name": friend.client_name,
                "last_message": latest_message.message if latest_message else "No message",
                "time_of_last_message": latest_message.time_sent.strftime('%Y-%m-%d %H:%M:%S') if latest_message else "No message",
                "conversation_id": conversation.conversation_id
            })
        print(message_data)
        return jsonify(message_data), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/get_messages", methods=["GET"])
def get_messages():
    # Get the username and friend_id from query parameters
    username = request.args.get("username")
    friend_id = request.args.get("friend_id")
    print(username)
    print(friend_id)

    # If username or friend_id is not provided or invalid
    if not username or friend_id is None:
        return jsonify({"error": "Missing or invalid parameters"}), 400

    # Query the Clients table to get client_id
    client = Clients.query.filter_by(username=username).first()

    if not client:
        return jsonify({"error": "User not found"}), 404

    client_id = client.client_id

    # Query the Conversations table to check for a match
    conversation = Conversations.query.filter(
        ((Conversations.person1 == client_id) & (Conversations.person2 == friend_id)) |
        ((Conversations.person1 == friend_id) & (Conversations.person2 == client_id))
    ).first()

    if not conversation:
        return jsonify({"error": "Conversation not found"}), 404

    conversation_id = conversation.conversation_id

    # Retrieve all messages for this conversation
    messages = Messages.query.filter_by(conversation_id=conversation_id).all()
    print('messages:', messages)

    # Filter the messages for the friend and the client
    friend_messages = [
        msg for msg in messages if msg.sender_id != client_id
    ]
    print(friend_messages)
    client_messages = [
        msg for msg in messages if msg.receiver_id != friend_id
    ]

    print('client:', client_messages)

    # Sort the messages by timestamp
    friend_messages_sorted = sorted(friend_messages, key=lambda x: x.time_sent)
    client_messages_sorted = sorted(client_messages, key=lambda x: x.time_sent)

    # print('sorted messages' , friend_messages_sorted)
    # print('sorted client messages' , client_messages_sorted)

    # Return the message content explicitly
    return jsonify({
        "friend": [{"message": msg.message, "time_sent": msg.time_sent,"message_id": msg.message_id} for msg in friend_messages_sorted],
        "client": [{"message": msg.message, "time_sent": msg.time_sent, "message_id": msg.message_id} for msg in client_messages_sorted]
    })


@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.json
    friend_id = data.get("friend_id")
    username = data.get("username")
    message = data.get("text")

    print(data)
        
    if not friend_id or not username or not message:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Retrieve client by username
    client = Clients.query.filter_by(username=username).first()  # Correct query to get client by username
    if not client:
        return jsonify({"error": "Client not found"}), 404
    client_id = client.client_id

    # Query the Conversations table to check if the conversation exists
    conversation = Conversations.query.filter(
    (Conversations.person1 == client_id and Conversations.person2 == friend_id) |
    (Conversations.person1 == friend_id and Conversations.person2 == client_id)
    ).first()


    # Create new message
    new_message = Messages(
        conversation_id=conversation.conversation_id,
        sender_id=client_id,
        receiver_id=friend_id,
        message=message,
        time_sent=datetime.now()
    )

    # Add the new message to the session and commit it
    db.session.add(new_message)
    db.session.commit()

    # Update the updated_at timestamp in the Conversations table
    conversation.updated_at = datetime.now()
    db.session.commit()

    # Return the newly added message
    return jsonify({
        "sender_id": new_message.sender_id,
        "receiver_id": new_message.receiver_id,
        "message": new_message.message,
        "time_sent": new_message.time_sent.isoformat()
    }), 201

#Route to get friends for compose message screen
@app.route("/friends", methods=["GET"])
def get_friends():
    username = request.args.get("username")  # Get the username from the query parameter
    print(username)
    
    # Continue as you did
    client = Clients.query.filter_by(username=username).first()
    if not client:
        return jsonify({"error": "User not found"}), 404

    # Step 2: Query the BuddyList for friends of the client
    buddy_list = BuddyList.query.filter(
        (BuddyList.user_id == client.client_id) | (BuddyList.friend_user_id == client.client_id)
    ).all()

    friends = []
    for buddy in buddy_list:
        # Determine the friend_id (the one that is not the client_id)
        if buddy.user_id == client.client_id:
            friend_id = buddy.friend_user_id
        else:
            friend_id = buddy.user_id

        # Retrieve the friend's details (name, profile picture)
        friend = Clients.query.get(friend_id)

        if friend:
            friends.append({
                "friend_id": friend.client_id,
                "friend_name": friend.client_name,
                "friend_profile_pic": friend.profilepic,
            })

    return jsonify({"friends": friends})



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')
