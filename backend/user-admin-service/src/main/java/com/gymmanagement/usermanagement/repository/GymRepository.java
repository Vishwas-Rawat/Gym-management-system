package com.gymmanagement.usermanagement.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.User;

public interface GymRepository extends JpaRepository<Gym, Long> {
	boolean existsByGymNameAndAddressAndCityAndCreatedByAdmin_UserId(
		    String gymName, String address, String city, Integer adminId
		);
	List<Gym> findByCreatedByAdmin(User createdByAdmin);
	boolean existsByGymNameIgnoreCaseAndAddressIgnoreCaseAndCityIgnoreCaseAndCreatedByAdmin_UserId(
		    String gymName, String address, String city, Integer adminId);

    List<Gym> findByCreatedByAdminAndIsActiveTrue(User admin);

}
