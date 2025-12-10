-- Clean up duplicate follow relationships
-- This removes duplicate follows keeping only the first one

DELETE f1 FROM follows f1
INNER JOIN follows f2 
WHERE f1.id > f2.id 
AND f1.follower_username = f2.follower_username 
AND f1.following_username = f2.following_username;

-- Show remaining follows
SELECT * FROM follows ORDER BY follower_username, following_username;
