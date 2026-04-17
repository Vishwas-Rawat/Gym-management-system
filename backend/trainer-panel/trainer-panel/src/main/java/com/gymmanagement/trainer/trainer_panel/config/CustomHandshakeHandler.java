package com.gymmanagement.trainer.trainer_panel.config;

import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.web.socket.WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        // The Principal you stored earlier
        return (Principal) attributes.get("principal");
    }
}
