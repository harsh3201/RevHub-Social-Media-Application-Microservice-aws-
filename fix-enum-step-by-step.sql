USE revhub;

-- Step 1: Add the new enum value to existing enum
ALTER TABLE posts MODIFY COLUMN visibility ENUM('FOLLOWERS','PRIVATE','PUBLIC','FOLLOWERS_ONLY') NOT NULL DEFAULT 'PUBLIC';

-- Step 2: Update FOLLOWERS to FOLLOWERS_ONLY
UPDATE posts SET visibility = 'FOLLOWERS_ONLY' WHERE visibility = 'FOLLOWERS';

-- Step 3: Remove the old FOLLOWERS value from enum
ALTER TABLE posts MODIFY COLUMN visibility ENUM('PUBLIC','PRIVATE','FOLLOWERS_ONLY') NOT NULL DEFAULT 'PUBLIC';

-- Show the result
SELECT DISTINCT visibility FROM posts;
DESCRIBE posts;