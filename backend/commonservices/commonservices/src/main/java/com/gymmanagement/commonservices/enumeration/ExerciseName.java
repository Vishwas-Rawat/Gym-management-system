// src/main/java/com/gymmanagement/commonservices/enumeration/ExerciseName.java

package com.gymmanagement.commonservices.enumeration;

import lombok.Getter;

@Getter
public enum ExerciseName {

    // CHEST
    BARBELL_BENCH_PRESS("Barbell Bench Press", "Chest"),
    DUMBBELL_BENCH_PRESS("Dumbbell Bench Press", "Chest"),
    INCLINE_BENCH_PRESS("Incline Bench Press", "Chest"),
    DECLINE_BENCH_PRESS("Decline Bench Press", "Chest"),
    CHEST_FLY_MACHINE("Chest Fly (Machine)", "Chest"),
    DUMBBELL_FLYES("Dumbbell Flyes", "Chest"),
    CABLE_CROSSOVER("Cable Crossover", "Chest"),
    PUSH_UPS("Push Ups", "Chest"),
    DIPS_CHEST("Dips (Chest Focus)", "Chest"),

    // BACK
    DEADLIFT("Deadlift", "Back"),
    BENT_OVER_ROW("Bent Over Row", "Back"),
    PULL_UPS("Pull Ups", "Back"),
    LAT_PULLDOWN("Lat Pulldown", "Back"),
    SEATED_CABLE_ROW("Seated Cable Row", "Back"),
    T_BAR_ROW("T-Bar Row", "Back"),
    SINGLE_ARM_DUMBBELL_ROW("Single Arm Dumbbell Row", "Back"),
    FACE_PULL("Face Pull", "Back"),
    HYPEREXTENSION("Back Extension", "Back"),

    // SHOULDERS
    OVERHEAD_PRESS("Overhead Press (Barbell)", "Shoulders"),
    DUMBBELL_SHOULDER_PRESS("Dumbbell Shoulder Press", "Shoulders"),
    LATERAL_RAISES("Lateral Raises", "Shoulders"),
    FRONT_RAISES("Front Raises", "Shoulders"),
    REAR_DELT_FLY("Rear Delt Fly", "Shoulders"),
    ARNOLD_PRESS("Arnold Press", "Shoulders"),
    UPRIGHT_ROW("Upright Row", "Shoulders"),
    SHRUGS("Shrugs (Barbell/Dumbbell)", "Shoulders"),

    // BICEPS
    BARBELL_CURL("Barbell Curl", "Biceps"),
    DUMBBELL_CURL("Dumbbell Curl", "Biceps"),
    HAMMER_CURL("Hammer Curl", "Biceps"),
    PREACHER_CURL("Preacher Curl", "Biceps"),
    CONCENTRATION_CURL("Concentration Curl", "Biceps"),
    CABLE_CURL("Cable Curl", "Biceps"),
    CHIN_UPS("Chin Ups", "Biceps"),

    // TRICEPS
    CLOSE_GRIP_BENCH_PRESS("Close Grip Bench Press", "Triceps"),
    TRICEP_DIPS("Tricep Dips", "Triceps"),
    SKULL_CRUSHERS("Skull Crushers", "Triceps"),
    TRICEP_PUSHDOWN("Tricep Pushdown (Cable)", "Triceps"),
    OVERHEAD_TRICEP_EXTENSION("Overhead Tricep Extension", "Triceps"),
    ROPE_PUSHDOWN("Rope Pushdown", "Triceps"),
    DIAMOND_PUSH_UPS("Diamond Push Ups", "Triceps"),

    // LEGS - QUADS
    BACK_SQUAT("Back Squat", "Legs"),
    FRONT_SQUAT("Front Squat", "Legs"),
    LEG_PRESS("Leg Press", "Legs"),
    BULGARIAN_SPLIT_SQUAT("Bulgarian Split Squat", "Legs"),
    GOBLET_SQUAT("Goblet Squat", "Legs"),
    HACK_SQUAT("Hack Squat", "Legs"),
    LEG_EXTENSION("Leg Extension", "Legs"),

    // LEGS - HAMSTRINGS & GLUTES
    ROMANIAN_DEADLIFT("Romanian Deadlift", "Legs"),
    GOOD_MORNING("Good Morning", "Legs"),
    LYING_LEG_CURL("Lying Leg Curl", "Legs"),
    SEATED_LEG_CURL("Seated Leg Curl", "Legs"),
    GLUTE_HAM_RAISE("Glute Ham Raise", "Legs"),
    HIP_THRUST("Hip Thrust", "Legs"),

    // CALVES
    STANDING_CALF_RAISE("Standing Calf Raise", "Calves"),
    SEATED_CALF_RAISE("Seated Calf Raise", "Calves"),
    DONKEY_CALF_RAISE("Donkey Calf Raise", "Calves"),

    // CORE / ABS
    PLANK("Plank", "Core"),
    RUSSIAN_TWIST("Russian Twist", "Core"),
    HANGING_LEG_RAISE("Hanging Leg Raise", "Core"),
    AB_WHEEL_ROLLOUT("Ab Wheel Rollout", "Core"),
    CRUNCHES("Crunches", "Core"),
    BICYCLE_CRUNCH("Bicycle Crunch", "Core"),
    MOUNTAIN_CLIMBERS("Mountain Climbers", "Core"),
    DEAD_BUG("Dead Bug", "Core"),

    // FULL BODY / FUNCTIONAL
    BURPEES("Burpees", "Full Body"),
    CLEAN_AND_JERK("Clean & Jerk", "Full Body"),
    SNATCH("Snatch", "Full Body"),
    KETTLEBELL_SWING("Kettlebell Swing", "Full Body"),
    TURKISH_GET_UP("Turkish Get-Up", "Full Body"),
    FARMERS_WALK("Farmer's Walk", "Full Body"),

    // CARDIO
    TREADMILL_RUNNING("Treadmill Running", "Cardio"),
    CYCLING("Cycling", "Cardio"),
    ROWING_MACHINE("Rowing", "Cardio"),
    JUMP_ROPE("Jump Rope", "Cardio"),
    STAIR_CLIMBER("Stair Climber", "Cardio");

	private final String displayName;
    private final String muscleGroup;

    ExerciseName(String displayName, String muscleGroup) {
        this.displayName = displayName;
        this.muscleGroup = muscleGroup;
    }

    // FIXED: Now returns ExerciseName, not Exercise
    public static ExerciseName fromDisplayName(String name) {
        for (ExerciseName e : ExerciseName.values()) {
            if (e.getDisplayName().equalsIgnoreCase(name)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Unknown exercise: " + name);
    }

    // Optional: Get by enum name (e.g. "BARBELL_BENCH_PRESS")
    public static ExerciseName fromCode(String code) {
        return ExerciseName.valueOf(code.toUpperCase());
    }
}