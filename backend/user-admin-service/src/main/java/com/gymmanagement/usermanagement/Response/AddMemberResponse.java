package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class AddMemberResponse {
    private Integer memberId;
    private String name;
    private String email;
    private String message;

    public AddMemberResponse(Integer memberId, String name, String email, String message) {
        this.memberId = memberId;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    // Getters & Setters
}
