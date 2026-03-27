import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logDiet, searchFood, addCustomFood } from '../services/memberService';
import CustomCalendar from './CustomCalendar';
import '../styles/workout-view.css'; // Reusing the workout styles for consistency

// Icons
const Icons = {
    Search: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    ),
    Close: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Plus: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Trash: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Edit: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Restaurant: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
    )
};

const MemberDietView = ({ logs, dietTotals, onRefresh, selectedDate, onDateChange, onEdit, onDelete }) => {
    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    
    // Session Draft State (Batch Logging)
    const [sessionLogs, setSessionLogs] = useState([]);

    // Logger State
    const [mealName, setMealName] = useState('BREAKFAST');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState('');
    
    // UI State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Custom Food State
    const [customFood, setCustomFood] = useState({
        name: '', caloriesPer100g: '', proteinPer100g: '', carbsPer100g: '', fatPer100g: '', servingUnit: 'g'
    });

    const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

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
            if (searchQuery.length >= 2 && !selectedFood) {
                setIsSearching(true);
                try {
                    const results = await searchFood(searchQuery);
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
    }, [searchQuery, selectedFood]);

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearchQuery(food.name);
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedFood(null);
        setQuantity('');
    };

    const handleAddToSession = () => {
        if (!selectedFood || !quantity) return;

        const newLog = {
            id: 'temp-' + Date.now(),
            date,
            mealName,
            foodItemId: selectedFood.id,
            quantity: parseFloat(quantity),
            // Display props
            name: selectedFood.name,
            calories: ((selectedFood.caloriesPer100g * parseFloat(quantity)) / 100).toFixed(1)
        };

        setSessionLogs([...sessionLogs, newLog]);
        handleClearSearch();
    };

    const handleRemoveFromSession = (tempId) => {
        setSessionLogs(sessionLogs.filter(log => log.id !== tempId));
    };

    const handleSaveSession = async () => {
        if (sessionLogs.length === 0) return;
        setLoading(true);
        try {
            // Transform sessionLogs to match API payload
            const payload = sessionLogs.map(log => ({
                date: log.date,
                mealName: log.mealName,
                foodItemId: log.foodItemId,
                quantity: log.quantity
            }));

            await logDiet(payload);
            
            // Success!
            setSessionLogs([]); // Clear draft
            handleClearSearch(); // Clear form
            if (onRefresh) onRefresh(); // Refresh daily summary from backend
        } catch (error) {
            alert(error.toString());
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomFood = async () => {
        if (!customFood.name || !customFood.caloriesPer100g) return;
        try {
            const newFood = await addCustomFood(customFood);
            handleSelectFood(newFood);
            setShowCustomFoodModal(false);
            setCustomFood({ name: '', caloriesPer100g: '', proteinPer100g: '', carbsPer100g: '', fatPer100g: '', servingUnit: 'g' });
        } catch (error) {
            alert("Failed to add custom food: " + error);
        }
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            if (onDelete) onDelete(itemToDelete);
            setItemToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    // Helper to calculate macro for current selection preview
    const getPreviewMacro = (key) => {
        if (!selectedFood || !quantity) return '0';
        return ((selectedFood[key] * parseFloat(quantity)) / 100).toFixed(1);
    };

    return (
        <div className="workout-container diet-theme-container">
            {/* Header */}
            <div className="workout-header" style={{ justifyContent: 'flex-end' }}>
                {/* Custom Calendar */}
                <CustomCalendar selectedDate={date} onChange={handleDateChange} />
            </div>

            {/* Macros Summary Grid */}
            <div className="diet-stats-grid">
                {[
                    { label: 'Calories', val: dietTotals?.calories, unit: 'kcal', color: '#38bdf8' },
                    { label: 'Protein', val: dietTotals?.protein, unit: 'g', color: '#007BFF' }, // Using accent color manually
                    { label: 'Carbs', val: dietTotals?.carbs, unit: 'g', color: '#22c55e' },
                    { label: 'Fat', val: dietTotals?.fat, unit: 'g', color: '#a855f7' }
                ].map((macro) => (
                    <div key={macro.label} className="logger-card" style={{ padding: '1.25rem', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>{macro.label.toUpperCase()}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: macro.color }}>
                            {Math.round(macro.val || 0)} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{macro.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="diet-main-grid">
                {/* LOGGER CARD */}
                <div className="logger-card">
                    <div className="logger-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 className="logger-title">Add Food</h2>
                            <p className="logger-desc">Build your meal plan by adding foods below.</p>
                        </div>
                        <div style={{ color: '#3b82f6', padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                            <Icons.Restaurant size={22} />
                        </div>
                    </div>

                    {/* Food Search */}
                    <div className="input-group">
                        <label className="form-label">Food Search</label>
                        <div style={{ position: 'relative' }}>
                            <div className="input-icon">
                                <Icons.Search size={18} />
                            </div>
                            <input 
                                className="custom-input" 
                                placeholder="e.g. Chicken Breast"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setSelectedFood(null); }}
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
                        {searchResults.length > 0 && !selectedFood && (
                            <div className="suggestions-dropdown">
                                {searchResults.map(food => (
                                    <div key={food.id} className="suggestion-item" onClick={() => handleSelectFood(food)}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{food.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{food.caloriesPer100g} kcal / 100{food.servingUnit || 'g'}</span>
                                        </div>
                                    </div>
                                ))}
                                <div 
                                    onClick={() => setShowCustomFoodModal(true)}
                                    className="suggestion-item" 
                                    style={{ justifyContent: 'center', color: '#38bdf8', fontWeight: 700 }}
                                >
                                    + Add Custom Food
                                </div>
                            </div>
                        )}
                        {isSearching && <div style={{ position: 'absolute', top: '100%', left: 0, padding: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Searching...</div>}
                    </div>

                    {/* Meal Details */}
                    <div className="form-row grid-cols-2">
                         <div>
                            <label className="form-label">Meal Type</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                {MEAL_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setMealName(type)}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem 0.5rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: mealName === type ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                            color: mealName === type ? 'white' : '#94a3b8',
                                            minWidth: '70px'
                                        }}
                                    >
                                        {type.charAt(0) + type.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Quantity (g/ml)</label>
                            <input 
                                type="number" 
                                className="custom-input" 
                                placeholder="200"
                                style={{ paddingLeft: '1rem' }}
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Live Preview of Macros if food selected */}
                    {selectedFood && quantity && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginTop: '0.5rem' }}>
                            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>KCAL</div><div style={{ fontWeight: 700, color: '#38bdf8' }}>{getPreviewMacro('calories')}</div></div>
                            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PRO</div><div style={{ fontWeight: 700, color: '#007BFF' }}>{getPreviewMacro('proteinPer100g')}</div></div>
                            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CARB</div><div style={{ fontWeight: 700, color: '#22c55e' }}>{getPreviewMacro('carbsPer100g')}</div></div>
                            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FAT</div><div style={{ fontWeight: 700, color: '#a855f7' }}>{getPreviewMacro('fatPer100g')}</div></div>
                        </div>
                    )}

                    <button 
                        className="log-btn" 
                        onClick={handleAddToSession} 
                        disabled={!selectedFood || !quantity}
                        style={{ marginTop: '1rem' }}
                    >
                        <Icons.Plus size={20} />
                        Add Food
                    </button>

                    {/* CURRENT SESSION DRAFT */}
                    {sessionLogs.length > 0 && (
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#38bdf8' }}>Current Meal Draft ({sessionLogs.length})</h3>
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
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{log.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                <span style={{color: '#38bdf8', fontWeight: 600}}>{log.mealName}</span> • {log.quantity}g • {log.calories} kcal
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveFromSession(log.id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Icons.Trash size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <button 
                                className="log-btn" 
                                onClick={handleSaveSession} 
                                disabled={loading}
                                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                            >
                                <Icons.Plus size={20} style={{ transform: 'rotate(0deg)' }} /> {/* Reusing Plus Icon for save visual, or remove icon */}
                                {loading ? 'Saving...' : 'Save Diet Log'}
                            </button>
                        </div>
                    )}
                </div>

                 {/* SUMMARY CARD */}
                <div className="summary-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                             <h2 className="logger-title" style={{ fontSize: '1.25rem' }}>Daily Log</h2>
                             <p className="logger-desc">{logs.length} items logged today</p>
                        </div>
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#38bdf8' }}>
                            <Icons.Restaurant />
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
                                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem', marginBottom: '2px' }}>
                                            {log.name || log.foodName || log.foodItem?.name || 'Unknown'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600, color: '#38bdf8' }}>{log.mealName?.charAt(0) + log.mealName?.slice(1).toLowerCase()}</span>
                                            <span>•</span>
                                            <span>{log.quantity}g</span>
                                            <span>•</span>
                                            <span>{Math.round(log.calories || log.totalCalories)} kcal</span>
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
                                No meals logged for this date.
                            </div>
                        )}
                    </div>
                </div>
            </div>

             {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setDeleteModalOpen(false)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>Delete Meal?</h3>
                            <p style={{ margin: '0 0 1.5rem 0', color: '#94a3b8' }}>Are you sure you want to remove this meal from your diet log?</p>
                            
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

            {/* Custom Food Modal */}
            <AnimatePresence>
                {showCustomFoodModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowCustomFoodModal(false)}>
                        <motion.div 
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #334155' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Add Custom Food</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Food Name</label>
                                    <input className="custom-input" placeholder="e.g. Smoothie" value={customFood.name} onChange={e => setCustomFood({...customFood, name: e.target.value})} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                     <div>
                                        <label className="form-label">Calories / 100g</label>
                                        <input className="custom-input" type="number" value={customFood.caloriesPer100g} onChange={e => setCustomFood({...customFood, caloriesPer100g: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="form-label">Protein / 100g</label>
                                        <input className="custom-input" type="number" value={customFood.proteinPer100g} onChange={e => setCustomFood({...customFood, proteinPer100g: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="form-label">Carbs / 100g</label>
                                        <input className="custom-input" type="number" value={customFood.carbsPer100g} onChange={e => setCustomFood({...customFood, carbsPer100g: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="form-label">Fat / 100g</label>
                                        <input className="custom-input" type="number" value={customFood.fatPer100g} onChange={e => setCustomFood({...customFood, fatPer100g: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowCustomFoodModal(false)}>Cancel</button>
                                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }} onClick={handleAddCustomFood}>Save Food</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberDietView;
