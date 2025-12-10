USE revhub;

-- Update the posts table to support FOLLOWERS_ONLY visibility
ALTER TABLE posts MODIFY COLUMN visibility ENUM('PUBLIC', 'PRIVATE', 'FOLLOWERS_ONLY') NOT NULL DEFAULT 'PUBLIC';

-- Show the updated table structure
DESCRIBE posts;