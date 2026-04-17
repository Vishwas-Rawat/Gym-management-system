package com.gymmanagement.usermanagement.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberAssignmentResponse {
    private boolean success;
    private String message;
    private String trainerName;
    private List<String> assignedMemberNames;
}
