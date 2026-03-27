import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchExercise, logWorkout, addCustomExercise } from '../services/memberService';
import CustomCalendar from './CustomCalendar';
import '../styles/dashboard.css';
import '../styles/workout-view.css';

// --- Custom SVGs ---
const Icons = {
    Search: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    ),
    Plus: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Close: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Edit: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Trash: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Dumbbell: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5l11 11"></path>
            <path d="M21 21l-1 1"></path>
            <path d="M21 16l-5-5"></path>
            <path d="M16 21l-5-5"></path>
            <path d="M8 8l5-5"></path>
            <path d="M3 3l1 1"></path>
            <path d="M3 8l5-5"></path>
            <path d="M8 3l-5 5"></path>
        </svg>
    ),
    Save: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
    )
};

const MemberWorkoutView = ({ logs = [], onRefresh, selectedDate, onEdit, onDelete, onDateChange }) => {
    // Form State
    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [setsCount, setSetsCount] = useState('');
    const [repsCount, setRepsCount] = useState('');
    const [weight, setWeight] = useState('');

    // Session Draft State (Batch Logging)
    const [sessionLogs, setSessionLogs] = useState([]);

    // UI State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete);
            setItemToDelete(null);
            setDeleteModalOpen(false);
        }
    };
    
    // Custom Exercise
    const [customExName, setCustomExName] = useState('');
    const [customExMuscle, setCustomExMuscle] = useState('CHEST');
    const MUSCLE_GROUPS = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'ABS', 'CARDIO', 'OTHER'];

    useEffect(() => {
        if (selectedDate) setDate(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        if (onDateChange) onDateChange(newDate);
    };

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2 && !selectedExercise) {
                setIsSearching(true);
                try {
                    const results = await searchExercise(searchQuery);
                    setSearchResults(results || []);
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

    const handleSelectExercise = (ex) => {
        setSelectedExercise(ex);
        setSearchQuery(ex.name);
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedExercise(null);
        setSetsCount('');
        setRepsCount('');
        setWeight('');
    };

    // Add to Local Session Draft
    const handleAddToSession = () => {
        if (!selectedExercise || !setsCount) return;

        const newLog = {
            id: 'temp-' + Date.now(), // Temp ID for local tracking
            date,
            exerciseId: selectedExercise.id,
            exercise: selectedExercise, // Store full object for display
            sets: parseInt(setsCount),
            reps: parseInt(repsCount) || 0,
            weightKg: parseFloat(weight) || 0
        };

        setSessionLogs([...sessionLogs, newLog]);

        // Reset inputs for next exercise
        handleClearSearch(); 
    };
    


    const handleRemoveFromSession = (tempId) => {
        setSessionLogs(sessionLogs.filter(log => log.id !== tempId));
    };

    // Save Entire Batch to API
    const handleSaveSession = async () => {
        if (sessionLogs.length === 0) return;
        setLoading(true);
        try {
            // Transform sessionLogs to match API payload (clean up extra props)
            const payload = sessionLogs.map(log => ({
                date: log.date,
                exerciseId: log.exerciseId,
                sets: log.sets,
                reps: log.reps,
                weightKg: log.weightKg
            }));

            await logWorkout(payload);
            
            // Success!
            setSessionLogs([]); // Clear draft
            handleClearSearch(); // Clear form
            if (onRefresh) onRefresh(); // Refresh daily summary from backend
        } catch (err) {
            console.error("Batch log failed", err);
            alert("Failed to save workout session: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCustom = async () => {
        if (!customExName) return;
        try {
            const newEx = await addCustomExercise({ name: customExName, targetMuscleGroup: customExMuscle });
            handleSelectExercise(newEx);
            setShowCustomModal(false);
            setCustomExName('');
        } catch (err) {
            alert("Failed to create exercise: " + err.message);
        }
    };

    return (
        <div className="workout-container">
            {/* Header */}
            {/* Header */}
            <div className="workout-header" style={{ justifyContent: 'flex-end' }}>
                {/* Custom Calendar */}
                <CustomCalendar selectedDate={date} onChange={handleDateChange} />
            </div>

            <div className="workout-grid">
                {/* LOGGER CARD */}
                <div className="logger-card">
                    <div className="logger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 className="logger-title">Log Session</h2>
                            <p className="logger-desc">Build your workout session below.</p>
                        </div>
                        <div style={{ color: '#38bdf8', padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>
                            <Icons.Dumbbell size={24} />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="input-group">
                        <label className="form-label">Exercise</label>
                        <div style={{ position: 'relative' }}>
                            <div className="input-icon">
                                <Icons.Search size={18} />
                            </div>
                            <input 
                                className="custom-input" 
                                placeholder="Search exercise (e.g. Bench Press)"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setSelectedExercise(null); }}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={handleClearSearch}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
                                >
                                    <Icons.Close size={16} />
                                </button>
                            )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && !selectedExercise && (
                            <div className="suggestions-dropdown">
                                {searchResults.map(ex => (
                                    <div key={ex.id} className="suggestion-item" onClick={() => handleSelectExercise(ex)}>
                                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{ex.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{ex.targetMuscleGroup}</span>
                                    </div>
                                ))}
                                <div 
                                    onClick={() => setShowCustomModal(true)}
                                    className="suggestion-item" 
                                    style={{ justifyContent: 'center', color: '#38bdf8', fontWeight: 700 }}
                                >
                                    + Create Custom Exercise
                                </div>
                            </div>
                        )}
                        {isSearching && <div style={{ position: 'absolute', top: '100%', left: 0, padding: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Searching...</div>}
                    </div>

                    {/* Inputs */}
                    <div className="form-row">
                        <div>
                            <label className="form-label">Sets</label>
                            <input 
                                type="number" 
                                className="custom-input" 
                                placeholder="3"
                                style={{ paddingLeft: '1rem' }}
                                value={setsCount}
                                onChange={e => setSetsCount(e.target.value)}
                                disabled={!selectedExercise}
                            />
                        </div>
                        <div>
                            <label className="form-label">Reps</label>
                            <input 
                                type="number" 
                                className="custom-input" 
                                placeholder="10"
                                style={{ paddingLeft: '1rem' }}
                                value={repsCount}
                                onChange={e => setRepsCount(e.target.value)}
                                disabled={!selectedExercise}
                            />
                        </div>
                        <div>
                            <label className="form-label">Weight (kg)</label>
                            <input 
                                type="number" 
                                className="custom-input" 
                                placeholder="50"
                                style={{ paddingLeft: '1rem' }}
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                disabled={!selectedExercise}
                            />
                        </div>
                    </div>

                    <button 
                        className="log-btn" 
                        onClick={handleAddToSession} 
                        disabled={!selectedExercise || !setsCount}
                        style={{ marginTop: '1rem' }}
                    >
                        <Icons.Plus size={20} />
                        Add Exercise
                    </button>

                    {/* CURRENT SESSION DRAFT */}
                    {sessionLogs.length > 0 && (
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#38bdf8' }}>Current Session Draft ({sessionLogs.length})</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                                {sessionLogs.map((log) => (
                                    <motion.div 
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="log-item"
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>{log.exercise.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                <span style={{color: '#38bdf8', fontWeight: 600}}>{log.sets} sets</span> × {log.reps} reps • {log.weightKg}kg
                                            </div>
                                        </div>
                                        <div className="log-actions">
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleRemoveFromSession(log.id)}
                                                title="Remove"
                                            >
                                                <Icons.Trash size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button 
                                className="log-btn" 
                                onClick={handleSaveSession} 
                                disabled={loading}
                                style={{ 
                                    background: 'var(--primary)', 
                                    borderColor: 'var(--primary-border)',
                                    marginTop: '1.5rem'
                                }}
                            >
                                <Icons.Save size={20} />
                                {loading ? 'Saving Workout...' : 'Save Workout Session'}
                            </button>
                        </div>
                    )}
                </div>

                {/* SUMMARY CARD */}
                <div className="summary-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                             <h2 className="logger-title" style={{ fontSize: '1.25rem' }}>Daily Summary</h2>
                             <p className="logger-desc">{logs.length} items logged today</p>
                        </div>
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#38bdf8' }}>
                            <Icons.Dumbbell />
                        </div>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {logs.length > 0 ? (
                            logs.map((log, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    delay={i * 0.05}
                                    className="log-item"
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{log.exercise?.name || 'Unknown'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                {log.sets} sets × {log.reps} reps
                                            </div>
                                            {log.weightKg > 0 && (
                                                <div className="stats-tag">{log.weightKg} kg</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="log-actions">
                                        <button onClick={() => onEdit && onEdit(log)} title="Edit">
                                            <Icons.Edit />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(log.id)} title="Delete">
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b', fontStyle: 'italic' }}>
                                No logs submitted for this date.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Modal */}
            <AnimatePresence>
                {showCustomModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowCustomModal(false)}>
                        <motion.div 
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #334155' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Create Custom Exercise</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Exercise Name</label>
                                    <input className="custom-input" placeholder="e.g. My Lift" value={customExName} onChange={e => setCustomExName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">Muscle Group</label>
                                    <select className="custom-input" value={customExMuscle} onChange={e => setCustomExMuscle(e.target.value)}>
                                        {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowCustomModal(false)}>Cancel</button>
                                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={handleCreateCustom}>Create</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setDeleteModalOpen(false)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>Delete Entry?</h3>
                            <p style={{ margin: '0 0 1.5rem 0', color: '#94a3b8' }}>Are you sure you want to remove this set from your workout log? This action cannot be undone.</p>
                            
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button 
                                    onClick={() => setDeleteModalOpen(false)}
                                    style={{ background: '#334155', border: 'none', color: '#f8fafc', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberWorkoutView;
