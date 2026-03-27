import React from 'react';
import '../styles/PlanViews.css';

// --- Custom SVGs ---
const Icons = {
    Restaurant: ({ size = 24, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
    ),
    Fire: ({ size = 20, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
             <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
    ),
    Wheat: ({ size = 20, style }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="M2 22 22 2"></path><path d="M16 6a4 4 0 0 0-4 4"></path><path d="M22 2a4 4 0 0 0-4 4"></path><path d="M2 22a4 4 0 0 1 4-4"></path><path d="M8 18a4 4 0 0 1-4 4"></path>
        </svg>
    )
};

const DietPlanView = ({ plan }) => {
  if (!plan) {
    return (
      <div className="no-plan-container">
        <Icons.Restaurant size={48} style={{ opacity: 0.1, marginBottom: '1.5rem', color: 'var(--text-main)' }} />
        <h3 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.25rem' }}>No active diet plan assigned.</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>Nutrition tracking will start once a plan is assigned.</p>
      </div>
    );
  }

  return (
    <div className="plan-view-v2">
      <div className="plan-header-mini">
        <h1 className="plan-title-mini" style={{ color: '#fcc419' }}>{plan.planName}</h1>
        <div className="plan-meta-mini">
             <span className="highlight-text" style={{ color: '#fcc419' }}>{plan.dietType || 'Custom Diet'}</span> 
             <span className="separator">•</span>
             Assigned: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <div className="days-stack">
        {plan.meals?.map((meal, index) => (
            <div className="day-group" key={index}>
              <div className="day-group-header">
                  <h3 className="day-name" style={{ color: '#fcc419' }}>{meal.mealName}</h3>
                  <div className="day-line"></div>
                  {meal.protein && (
                       <span className="day-count" style={{ color: '#fcc419', background: 'rgba(252, 196, 25, 0.1)' }}>{meal.foods?.length || 0} ITEMS</span>
                  )}
              </div>
              
              <div className="exercises-grid-compact">
                {meal.foods?.map((food, idx) => (
                  <div className="exercise-card-compact" key={idx}>
                    <div className="ex-header-compact">
                        <div className="ex-name-compact" style={{ fontSize: '1.1rem' }}>
                            {food.foodName}
                        </div>
                    </div>
                    
                    <div className="ex-stats-compact">
                        <div className="stat-box">
                            <div className="stat-label">QUANTITY</div>
                            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{food.quantity}</div>
                        </div>
                        {food.calories && (
                            <div className="stat-box">
                                <div className="stat-label">CALORIES</div>
                                <div className="stat-value highlight" style={{ color: '#fcc419' }}>{food.calories}</div>
                            </div>
                        )}
                    </div>
                    
                    {food.notes && (
                        <div className="ex-notes-compact">
                            <span>{food.notes}</span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlanView;
