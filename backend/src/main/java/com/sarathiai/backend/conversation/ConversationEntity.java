
package com.sarathiai.backend.conversation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "sarathi_conversations")
public class ConversationEntity {

    @Id
    @Column(length = 100, nullable = false)
    private String id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String messagesJson;

    @Column(nullable = false)
    private Instant time;

    public ConversationEntity() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessagesJson() {
        return messagesJson;
    }

    public void setMessagesJson(String messagesJson) {
        this.messagesJson = messagesJson;
    }

    public Instant getTime() {
        return time;
    }

    public void setTime(Instant time) {
        this.time = time;
    }
}
