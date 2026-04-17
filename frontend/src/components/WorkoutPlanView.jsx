import React from 'react';
import '../styles/PlanViews.css';

// --- Custom SVGs to replace MUI ---
const Icons = {
    FitnessCenter: ({ size = 24, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M6.5 6.5h11"></path>
            <path d="M6.5 17.5h11"></path>
            <path d="M6 20v-2a6 6 0 0 1 12 0v2"></path>
            <path d="M6 4v2a6 6 0 0 0 12 0V4"></path>
            <rect x="4" y="2" width="4" height="2" rx="1"></rect>
            <rect x="16" y="2" width="4" height="2" rx="1"></rect>
            <rect x="4" y="20" width="4" height="2" rx="1"></rect>
            <rect x="16" y="20" width="4" height="2" rx="1"></rect>
        </svg>
    ),
    Person: ({ size = 24, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    Notes: ({ size = 16, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
        </svg>
    ),
    Calendar: ({ size = 20, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Clock: ({ size = 16, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    )
};

const WorkoutPlanView = ({ plan }) => {
  if (!plan) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed var(--db-border)' }}>
        <Icons.FitnessCenter size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
        <h3 style={{ color: 'var(--db-text-secondary)', margin: 0 }}>No active workout plan assigned.</h3>
        <p style={{ color: 'var(--db-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Assign a plan to start tracking progress.</p>
      </div>
    );
  }

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

  return (
    <div className="plan-view-v2">
      <div className="plan-header-mini">
        <h1 className="plan-title-mini">{plan.planName}</h1>
        <div className="plan-meta-mini">
             Training Goal: <span className="highlight-text">{plan.trainingGoal || 'General Fitness'}</span> 
             <span className="separator">•</span>
             Assigned: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <div className="days-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {daysOfWeek.map(day => {
          const dayExercises = exercisesByDay[day];
          if (dayExercises.length === 0) return null;

          return (
            <div className="day-group" key={day}>
              <div className="day-group-header">
                  <h3 className="day-name">{day}</h3>
                  <div className="day-line"></div>
                  <span className="day-count">{dayExercises.length} EXERCISES</span>
              </div>
              
              <div className="exercises-grid-compact">
                {dayExercises.map((ex, idx) => (
                  <div className="exercise-card-compact" key={idx}>
                    <div className="ex-header-compact">
                        <div className="ex-name-compact">
                            {ex.displayName || ex.exerciseName.replace(/_/g, ' ')}
                        </div>
                        <span className="ex-muscle-compact">
                            {ex.targetMuscleGroup || "Body"}
                        </span>
                    </div>
                    
                    <div className="ex-stats-compact">
                        <div className="stat-box">
                            <div className="stat-label">SETS X REPS</div>
                            <div className="stat-value">{ex.sets} x {ex.reps}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">REST</div>
                            <div className="stat-value highlight">{ex.restSeconds}s</div>
                        </div>
                    </div>
                    
                    {ex.notes && (
                        <div className="ex-notes-compact">
                            <Icons.Notes size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                            <span>{ex.notes}</span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPlanView;
