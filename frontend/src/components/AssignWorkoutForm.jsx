import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workoutService } from '../services/workoutService';

// --- Custom SVG Icons ---
const Icons = {
  Add: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Delete: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  Save: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  ),
  Target: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  ChevronDown: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Dumbbell: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 15H4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h2"></path><path d="M18 15h2a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2"></path><line x1="12" y1="7" x2="12" y2="17"></line><line x1="15" y1="7" x2="17" y2="7"></line><line x1="15" y1="11" x2="17" y2="11"></line><line x1="15" y1="17" x2="17" y2="17"></line><line x1="7" y1="7" x2="9" y2="7"></line><line x1="7" y1="11" x2="9" y2="11"></line><line x1="7" y1="17" x2="9" y2="17"></line><rect x="9" y="5" width="6" height="14" rx="2"></rect>
    </svg>
  ),
  Calendar: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
};


const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const GOAL_TYPES = [
  "STRENGTH_TRAINING", "MUSCLE_GAIN", "FAT_LOSS", "ENDURANCE", "ATHLETIC_POWER", "MOBILITY_AND_REHAB"
];

// --- Custom Premium Select Component (Supports Multiple & Searchable/Creatable) ---
const CustomSelect = ({ value, onChange, options, placeholder = 'Select...', icon: Icon, multiple = false, searchable = false, creatable = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getOptionValue = (opt) => typeof opt === 'object' ? opt.value : opt;
    const getOptionDisplay = (opt) => typeof opt === 'object' ? opt.display : opt;

    const filteredOptions = options.filter(opt => 
        getOptionDisplay(opt).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (optValue) => {
        if (multiple) {
            const newValue = value.includes(optValue)
                ? value.filter(v => v !== optValue)
                : [...value, optValue];
            onChange(newValue);
        } else {
            onChange(optValue);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    const getDisplayValue = () => {
        if (searchQuery && isOpen && !multiple) return ''; // Hide display value when typing
        if (!value || (multiple && value.length === 0)) return placeholder;
        
        if (multiple) {
            return value.map(v => {
                const opt = options.find(o => getOptionValue(o) === v);
                const display = opt ? getOptionDisplay(opt) : v;
                return display.substring(0, 4);
            }).join(', ');
        }
        
        const selectedOpt = options.find(opt => getOptionValue(opt) === value);
        if (selectedOpt) return getOptionDisplay(selectedOpt);

        return value.replace(/_/g, ' ');
    };

    return (
        <div className="custom-select-container" ref={containerRef}>
            <div 
                className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => {
                    setIsOpen(true);
                    if (searchable) {
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }
                }}
                style={{ height: '42px', fontSize: '0.9rem', position: 'relative' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', width: '100%' }}>
                    {Icon && <Icon size={16} style={{ opacity: 0.7, flexShrink: 0 }} />}
                    
                    {searchable && isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getDisplayValue() === placeholder ? placeholder : `Searching: ${getDisplayValue()}`}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--db-text-primary)', 
                                outline: 'none',
                                width: '100%',
                                padding: 0,
                                fontSize: '0.9rem'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && creatable && searchQuery && filteredOptions.length === 0) {
                                    handleSelect(searchQuery);
                                }
                            }}
                        />
                    ) : (
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {getDisplayValue()}
                        </span>
                    )}
                </div>
                <Icons.ChevronDown 
                    size={14} 
                    style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                        transition: 'transform 0.3s ease', 
                        flexShrink: 0,
                        marginLeft: 'auto'
                    }} 
                />
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="custom-select-options"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ maxHeight: '350px', overflowY: 'auto' }}
                    >
                        {filteredOptions.length > 0 && filteredOptions.map((opt, idx) => {
                            const optValue = getOptionValue(opt);
                            const optDisplay = getOptionDisplay(opt);
                            const isSelected = multiple ? value.includes(optValue) : value === optValue;
                            return (
                                <div 
                                    key={idx} 
                                    className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(optValue)}
                                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                                >
                                    {multiple && (
                                        <div style={{ 
                                            width: '16px', 
                                            height: '16px', 
                                            border: '2px solid rgba(255,255,255,0.2)', 
                                            borderRadius: '4px',
                                            marginRight: '8px',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: isSelected ? 'var(--db-green)' : 'transparent',
                                            borderColor: isSelected ? 'var(--db-green)' : 'rgba(255,255,255,0.2)'
                                        }}>
                                            {isSelected && <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '1px' }} />}
                                        </div>
                                    )}
                                    <span style={{ flex: 1 }}>{optDisplay}</span>
                                </div>
                            );
                        })}

                        {creatable && searchQuery && !options.some(opt => getOptionDisplay(opt).toLowerCase() === searchQuery.toLowerCase()) && (
                            <div 
                                className="custom-select-option"
                                onClick={() => handleSelect(searchQuery)}
                                style={{ 
                                    padding: '0.8rem', 
                                    textAlign: 'center', 
                                    color: 'var(--db-green)', 
                                    fontWeight: 800, 
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(81, 207, 102, 0.05)'
                                }}
                            >
                                + Add Custom: "{searchQuery}"
                            </div>
                        )}

                        {filteredOptions.length === 0 && (!creatable || !searchQuery) && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--db-text-secondary)', fontSize: '0.85rem' }}>
                                No results found
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub-Component for Individual Exercise Card ---
const ExerciseCard = ({ exercise, index, onChange, onRemove, exerciseMap, onSaveToLibrary }) => {
    const muscleGroups = Object.keys(exerciseMap);
    const exerciseOptions = exercise.muscleGroup 
        ? (exerciseMap[exercise.muscleGroup] || []).map(ex => ({ value: ex.code, display: ex.displayName }))
        : [];

    const isNewExercise = exercise.exerciseName && exercise.muscleGroup && !exerciseOptions.some(opt => opt.value === exercise.exerciseName);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await onSaveToLibrary(exercise.muscleGroup, exercise.exerciseName);
        setIsSaving(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="meal-card-premium"
            style={{ padding: '1.25rem', marginTop: 0, border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}
        >
            <button 
                onClick={() => onRemove(index)} 
                className="db-btn-icon btn-delete" 
                style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    right: '12px', 
                    width: '30px', 
                    height: '30px', 
                    background: 'rgba(255, 107, 107, 0.1)',
                    zIndex: 2
                }}
            >
                <Icons.Delete size={14} />
            </button>

            <div className="db-form-grid exercise-header-row" style={{ alignItems: 'flex-end', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="db-form-group" style={{ marginBottom: '8px' }}>
                    <div style={{ background: 'rgba(81, 207, 102, 0.15)', color: 'var(--db-green)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, whiteSpace: 'nowrap', border: '1px solid rgba(81, 207, 102, 0.2)' }}>
                        EX #{index + 1}
                    </div>
                </div>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Muscle Group</label>
                    <CustomSelect 
                        searchable
                        value={exercise.muscleGroup}
                        onChange={(val) => {
                            onChange(index, 'muscleGroup', val);
                            onChange(index, 'exerciseName', ''); // Reset exercise when muscle group changes
                        }}
                        options={muscleGroups}
                        placeholder="Group"
                        icon={Icons.Target}
                    />
                </div>
                <div className="db-form-group" style={{ position: 'relative' }}>
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>
                        Exercise Name 
                        {isNewExercise && (
                            <span 
                                onClick={handleSave}
                                style={{ 
                                    marginLeft: '8px', 
                                    color: isSaving ? 'var(--db-text-secondary)' : 'var(--db-green)', 
                                    cursor: isSaving ? 'default' : 'pointer',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                }}
                            >
                                {isSaving ? 'Saving...' : '+ Add to Encyclopedia'}
                            </span>
                        )}
                    </label>
                    <CustomSelect 
                        searchable
                        creatable
                        value={exercise.exerciseName}
                        onChange={(val) => onChange(index, 'exerciseName', val)}
                        options={exerciseOptions}
                        placeholder={exercise.muscleGroup ? "Select or Type" : "Pick Group or Type"}
                        icon={Icons.Dumbbell}
                    />
                </div>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Training Days</label>
                    <CustomSelect 
                        multiple
                        searchable
                        value={exercise.days}
                        onChange={(val) => onChange(index, 'days', val)}
                        options={DAYS_OF_WEEK}
                        placeholder="Select Days"
                        icon={Icons.Calendar}
                    />
                </div>
            </div>

            <div className="db-form-grid exercise-details-row" style={{ gap: '0.85rem', marginBottom: 0 }}>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Sets</label>
                    <input 
                        type="number" 
                        className="db-input" 
                        style={{ height: '38px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem' }}
                        value={exercise.sets}
                        onChange={(e) => onChange(index, 'sets', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Reps</label>
                    <input 
                        type="number" 
                        className="db-input" 
                        style={{ height: '38px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem' }}
                        value={exercise.reps}
                        onChange={(e) => onChange(index, 'reps', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Rest (s)</label>
                    <input 
                        type="number" 
                        className="db-input" 
                        style={{ height: '38px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem' }}
                        value={exercise.restSeconds}
                        onChange={(e) => onChange(index, 'restSeconds', parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="db-form-group">
                    <label className="db-label" style={{ fontSize: '0.65rem' }}>Notes</label>
                    <input 
                        type="text" 
                        className="db-input" 
                        placeholder="e.g. Slow negative"
                        style={{ height: '38px', background: 'rgba(0,0,0,0.2)', fontSize: '0.85rem' }}
                        value={exercise.notes}
                        onChange={(e) => onChange(index, 'notes', e.target.value)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const AssignWorkoutForm = ({ memberId, onSuccess, onCancel }) => {
  const [planName, setPlanName] = useState('');
  const [trainingGoal, setTrainingGoal] = useState('MUSCLE_GAIN');
  const [exercises, setExercises] = useState([
    { muscleGroup: '', exerciseName: '', sets: 3, reps: 10, restSeconds: 60, notes: '', days: [] }
  ]);
  const [exerciseMap, setExerciseMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Strategy State
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [existingPlanName, setExistingPlanName] = useState(null);
  const [pendingSubmission, setPendingSubmission] = useState(null); // Holds data while user chooses strategy

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const data = await workoutService.getExerciseDictionary();
        setExerciseMap(data);
      } catch (err) {
        console.error("Failed to fetch exercise dictionary", err);
        setError("Could not load exercises. Using manual entry.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDictionary();
  }, []);

  const handleExerciseChange = (index, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };

  const addExercise = () => {
    setExercises([...exercises, { muscleGroup: '', exerciseName: '', sets: 3, reps: 10, restSeconds: 60, notes: '', days: [] }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!planName.trim()) { setError('Plan name is required'); return; }
    if (exercises.length === 0) { setError('At least one exercise is required'); return; }
    for (const ex of exercises) {
      if (!ex.exerciseName) { setError('All exercises must have a name selected'); return; }
      if (ex.days.length === 0) { setError(`Please select at least one day for ${ex.exerciseName.replace(/_/g, ' ')}`); return; }
    }

    // 1️⃣ Prepare Submission Data
    const submissionData = { memberId, planName, trainingGoal, exercises };

    // 2️⃣ Check for existing plan
    try {
        setIsLoading(true);
        const existingPlan = await workoutService.getMemberWorkoutPlan(memberId);
        
        if (existingPlan && existingPlan.exercises && existingPlan.exercises.length > 0) {
            // Plan Exists -> Prompt User
            setExistingPlanName(existingPlan.planName);
            setPendingSubmission(submissionData);
            setStrategyModalOpen(true);
        } else {
            // No Plan -> Proceed with Default (REPLACE/Create)
            onSuccess({ ...submissionData, strategy: 'REPLACE' });
        }
    } catch (err) {
        // If 404 or error, assume no plan exists and create new
        console.warn("Could not check existing plan, proceeding as new.", err);
        onSuccess({ ...submissionData, strategy: 'REPLACE' });
    } finally {
        setIsLoading(false);
    }
  };

  const finalizeSubmission = (strategy) => {
      if (pendingSubmission) {
          onSuccess({ ...pendingSubmission, strategy });
          setStrategyModalOpen(false);
          setPendingSubmission(null);
      }
  };

  const handleSaveToLibrary = async (group, name) => {
    try {
        const code = name.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
        await workoutService.createExercise({
            muscleGroup: group,
            displayName: name,
            code: code
        });
        // Refresh local dictionary
        const newDict = await workoutService.getExerciseDictionary();
        setExerciseMap(newDict);
        return true;
    } catch (err) {
        console.error("Failed to save exercise:", err);
        setError("Failed to save exercise to dictionary. It might already exist.");
        return false;
    }
  };

  return (
    <div style={{ padding: '0 0 1rem 0' }}>
      {error && (
          <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
              {error}
          </div>
      )}
      
      <div className="db-form-grid workout-plan-header" style={{ gap: '1.25rem', marginBottom: '1rem' }}>
        <div className="db-form-group">
            <label className="db-label" style={{ fontSize: '0.8rem', fontWeight: 800 }}>Workout Plan Name</label>
            <input
                type="text"
                className="db-input"
                style={{ 
                    height: '46px', 
                    fontSize: '0.95rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Advanced Push Pull Legs"
            />
        </div>
        <div className="db-form-group">
            <label className="db-label" style={{ fontSize: '0.8rem', fontWeight: 800 }}>Training Goal</label>
            <CustomSelect 
                value={trainingGoal}
                onChange={setTrainingGoal}
                options={GOAL_TYPES}
                placeholder="Select Goal"
            />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: 'var(--db-text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Exercises List</h3>
          <button 
              onClick={addExercise}
              className="db-btn db-btn-outline"
              style={{ borderStyle: 'dashed', color: 'var(--db-green)', padding: '0.4rem 0.9rem', fontSize: '0.8rem', height: '36px' }}
          >
              <Icons.Add size={14} /> <span style={{ marginLeft: '4px' }}>Add Exercise</span>
          </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
            {exercises.map((exercise, index) => (
                <ExerciseCard 
                    key={index}
                    index={index}
                    exercise={exercise}
                    exerciseMap={exerciseMap}
                    onChange={handleExerciseChange}
                    onRemove={removeExercise}
                    onSaveToLibrary={handleSaveToLibrary}
                />
            ))}
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', marginTop: '2.5rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button 
              onClick={onCancel} 
              className="db-btn" 
              style={{ background: 'transparent', color: 'var(--db-text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}
          >
              Discard Plan
          </button>
          <button 
              onClick={handleSubmit}
              className="db-btn"
              style={{ 
                  background: 'var(--db-green-solid, #2db44d)', 
                  color: '#fff', 
                  padding: '0.8rem 2.2rem', 
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
          >
              <Icons.Save size={20} /> Deploy Workout Plan
          </button>
      </div>

      
      {/* STRATEGY SELECTION MODAL */}
      <AnimatePresence>
        {strategyModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', maxWidth: '450px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#38bdf8' }}>
                            <Icons.Target size={30} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9', fontSize: '1.4rem' }}>Plan Already Exists</h3>
                        <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>
                            Member already has an active plan <strong>"{existingPlanName}"</strong>. <br/>
                            How would you like to apply these new exercises?
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button 
                            onClick={() => finalizeSubmission('REPLACE')}
                            style={{ 
                                padding: '1rem', 
                                background: 'transparent', 
                                border: '1px solid rgba(239, 68, 68, 0.3)', 
                                borderRadius: '12px', 
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: '#ef4444',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontWeight: 800, fontSize: '1rem' }}>REPLACE</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Start fresh, remove old</span>
                        </button>

                        <button 
                            onClick={() => finalizeSubmission('APPEND')}
                            style={{ 
                                padding: '1rem', 
                                background: 'var(--db-green)', 
                                border: 'none', 
                                borderRadius: '12px', 
                                cursor: 'pointer', 
                                color: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(81, 207, 102, 0.2)'
                            }}
                        >
                            <span style={{ fontWeight: 800, fontSize: '1rem' }}>APPEND</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Keep old, add new</span>
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => setStrategyModalOpen(false)}
                        style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        Cancel
                    </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignWorkoutForm;
