-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS revhub;

-- Grant privileges to root from any host
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Harsh@4801';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Also update the existing root@localhost password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Harsh@4801';

-- Flush privileges
FLUSH PRIVILEGES;
