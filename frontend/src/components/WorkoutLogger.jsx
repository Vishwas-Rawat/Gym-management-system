import React, { useState, useEffect } from 'react';
import { logWorkout, searchExercise, addCustomExercise } from '../services/memberService';
import '../styles/dashboard.css';

// --- Custom SVGs ---
const IconSearch = ({ size = 20, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const IconPlus = ({ size = 20, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconClose = ({ size = 20, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const WorkoutLogger = ({ onLogSuccess, selectedDate }) => {
    // Form State
    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [setsCount, setSetsCount] = useState('');
    const [repsCount, setRepsCount] = useState('');
    const [weight, setWeight] = useState('');

    // UI State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCustomExerciseModal, setShowCustomExerciseModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Custom Exercise State
    const [customExercise, setCustomExercise] = useState({
        name: '',
        targetMuscleGroup: 'CHEST' // Default
    });

    const MUSCLE_GROUPS = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'ABS', 'CARDIO', 'OTHER'];

    // Update date if selectedDate prop changes (optional, but good for sync)
    useEffect(() => {
        if (selectedDate) setDate(selectedDate);
    }, [selectedDate]);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2 && !selectedExercise) {
                setIsSearching(true);
                try {
                    const results = await searchExercise(searchQuery);
                    setSearchResults(results);
                } catch (err) {
                    console.error("Search failed", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedExercise]);

    const handleSelectExercise = (exercise) => {
        setSelectedExercise(exercise);
        setSearchQuery(exercise.name);
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedExercise(null);
        setSetsCount('');
        setRepsCount('');
        setWeight('');
    };

    const handleLogWorkout = async () => {
        if (!selectedExercise || !setsCount) {
             setMessage({ type: 'error', text: 'Please select an exercise and sets.' });
             return;
        }

        setLoading(true);
        try {
            await logWorkout({
                date,
                exerciseId: selectedExercise.id,
                sets: parseInt(setsCount),
                reps: parseInt(repsCount) || 0,
                weightKg: parseFloat(weight) || 0
            });
            setMessage({ type: 'success', text: 'Workout set logged successfully!' });
            
            // Clear stats but keep exercise for easy multi-set logging
            setSetsCount('');
            setRepsCount('');
            setWeight('');
            if (onLogSuccess) onLogSuccess();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
             setMessage({ type: 'error', text: error.toString() });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomExercise = async () => {
        if (!customExercise.name) {
            alert("Exercise Name is required.");
            return;
        }
        try {
            const newEx = await addCustomExercise(customExercise);
            handleSelectExercise(newEx);
            setShowCustomExerciseModal(false);
            setCustomExercise({ name: '', targetMuscleGroup: 'CHEST' });
            setMessage({ type: 'success', text: 'Custom exercise created!' });
        } catch (error) {
             alert("Failed to create exercise: " + error);
        }
    };

    return (
        <div style={{ padding: '0.5rem' }}>
             <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--db-text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>Log Your Sets</h3>
                    <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.9rem' }}>Record your training progress.</p>
                 </div>
            </div>
             
             {/* Logger Form - Custom Layout for Compactness */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 
                 {/* Row 1: Search Exercise (Full Width) */}
                 <div style={{ position: 'relative' }}>
                     <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)', fontWeight: 700, letterSpacing: '0.5px' }}>SEARCH EXERCISE</label>
                     <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--db-text-secondary)', display: 'flex' }}>
                            <IconSearch size={18} />
                        </div>
                        <input 
                            className="db-input"
                            placeholder="e.g. Bench Press"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setSelectedExercise(null); }}
                            style={{ paddingLeft: '40px', width: '100%' }}
                        />
                        {searchQuery && (
                            <button 
                                onClick={handleClearSearch}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--db-text-secondary)', cursor: 'pointer', display: 'flex' }}
                            >
                                <IconClose size={16} />
                            </button>
                        )}
                     </div>

                     {/* Search Results Dropdown */}
                     {searchResults.length > 0 && !selectedExercise && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--db-card)',
                            border: '1px solid var(--db-border)',
                            borderRadius: '0 0 12px 12px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            zIndex: 100,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }}>
                            {searchResults.map(ex => (
                                <div 
                                    key={ex.id}
                                    onClick={() => handleSelectExercise(ex)}
                                    className="search-item-hover"
                                    style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--db-border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <span style={{ fontWeight: 600, color: 'var(--db-text-primary)' }}>{ex.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{ex.targetMuscleGroup}</span>
                                </div>
                            ))}
                            <div 
                                onClick={() => setShowCustomExerciseModal(true)}
                                style={{ padding: '1rem', textAlign: 'center', color: 'var(--db-accent)', cursor: 'pointer', fontWeight: 600, borderTop: '1px solid var(--db-border)' }}
                            >
                                + Create Custom Exercise
                            </div>
                        </div>
                    )}
                    {isSearching && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, padding: '0.5rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>Searching...</div>
                    )}
                 </div>

                 {/* Row 2: Numeric Inputs (3 Cols) */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                     <div>
                         <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)', fontWeight: 700, letterSpacing: '0.5px' }}>SETS</label>
                         <input 
                            className="db-input"
                            type="number"
                            value={setsCount}
                            onChange={(e) => setSetsCount(e.target.value)}
                            placeholder="3"
                            disabled={!selectedExercise}
                            style={{ width: '100%' }}
                        />
                     </div>
                     <div>
                         <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)', fontWeight: 700, letterSpacing: '0.5px' }}>REPS</label>
                         <input 
                            className="db-input"
                            type="number"
                            value={repsCount}
                            onChange={(e) => setRepsCount(e.target.value)}
                            placeholder="10"
                            disabled={!selectedExercise}
                            style={{ width: '100%' }}
                        />
                     </div>
                     <div>
                         <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)', fontWeight: 700, letterSpacing: '0.5px' }}>WEIGHT (KG)</label>
                         <input 
                            className="db-input"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="50"
                            disabled={!selectedExercise}
                            style={{ width: '100%' }}
                        />
                     </div>
                 </div>

                 {/* Row 3: Button */}
                 <div style={{ marginTop: '0.5rem' }}>
                     <button 
                         className="db-btn db-btn-primary" 
                         onClick={handleLogWorkout}
                         disabled={loading || !selectedExercise || !setsCount}
                         style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700 }}
                     >
                         <IconPlus size={20} style={{ marginRight: '0.5rem' }} />
                         {loading ? 'Logging...' : 'Log Set'}
                     </button>
                 </div>
             </div>
              {message.text && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', fontSize: '0.9rem', textAlign: 'center' }}>
                    {message.text}
                </div>
            )}

            {/* Custom Exercise Modal */}
            {showCustomExerciseModal && (
               <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                   <div className="db-card" style={{ width: '100%', maxWidth: '400px', background: 'var(--db-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--db-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>New Exercise</h3>
                            <button onClick={() => setShowCustomExerciseModal(false)} style={{ background: 'none', border: 'none', color: 'var(--db-text-secondary)', cursor: 'pointer' }}>
                                <IconClose size={24} />
                            </button>
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                           <div>
                               <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Exercise Name</label>
                               <input className="db-input" placeholder="e.g. My Custom Press" value={customExercise.name} onChange={e => setCustomExercise({...customExercise, name: e.target.value})} />
                           </div>
                           <div>
                               <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Target Muscle</label>
                               <select 
                                    className="db-input"
                                    value={customExercise.targetMuscleGroup}
                                    onChange={e => setCustomExercise({...customExercise, targetMuscleGroup: e.target.value})}
                               >
                                   {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                               </select>
                           </div>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                           <button className="db-btn" onClick={() => setShowCustomExerciseModal(false)}>Cancel</button>
                           <button className="db-btn db-btn-primary" onClick={handleAddCustomExercise}>Save Exercise</button>
                       </div>
                   </div>
               </div>
            )}
        </div>
    );
  };
export default WorkoutLogger;
