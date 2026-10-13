
package com.sarathiai.backend.conversation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository
        extends JpaRepository<ConversationEntity, String> {
}
