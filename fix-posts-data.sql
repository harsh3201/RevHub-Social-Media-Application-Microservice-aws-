USE revhub;

-- Update incorrect visibility values
UPDATE posts SET visibility = 'FOLLOWERS_ONLY' WHERE visibility = 'FOLLOWERS';

-- Now update the enum constraint
ALTER TABLE posts MODIFY COLUMN visibility ENUM('PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY') NOT NULL DEFAULT 'PUBLIC';

-- Show the updated table structure
DESCRIBE posts;