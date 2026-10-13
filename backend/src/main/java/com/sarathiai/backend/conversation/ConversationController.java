package com.sarathiai.backend.conversation;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository repository;
    private final ObjectMapper objectMapper;

    public ConversationController(
            ConversationRepository repository,
            ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public record ConversationRequest(
            @NotBlank String id,
            String title,
            Object messages,
            Instant time) {
    }

    public record ConversationResponse(
            String id,
            String title,
            Object messages,
            Instant time) {
    }

    @GetMapping
    public List<ConversationResponse> getAllConversations() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ConversationResponse saveConversation(
            @Valid @RequestBody ConversationRequest request) {

        ConversationEntity entity = repository
                .findById(request.id())
                .orElseGet(ConversationEntity::new);

        entity.setId(request.id());

        entity.setTitle(
                request.title() == null || request.title().isBlank()
                        ? "Sarathi AI chat"
                        : request.title());

        Object messages = request.messages() == null
                ? List.of()
                : request.messages();

        try {
            entity.setMessagesJson(
                    objectMapper.writeValueAsString(messages));
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Could not serialize conversation messages.",
                    exception);
        }

        entity.setTime(
                request.time() == null
                        ? Instant.now()
                        : request.time());

        ConversationEntity savedEntity = repository.save(entity);

        return toResponse(savedEntity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteConversation(@PathVariable String id) {
        repository.deleteById(id);
    }

    private ConversationResponse toResponse(
            ConversationEntity entity) {

        try {
            Object messages = objectMapper.readValue(
                    entity.getMessagesJson(),
                    Object.class);

            return new ConversationResponse(
                    entity.getId(),
                    entity.getTitle(),
                    messages,
                    entity.getTime());

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Could not read saved conversation.",
                    exception);
        }
    }
}
