package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String email;
    private String phoneNumber;
    private String password;
    private String username;
    private String firstName;
    private String role;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
}
