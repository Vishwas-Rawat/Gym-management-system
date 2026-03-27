package com.gymmanagement.usermanagement.Request;

import java.time.LocalDate;

public record LogFoodRequest(
	    Long foodId,
	    Double quantity,
	    String mealName,
	    LocalDate date
	) {}