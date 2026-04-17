package com.gymmanagement.usermanagement.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    private String email;
    private String phoneNumber;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", 
             message = "Password must include one uppercase letter, one lowercase letter, one digit, and one special character")
    private String password;
    private String username;
    private String firstName;
    private String role;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
}
