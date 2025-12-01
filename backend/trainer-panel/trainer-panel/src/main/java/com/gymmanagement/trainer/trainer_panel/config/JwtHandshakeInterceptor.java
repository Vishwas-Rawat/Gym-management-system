package com.gymmanagement.trainer.trainer_panel.config;

import com.gymmanagement.trainer.trainer_panel.security.JwtUtil;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.security.Principal;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;
    private final UserManagementClient userClient;

    public JwtHandshakeInterceptor(JwtUtil jwtUtil, UserManagementClient userClient) {
        this.jwtUtil = jwtUtil;
        this.userClient = userClient;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        String auth = null;

        // 1️⃣ Try normal header
        var headers = request.getHeaders();
        auth = headers.getFirst("Authorization");
        if (auth == null) auth = headers.getFirst("authorization");

        // 2️⃣ Try query parameter fallback (REQUIRED FOR POSTMAN)
        if (auth == null) {
            URI uri = request.getURI();
            String query = uri.getQuery();  // full query string
            if (query != null && query.contains("token=")) {
                String token = query.substring(query.indexOf("token=") + 6);
                // If multiple params exist, cut at '&'
                if (token.contains("&")) token = token.substring(0, token.indexOf("&"));
                auth = "Bearer " + token;
            }
        }

        // 3️⃣ Validate token
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                String token = auth.substring(7);
                String email = jwtUtil.extractEmail(token);
                Integer userId = userClient.getUserByEmail(email).getUserId();

                Principal principal = new StompPrincipal(userId.toString(), email);
                attributes.put("principal", principal);
                return true; // handshake success

            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }

        return false; // Unauthorized (403)
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }

    static class StompPrincipal implements Principal {
        private final String name;
        private final String email;
        StompPrincipal(String name, String email) {
            this.name = name;
            this.email = email;
        }
        @Override public String getName() { return name; }
        public String getEmail() { return email; }
    }
}
