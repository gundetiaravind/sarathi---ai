package com.sarathiai.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of(
            "application", "Sarathi AI",
            "status", "UP",
            "message", "Sarathi AI backend is running"
        );
    }
}
