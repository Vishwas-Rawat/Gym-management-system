package com.gymmanagement.usermanagement.Response;

public record LogFoodResponse(
	    Long logId,
	    String message,
	    Double calories
	) {}