# from elasticsearch import Elasticsearch

# es = Elasticsearch(
#     ["http://localhost:9200"],
#     basic_auth=("elastic", "ce306_sg")
# )

# if not es.ping():
#     print("Elasticsearch is not running!")
# else:
#     print("Connected to Elasticsearch")

# def upload_client_to_elasticsearch(client_id, client_name, profilepic):
#     """
#     Method to upload client data to Elasticsearch manually.
#     """
#     client_data = {
#         'client_id': client_id,
#         'client_name': client_name,
#         'profilepic': profilepic
#     }

#     try:
#         # Index the client data into Elasticsearch manually
#         response = es.index(index='clients', id=client_id, body=client_data)
#         print(f"Successfully uploaded client {client_name} to Elasticsearch.")
#         return response
#     except Exception as e:
#         print(f"Error uploading client {client_name} to Elasticsearch: {e}")
#         return None


# upload_client_to_elasticsearch(1, "Jane Doe", "https://adybybuoqeunggekybzl.supabase.co/storage/v1/object/public/BiteSpace/c1.jpg")
