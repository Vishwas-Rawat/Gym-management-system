package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import lombok.Data;

@Data
public class GymMemberResponse {
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private String workoutTimeSlot;

    public GymMemberResponse(Member member) {
        this.fullName = member.getUser().getFirstName() + " " +
                        (member.getUser().getLastName() != null ? member.getUser().getLastName() : "");
        this.email = member.getUser().getEmail();
        this.phoneNo = member.getUser().getPhoneNumber();
        this.membershipPlan = member.getMembershipPlan();
        this.workoutTimeSlot = member.getWorkoutTimeSlot();
    }
}
