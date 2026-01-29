import React, { useState, useEffect } from 'react';
import { logDiet, searchFood, addCustomFood } from '../services/memberService';
import '../styles/dashboard.css';

// Custom SVGs for MUI replacement
const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconRestaurant = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>
);

const DietLogger = ({ onLogSuccess, selectedDate }) => {
    // Parent handles the date
    const date = selectedDate || new Date().toISOString().split('T')[0];

    const [mealName, setMealName] = useState('BREAKFAST');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState('');

    // UI State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Custom Food State
    const [customFood, setCustomFood] = useState({
        name: '',
        caloriesPer100g: '',
        proteinPer100g: '',
        carbsPer100g: '',
        fatPer100g: '',
        servingUnit: 'g'
    });

    const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2 && !selectedFood) {
                setIsSearching(true);
                try {
                    const results = await searchFood(searchQuery);
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

    const handleLogMeal = async () => {
        if (!selectedFood || !quantity) {
             setMessage({ type: 'error', text: 'Please select a food and enter quantity.' });
             return;
        }

        setLoading(true);
        try {
            await logDiet({
                date,
                mealName,
                foodItemId: selectedFood.id,
                quantity: parseFloat(quantity)
            });
            setMessage({ type: 'success', text: 'Meal logged successfully!' });
            handleClearSearch();
            if (onLogSuccess) onLogSuccess();
        } catch (error) {
             setMessage({ type: 'error', text: error.toString() });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleAddCustomFood = async () => {
        if (!customFood.name || !customFood.caloriesPer100g) {
            alert("Food Name and Calories are required.");
            return;
        }
        try {
            const newFood = await addCustomFood(customFood);
            handleSelectFood(newFood);
            setShowCustomFoodModal(false);
            setCustomFood({
                name: '',
                caloriesPer100g: '',
                proteinPer100g: '',
                carbsPer100g: '',
                fatPer100g: '',
                servingUnit: 'g'
            });
            setMessage({ type: 'success', text: 'Custom food added!' });
        } catch (error) {
             alert("Failed to add custom food: " + error);
        }
    };

    return (
        <div className="diet-logger-container" style={{ padding: '0 0.5rem' }}>
             <div style={{ marginBottom: '1.5rem' }}>
                 <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--db-text-primary)', fontWeight: 800 }}>Log Your Meal</h3>
                 <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.9rem' }}>Select a meal and search for food to log.</p>
             </div>
             
             {/* Logger Form - Compact Layout */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 
                 {/* Row 1: Food Search (Full Width) */}
                 <div style={{ position: 'relative' }}>
                     <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--db-text-secondary)', letterSpacing: '0.5px' }}>FOOD SEARCH</label>
                     <div style={{ position: 'relative' }}>
                         <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--db-text-secondary)', display: 'flex', alignItems: 'center' }}>
                             <IconSearch />
                         </div>
                         <input 
                            className="db-input"
                            placeholder="e.g. Chicken Breast"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setSelectedFood(null); }}
                            style={{ paddingLeft: '40px', width: '100%' }}
                        />
                        {searchQuery && (
                            <button 
                                onClick={handleClearSearch}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--db-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <IconClose />
                            </button>
                        )}
                     </div>

                     {/* Results Dropdown */}
                     {(searchResults.length > 0 || (searchQuery.length >= 2 && !isSearching && !selectedFood)) && (
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
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            marginTop: '0'
                        }}>
                            {searchResults.map(food => (
                                <div 
                                    key={food.id}
                                    onClick={() => handleSelectFood(food)}
                                    style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--db-border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    className="search-item-hover"
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--db-text-primary)' }}>{food.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{food.caloriesPer100g} kcal / 100{food.servingUnit || 'g'}</div>
                                    </div>
                                    <div style={{ opacity: 0.5 }}>
                                        <IconRestaurant />
                                    </div>
                                </div>
                            ))}
                            <div 
                                onClick={() => { setShowCustomFoodModal(true); setSearchResults([]); }}
                                style={{ padding: '1rem', textAlign: 'center', color: 'var(--db-accent)', cursor: 'pointer', fontWeight: 600, borderTop: '1px solid var(--db-border)' }}
                            >
                                + ADD NEW CUSTOM FOOD
                            </div>
                        </div>
                     )}
                     {isSearching && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, padding: '0.5rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>Searching...</div>
                     )}
                 </div>

                 {/* Row 2: Meal Type & Quantity (2 Cols) */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div>
                         <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--db-text-secondary)', letterSpacing: '0.5px' }}>MEAL TYPE</label>
                         <select 
                            className="db-input" 
                            value={mealName} 
                            onChange={(e) => setMealName(e.target.value)}
                            style={{ width: '100%', appearance: 'auto' }}
                         >
                             {MEAL_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0) + type.slice(1).toLowerCase()}
                                </option>
                             ))}
                         </select>
                     </div>
                     <div>
                         <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--db-text-secondary)', letterSpacing: '0.5px' }}>QUANTITY (G/ML)</label>
                         <input 
                            className="db-input"
                            type="number"
                            placeholder="200"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                 </div>

                 {/* Row 3: Nutrients Preview */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
                     {['Calories', 'Protein', 'Carbs', 'Fat'].map((nut, idx) => {
                         const val = selectedFood ? (selectedFood[`${nut.toLowerCase()}${nut === 'Calories' ? '' : 'Per100g'}`] * (parseFloat(quantity) || 0) / 100).toFixed(1) : '0';
                         const colors = ['var(--db-blue)', 'var(--db-accent)', 'var(--db-green)', 'var(--db-purple)'];
                         return (
                            <div key={nut} style={{ textAlign: 'center', padding: '0.6rem 0.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--db-border)' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>{nut}</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: colors[idx] }}>{val}</div>
                            </div>
                         );
                     })}
                 </div>

                 {/* Row 4: Button */}
                 <div style={{ marginTop: '0.5rem' }}>
                    <button 
                        className="db-btn db-btn-primary" 
                        onClick={handleLogMeal}
                        disabled={loading || !selectedFood || !quantity}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.5px' }}
                    >
                        {loading ? 'Logging...' : 'Log Meal'}
                    </button>
                 </div>
             </div>

             {/* Custom Food Modal */}
             {showCustomFoodModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                    <div style={{ width: '95%', maxWidth: '480px', background: 'var(--db-card)', padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--db-border)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Add New Custom Food</h3>
                            <button onClick={() => setShowCustomFoodModal(false)} style={{ background: 'none', border: 'none', color: 'var(--db-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}><IconClose /></button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Food Name</label>
                                <input className="db-input" placeholder="e.g. My Special Smoothie" value={customFood.name} onChange={e => setCustomFood({...customFood, name: e.target.value})} style={{ height: '48px', borderRadius: '12px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Calories / 100g</label>
                                    <input className="db-input" type="number" value={customFood.caloriesPer100g} onChange={e => setCustomFood({...customFood, caloriesPer100g: e.target.value})} style={{ height: '48px', borderRadius: '12px' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Protein / 100g</label>
                                    <input className="db-input" type="number" value={customFood.proteinPer100g} onChange={e => setCustomFood({...customFood, proteinPer100g: e.target.value})} style={{ height: '48px', borderRadius: '12px' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Carbs / 100g</label>
                                    <input className="db-input" type="number" value={customFood.carbsPer100g} onChange={e => setCustomFood({...customFood, carbsPer100g: e.target.value})} style={{ height: '48px', borderRadius: '12px' }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Fat / 100g</label>
                                    <input className="db-input" type="number" value={customFood.fatPer100g} onChange={e => setCustomFood({...customFood, fatPer100g: e.target.value})} style={{ height: '48px', borderRadius: '12px' }} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>Unit (g/ml)</label>
                                <select className="db-input" value={customFood.servingUnit} onChange={e => setCustomFood({...customFood, servingUnit: e.target.value})} style={{ appearance: 'auto', height: '48px', borderRadius: '12px' }}>
                                    <option value="g">Grams (g)</option>
                                    <option value="ml">Milliliters (ml)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem' }}>
                            <button className="db-btn" style={{ flex: 1, justifyContent: 'center', height: '50px', borderRadius: '14px', fontWeight: 700 }} onClick={() => setShowCustomFoodModal(false)}>Cancel</button>
                            <button className="db-btn db-btn-primary" style={{ flex: 2, justifyContent: 'center', height: '50px', borderRadius: '14px', fontWeight: 700, boxShadow: '0 10px 20px rgba(255, 107, 107, 0.2)' }} onClick={handleAddCustomFood}>Save & Add</button>
                        </div>
                    </div>
                </div>
            )}

             {message.text && (
                 <div style={{
                    marginTop: '2rem',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                    color: message.type === 'error' ? '#ff5252' : '#51cf66',
                    textAlign: 'center',
                    fontWeight: 700,
                    border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
                    fontSize: '0.95rem'
                 }}>
                    {message.text}
                 </div>
             )}
        </div>
    );
};

export default DietLogger;
