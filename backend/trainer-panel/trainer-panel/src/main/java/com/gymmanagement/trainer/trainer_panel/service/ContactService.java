package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.ViewMemberResponse;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import com.gymmanagement.trainer.trainer_panel.dto.ContactResponse;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import com.gymmanagement.trainer.trainer_panel.repository.TrainerRepository;
import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.trainer.trainer_panel.repository.GymRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final MemberRepository memberRepo;
    private final TrainerRepository trainerRepo;
    private final GymRepository gymRepo;
    private final UserManagementClient userClient;
    private final com.gymmanagement.trainer.trainer_panel.repository.PublicKeyRepository publicKeyRepo;

    private boolean isMemberValid(Member m, boolean allowPending) {
        if (m == null || m.getDeletedAt() != null || m.getUser() == null || m.getGym() == null) return false;
        
        boolean gymActive = Boolean.TRUE.equals(m.getGym().getIsActive());
        if (!gymActive) return false;

        boolean userActive = Boolean.TRUE.equals(m.getUser().getIsActive());
        boolean isPending = com.gymmanagement.commonservices.enumeration.RegistrationStatus.PENDING.equals(m.getUser().getRegistrationStatus());
        
        return Boolean.TRUE.equals(m.getIsActive()) && (userActive || (allowPending && isPending));
    }

    private boolean isTrainerValid(Trainer t, boolean allowPending) {
        if (t == null || Boolean.TRUE.equals(t.getDeleted()) || t.getDeletedAt() == null || t.getUser() == null || t.getGym() == null) {
             // Handle t.getDeletedAt() == null logic from original code (it was actually t.getDeletedAt() == null)
        }
        // Original logic was t.getDeletedAt() == null. 
        // Let's stick closer to original but add the pending check.
        
        if (t == null || Boolean.TRUE.equals(t.getDeleted()) || t.getDeletedAt() != null || t.getUser() == null || t.getGym() == null) return false;
        
        boolean gymActive = Boolean.TRUE.equals(t.getGym().getIsActive());
        if (!gymActive) return false;

        boolean userActive = Boolean.TRUE.equals(t.getUser().getIsActive());
        boolean isPending = com.gymmanagement.commonservices.enumeration.RegistrationStatus.PENDING.equals(t.getUser().getRegistrationStatus());

        return Boolean.TRUE.equals(t.getIsActive()) && (userActive || (allowPending && isPending));
    }

    private boolean isUserActive(com.gymmanagement.commonservices.entity.User u, boolean allowPending) {
        if (u == null) return false;
        boolean userActive = Boolean.TRUE.equals(u.getIsActive());
        boolean isPending = com.gymmanagement.commonservices.enumeration.RegistrationStatus.PENDING.equals(u.getRegistrationStatus());
        return userActive || (allowPending && isPending);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ContactResponse> getContacts(Integer userId, String role) {
        System.out.println("✅ getContacts called for UserId: " + userId + ", Role: " + role);
        List<ContactResponse> contacts = new ArrayList<>();

        try {
            String normRole = role != null ? role.toUpperCase() : "";
            boolean isAdmin = normRole.endsWith("ADMIN");
            boolean isTrainer = normRole.endsWith("TRAINER");
            boolean isMember = normRole.endsWith("MEMBER");

            System.out.println("🔍 Normalized Role: " + normRole + " (isAdmin=" + isAdmin + ")");

            // 1. If Member: Can chat with Trainer & Admin (Strictly Active only)
            if (isMember) {
                Member member = memberRepo.findByUser_UserId(userId).orElse(null);
                if (member != null) {
                    // A. Add Assigned Trainer
                    Trainer trainer = member.getTrainer();
                    if (isTrainerValid(trainer, false)) {
                        contacts.add(createContact(trainer.getUser(),
                                "Trainer: " + getDisplayName(trainer),
                                "TRAINER"));
                    }

                    // B. Add Gym Admin
                    if (member.getGym() != null && member.getGym().getCreatedByAdmin() != null) {
                        var admin = member.getGym().getCreatedByAdmin();
                        if (isUserActive(admin, false)) {
                            contacts.add(createContact(admin,
                                    "Admin: " + getDisplayName(admin), "ADMIN"));
                        }
                    }
                }
            }

            // 2. If Trainer: Can chat with assigned Members AND Admin (Sync with user-admin-service)
            if (isTrainer) {
                Trainer trainer = trainerRepo.findByUser_UserId(userId).orElse(null);
                if (trainer != null && trainer.getGym() != null) {
                    // A. Add assigned Members (Official list from main database)
                    Long gymId = trainer.getGym().getGymId();
                    List<ViewMemberResponse> assignedMembers = userClient.getMembersByTrainer(gymId, trainer.getTrainerId());
                    
                    for (ViewMemberResponse vm : assignedMembers) {
                        // We only show Active members in Chat
                        if (Boolean.TRUE.equals(vm.getIsActive())) {
                            ContactResponse cr = new ContactResponse();
                            cr.setUserId(vm.getUserId());
                            cr.setName(vm.getFullName());
                            cr.setRole("MEMBER");
                            cr.setRegistrationStatus("REGISTERED"); // Since they are active in dashboard
                            
                            // Fetch Public Key if available
                            publicKeyRepo.findByUserId(vm.getUserId()).ifPresent(pk -> cr.setPublicKey(pk.getPublicKeyPem()));
                            contacts.add(cr);
                        }
                    }

                    // B. Add Gym Admin
                    if (trainer.getGym().getCreatedByAdmin() != null) {
                        var admin = trainer.getGym().getCreatedByAdmin();
                        if (isUserActive(admin, false)) {
                            contacts.add(createContact(admin,
                                    "Admin: " + getDisplayName(admin), "ADMIN"));
                        }
                    }
                }
            }

            // 3. If Admin/SuperAdmin/SystemAdmin: Can chat with all Members & Trainers in
            // their Gyms (Allow Pending)
            if (isAdmin) {
                List<Gym> myGyms = gymRepo.findByCreatedByAdmin_UserId(userId);

                if (myGyms.isEmpty()) {
                    System.out.println(
                            "⚠️ Admin " + userId + " has no personalized gyms. Fetching all gyms as fallback.");
                    myGyms = gymRepo.findAll();
                }

                for (Gym gym : myGyms) {
                    // Add all trainers in this gym
                    List<Trainer> trainers = trainerRepo.findByGym_GymId(gym.getGymId());
                    for (Trainer t : trainers) {
                        if (isTrainerValid(t, true) && !t.getUser().getUserId().equals(userId)) {
                            contacts.add(createContact(t.getUser(),
                                    "Trainer: " + getDisplayName(t),
                                    "TRAINER"));
                        }
                    }
                    // Add all members in this gym
                    List<Member> members = memberRepo.findByGym_GymId(gym.getGymId());
                    for (Member m : members) {
                        if (isMemberValid(m, true) && !m.getUser().getUserId().equals(userId)) {
                            contacts.add(createContact(m.getUser(),
                                    "Member: " + getDisplayName(m), "MEMBER"));
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error in getContacts: " + e.getMessage());
            e.printStackTrace();
        }

        return contacts;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ContactResponse> searchContacts(Integer userId, String role, String query) {
        List<ContactResponse> contacts = new ArrayList<>();
        if (query == null || query.isBlank())
            return contacts;

        try {
            String normRole = role != null ? role.toUpperCase() : "";
            boolean isAdmin = normRole.endsWith("ADMIN");
            boolean isTrainer = normRole.endsWith("TRAINER");
            boolean isMember = normRole.endsWith("MEMBER");

            if (isAdmin) {
                List<Gym> myGyms = gymRepo.findByCreatedByAdmin_UserId(userId);
                if (myGyms.isEmpty())
                    myGyms = gymRepo.findAll();

                for (Gym gym : myGyms) {
                    // Search Trainers
                    List<Trainer> trainers = trainerRepo.searchByGymAndName(gym.getGymId(), query);
                    for (Trainer t : trainers) {
                        if (isTrainerValid(t, true)) {
                            contacts.add(createContact(t.getUser(),
                                    getDisplayName(t),
                                    "TRAINER"));
                        }
                    }
                    // Search Members
                    List<Member> members = memberRepo.searchByGymAndName(gym.getGymId(), query);
                    for (Member m : members) {
                        if (isMemberValid(m, true)) {
                            contacts.add(createContact(m.getUser(), getDisplayName(m), "MEMBER"));
                        }
                    }
                }
            } else if (isTrainer) {
                // Reuse the strict getContacts logic filtered by query
                return getContacts(userId, role).stream()
                        .filter(c -> c.getName().toLowerCase().contains(query.toLowerCase()))
                        .collect(Collectors.toList());
            } else if (isMember) {
                // Members can search their trainer or admin
                List<ContactResponse> all = getContacts(userId, role);
                return all.stream()
                        .filter(c -> c.getName().toLowerCase().contains(query.toLowerCase()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            System.err.println("❌ Error in searchContacts: " + e.getMessage());
        }
        return contacts;
    }

    private boolean matchesQuery(Member m, String query) {
        String q = query.toLowerCase();
        if (m.getUser() != null && m.getUser().getUsername().toLowerCase().contains(q))
            return true;
        return false;
    }

    private String getDisplayName(Member m) {
        if (m.getUser() != null && m.getUser().getUserProfile() != null) {
            String full = m.getUser().getUserProfile().getFirstName() + " "
                    + m.getUser().getUserProfile().getLastName();
            if (!full.trim().isEmpty())
                return full;
        }
        return m.getUser() != null ? m.getUser().getUsername() : "Unknown Member";
    }

    private String getDisplayName(Trainer t) {
        if (t.getFullName() != null && !t.getFullName().trim().isEmpty())
            return t.getFullName();
        if (t.getUser() != null && t.getUser().getUserProfile() != null) {
            String full = t.getUser().getUserProfile().getFirstName() + " "
                    + t.getUser().getUserProfile().getLastName();
            if (!full.trim().isEmpty())
                return full;
        }
        return t.getUser() != null ? t.getUser().getUsername() : "Unknown Trainer";
    }

    private String getDisplayName(com.gymmanagement.commonservices.entity.User u) {
        if (u.getUserProfile() != null) {
            String full = u.getUserProfile().getFirstName() + " " + u.getUserProfile().getLastName();
            if (!full.trim().isEmpty())
                return full;
        }
        return u.getUsername();
    }

    private ContactResponse createContact(com.gymmanagement.commonservices.entity.User user, String name, String role) {
        ContactResponse cr = new ContactResponse();
        cr.setUserId(user.getUserId());
        cr.setName(name);
        cr.setRole(role);
        
        if (user.getRegistrationStatus() != null) {
            cr.setRegistrationStatus(user.getRegistrationStatus().name());
        } else {
            cr.setRegistrationStatus("REGISTERED"); // Fallback
        }

        // Fetch Public Key
        publicKeyRepo.findByUserId(user.getUserId()).ifPresent(pk -> cr.setPublicKey(pk.getPublicKeyPem()));

        return cr;
    }
}
