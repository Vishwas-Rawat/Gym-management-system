import React from 'react';
import { Restaurant, AccessTime, Person, FitnessCenter } from '@mui/icons-material';
import '../styles/PlanViews.css'; // Import the new CSS

const DietPlanView = ({ plan, hasTrainer, availableTrainers }) => {
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
             <p>Here are the available trainers in your gym who can create a diet plan for you!</p>
             
             <div className="exercises-grid" style={{ marginTop: '40px', textAlign: 'left' }}>
                 {availableTrainers && availableTrainers.length > 0 ? availableTrainers.map(trainer => (
                     <div className="exercise-card" key={trainer.trainerId}>
                         <div className="ex-title">{trainer.user?.firstName} {trainer.user?.lastName || trainer.user?.username}</div>
                         <div className="ex-tag">{trainer.specialization}</div>
                         <p>Experience: {trainer.experience} years</p>
                         <button className="btn-request" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>View Details</button> 
                     </div>
                 )) : (
                     <p>No trainers available at the moment.</p>
                 )}
             </div>
           </div>
        ) : (
           <div className="plan-info-hero">
              <Restaurant style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
              <h2>No diet plan assigned yet.</h2>
              <p>Your trainer hasn't assigned a diet plan yet. Use the 'Request New Plan' button above to ask for one!</p>
           </div>
        )}
      </div>
    );
  }

  // --- DATA PREP ---
  const {
    planName,
    trainerName,
    memberName,
    dietType,
    createdAt,
    meals
  } = plan;

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="plan-container">
      {/* INFO HERO */}
       <div className="plan-info-hero" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <div>
            <h1 style={{ color: 'var(--primary-color)' }}>{planName}</h1>
            <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
               <span className="ex-tag" style={{ marginBottom: 0 }}>
                    <Restaurant style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }} /> {dietType}
               </span>
               <span className="ex-tag" style={{ marginBottom: 0, background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    <AccessTime style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }} /> Created: {formattedDate}
               </span>
            </div>
            <p className="detail-label" style={{ fontSize: '1rem' }}>
               <strong>Member:</strong> {memberName} | <strong>Trainer:</strong> {trainerName}
            </p>
         </div>
         <FitnessCenter style={{ fontSize: 100, color: '#000', opacity: 0.05 }} />
       </div>

       <h2 style={{ marginBottom: '30px', fontWeight: 800 }}>Meal Schedule</h2>

      {/* MEALS GRID */}
       <div className="days-grid">
         {meals?.map((meal, index) => (
           <div className="day-card" key={index}>
             <div className="meal-card-header">
                  <span className="meal-title">{meal.mealName}</span>
                  {meal.protein && (
                    <span className="meal-protein-tag">
                      Protein: {meal.protein.proteinName} - {meal.protein.proteinQuantity}
                    </span>
                  )}
             </div>
             <div className="day-content" style={{ padding: 0 }}>
                <div className="custom-table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th width="40%">Food Item</th>
                                <th width="25%">Quantity</th>
                                <th width="35%">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meal.foods.map((food, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>{food.foodName}</td>
                                    <td>{food.quantity}</td>
                                    <td style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{food.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default DietPlanView;
