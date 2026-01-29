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

    private boolean isMemberValid(Member m) {
        return m != null &&
                Boolean.TRUE.equals(m.getIsActive()) &&
                m.getDeletedAt() == null &&
                m.getUser() != null &&
                Boolean.TRUE.equals(m.getUser().getIsActive()) &&
                m.getGym() != null &&
                Boolean.TRUE.equals(m.getGym().getIsActive());
    }

    private boolean isTrainerValid(Trainer t) {
        return t != null &&
                Boolean.TRUE.equals(t.getIsActive()) &&
                Boolean.FALSE.equals(t.getDeleted()) &&
                t.getDeletedAt() == null &&
                t.getUser() != null &&
                Boolean.TRUE.equals(t.getUser().getIsActive()) &&
                t.getGym() != null &&
                Boolean.TRUE.equals(t.getGym().getIsActive());
    }

    private boolean isUserActive(com.gymmanagement.commonservices.entity.User u) {
        return u != null && Boolean.TRUE.equals(u.getIsActive());
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

            // 1. If Member: Can chat with Trainer & Admin
            if (isMember) {
                Member member = memberRepo.findByUser_UserId(userId).orElse(null);
                if (member != null) {
                    // A. Add Assigned Trainer
                    Trainer trainer = member.getTrainer();
                    if (isTrainerValid(trainer)) {
                        contacts.add(createContact(trainer.getUser().getUserId(),
                                "Trainer: " + getDisplayName(trainer),
                                "TRAINER"));
                    }

                    // B. Add Gym Admin
                    if (member.getGym() != null && member.getGym().getCreatedByAdmin() != null) {
                        var admin = member.getGym().getCreatedByAdmin();
                        if (isUserActive(admin)) {
                            contacts.add(createContact(admin.getUserId(),
                                    "Admin: " + getDisplayName(admin), "ADMIN"));
                        }
                    }
                }
            }

            // 2. If Trainer: Can chat with assigned Members
            if (isTrainer) {
                Trainer trainer = trainerRepo.findByUser_UserId(userId).orElse(null);
                if (trainer != null) {
                    List<Member> members = memberRepo.findByTrainer_TrainerId(trainer.getTrainerId());
                    for (Member m : members) {
                        if (isMemberValid(m)) {
                            contacts.add(createContact(m.getUser().getUserId(), m.getUser().getUsername(), "MEMBER"));
                        }
                    }
                }
            }

            // 3. If Admin/SuperAdmin/SystemAdmin: Can chat with all Members & Trainers in
            // their Gyms
            if (isAdmin) {
                List<Gym> myGyms = gymRepo.findByCreatedByAdmin_UserId(userId);

                // Fallback for ANY Admin: If no gyms created by them, find ALL gyms for
                // visibility
                if (myGyms.isEmpty()) {
                    System.out.println(
                            "⚠️ Admin " + userId + " has no personalized gyms. Fetching all gyms as fallback.");
                    myGyms = gymRepo.findAll();
                }

                System.out.println("🔍 Admin Found " + myGyms.size() + " gyms for visibility.");
                for (Gym gym : myGyms) {
                    // Add all trainers in this gym
                    List<Trainer> trainers = trainerRepo.findByGym_GymId(gym.getGymId());
                    System.out.println("   📍 Gym [" + gym.getGymName() + "] has " + trainers.size() + " trainers.");
                    for (Trainer t : trainers) {
                        if (isTrainerValid(t) && !t.getUser().getUserId().equals(userId)) {
                            contacts.add(createContact(t.getUser().getUserId(),
                                    "Trainer: " + getDisplayName(t),
                                    "TRAINER"));
                        }
                    }
                    // Add all members in this gym
                    List<Member> members = memberRepo.findByGym_GymId(gym.getGymId());
                    System.out.println("   📍 Gym [" + gym.getGymName() + "] has " + members.size() + " members.");
                    for (Member m : members) {
                        if (isMemberValid(m) && !m.getUser().getUserId().equals(userId)) {
                            contacts.add(createContact(m.getUser().getUserId(),
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
                        if (isTrainerValid(t)) {
                            contacts.add(createContact(t.getUser().getUserId(),
                                    getDisplayName(t),
                                    "TRAINER"));
                        }
                    }
                    // Search Members
                    List<Member> members = memberRepo.searchByGymAndName(gym.getGymId(), query);
                    for (Member m : members) {
                        if (isMemberValid(m)) {
                            contacts.add(createContact(m.getUser().getUserId(), getDisplayName(m), "MEMBER"));
                        }
                    }
                }
            } else if (isTrainer) {
                Trainer trainer = trainerRepo.findByUser_UserId(userId).orElse(null);
                if (trainer != null) {
                    List<Member> members = memberRepo.findByTrainer_TrainerId(trainer.getTrainerId());
                    for (Member m : members) {
                        if (isMemberValid(m) && matchesQuery(m, query)) {
                            contacts.add(createContact(m.getUser().getUserId(), getDisplayName(m), "MEMBER"));
                        }
                    }
                }
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

    private ContactResponse createContact(Integer userId, String name, String role) {
        ContactResponse cr = new ContactResponse();
        cr.setUserId(userId);
        cr.setName(name);
        cr.setRole(role);

        // Fetch Public Key
        publicKeyRepo.findByUserId(userId).ifPresent(pk -> cr.setPublicKey(pk.getPublicKeyPem()));

        return cr;
    }
}
