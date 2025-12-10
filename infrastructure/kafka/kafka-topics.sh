#!/bin/bash

echo "Creating Kafka topics..."

kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic user-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic post-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic social-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic chat-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic notification-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic feed-events --partitions 3 --replication-factor 1
kafka-topics --create --if-not-exists --bootstrap-server localhost:9092 --topic saga-events --partitions 3 --replication-factor 1

echo "Kafka topics created successfully"
kafka-topics --list --bootstrap-server localhost:9092
