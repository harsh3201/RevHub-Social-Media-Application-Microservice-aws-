package com.revhub.chatservice.repository;

import com.revhub.chatservice.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
        String sender1, String receiver1, String sender2, String receiver2);
    List<Message> findByReceiverUsernameAndReadFalse(String receiverUsername);
}
