package com.gymmanagement.usermanagement.Response;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AdminProfileResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String role;
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    private List<GymDto> gyms;

    @Data
    public static class GymDto {
        private Long gymId;
        private String gymName;
        private String address;
        private String city;
        private Boolean isActive;
    }
}
