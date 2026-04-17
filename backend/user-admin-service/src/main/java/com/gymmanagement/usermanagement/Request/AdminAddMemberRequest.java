package com.gymmanagement.usermanagement.Request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AdminAddMemberRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    private String phoneNo;

    @NotNull(message = "Plan ID is required")
    private Integer planId;

    @NotNull(message = "Joining fee is required")
    @Min(value = 0, message = "Joining fee cannot be negative")
    private Double joiningFee;

    @Min(value = 0, message = "Discount cannot be negative")
    private Double discount;

    @NotBlank(message = "Payment mode is required")
    private String paymentMode;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "Gym ID is required")
    private Integer gymId;
}