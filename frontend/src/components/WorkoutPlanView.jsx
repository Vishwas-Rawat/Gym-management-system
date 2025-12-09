import React from 'react';
import {
  FitnessCenter,
  Notes,
  Person,
  AccessTime,
  CalendarToday
} from '@mui/icons-material';
import '../styles/PlanViews.css'; // Import the new CSS

const WorkoutPlanView = ({ plan, hasTrainer, availableTrainers }) => {
  // --- RENDER NO PLAN STATE ---
  if (!plan) {
    return (
      <div className="plan-container">
        {hasTrainer === false ? (
           <div className="plan-info-hero">
             <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: '#e2e8f0', marginBottom: '20px' }}>
                  <Person style={{ fontSize: 50, color: '#64748b' }} />
             </div>
             <h2>No trainer assigned</h2>
             <p>Here are the available trainers in your gym. Contact the admin or visit the desk to get assigned!</p>
             
             <div className="exercises-grid" style={{ marginTop: '40px', textAlign: 'left' }}>
                 {availableTrainers && availableTrainers.length > 0 ? availableTrainers.map(trainer => (
                     <div className="exercise-card" key={trainer.trainerId}>
                         <div className="ex-title">{trainer.user?.firstName} {trainer.user?.lastName || trainer.user?.username}</div>
                         <div className="ex-tag">{trainer.specialization}</div>
                         <p>Experience: {trainer.experience} years</p>
                         <button className="btn-request" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>View Profile</button> 
                     </div>
                 )) : (
                     <p>No trainers available at the moment.</p>
                 )}
             </div>
           </div>
        ) : (
           <div className="plan-info-hero">
              <FitnessCenter style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
              <h2>No workout plan assigned yet.</h2>
              <p>Your trainer hasn't assigned a plan yet. Use the 'Request New Plan' button above to ask for one!</p>
           </div>
        )}
      </div>
    );
  }

  // --- DATA PREP ---
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const exercisesByDay = {};
  daysOfWeek.forEach(day => { exercisesByDay[day] = []; });

  if (plan.exercises && Array.isArray(plan.exercises)) {
    plan.exercises.forEach(ex => {
      if (ex.days && Array.isArray(ex.days)) {
        ex.days.forEach(day => {
          if (exercisesByDay[day]) exercisesByDay[day].push(ex);
        });
      }
    });
  }

  // --- RENDER PLAN STATE ---
  return (
    <div className="plan-container">
      {/* PLAN DETAILS HERO */}
      <div className="plan-info-hero">
        <h1>{plan.planName}</h1>
        <p>
          Assigned by <strong>{plan.trainerName || 'your trainer'}</strong> on {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'Unknown Date'}
        </p>
      </div>

      {/* DAYS GRID */}
      <div className="days-grid">
        {daysOfWeek.map(day => {
          const dayExercises = exercisesByDay[day];
          if (dayExercises.length === 0) return null;

          return (
            <div className="day-card" key={day}>
              <div className="day-header">
                  <h3>{day}</h3>
                  <span className="badge-count">{dayExercises.length} Exercises</span>
              </div>
              
              <div className="day-content">
                   <div className="exercises-grid">
                    {dayExercises.map((ex, idx) => (
                      <div className="exercise-card" key={idx}>
                            <div>
                                <div className="ex-title">
                                    {ex.displayName || ex.exerciseName.replace(/_/g, ' ')}
                                </div>
                                <span className="ex-tag">
                                    {ex.targetMuscleGroup || "Workout"}
                                </span>
                            </div>
                            
                            <div className="ex-details">
                                <div className="detail-row">
                                    <span className="detail-label">Sets x Reps</span>
                                    <span className="detail-value">{ex.sets} x {ex.reps}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Rest</span>
                                    <span className="detail-value rest">{ex.restSeconds}s</span>
                                </div>
                                {ex.notes && (
                                    <div className="ex-notes">
                                        <Notes style={{ fontSize: 16 }} /> {ex.notes}
                                    </div>
                                )}
                            </div>
                      </div>
                    ))}
                   </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPlanView;
