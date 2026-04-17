// AssignMembersToTrainerRequest.java
package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.util.List;

@Data
public class AssignMembersToTrainerRequest {
    private Integer trainerId;
    private List<Integer> memberIds;
}