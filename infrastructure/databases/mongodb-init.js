db = db.getSiblingDB('revhub');

db.createCollection('posts');
db.posts.createIndex({ "userId": 1 });
db.posts.createIndex({ "createdAt": -1 });

db.createCollection('messages');
db.messages.createIndex({ "senderId": 1, "receiverId": 1 });
db.messages.createIndex({ "createdAt": -1 });

db.createCollection('notifications');
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "createdAt": -1 });
db.notifications.createIndex({ "read": 1 });

db.createCollection('feed_items');
db.feed_items.createIndex({ "userId": 1 });
db.feed_items.createIndex({ "createdAt": -1 });

print('MongoDB initialized successfully');
