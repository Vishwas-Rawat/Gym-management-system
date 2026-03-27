package com.gymmanagement.usermanagement.Response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExpiringMemberDTO {
    private Integer memberId;
    private Integer userId;
    private String fullName;
    private LocalDate expiryDate;
}
