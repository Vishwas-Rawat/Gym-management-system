package com.gymmanagement.usermanagement.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GymMinimalResponse {
    private Long gymId;
    private String gymName;
}
