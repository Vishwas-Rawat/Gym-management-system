import React, { useState, useEffect, useRef } from 'react';
import { searchFood } from '../services/memberService';
import { getMemberDietPlan } from '../services/dietService';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

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
  Search: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Close: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Restaurant: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V3.5a.5.5 0 0 1 .5-.5A1.5 1.5 0 0 1 4 4.5V8a1 1 0 0 0 2 0V4.5A1.5 1.5 0 0 1 7.5 3a.5.5 0 0 1 .5.5V8a1 1 0 0 0 2 0V4.5A1.5 1.5 0 0 1 11.5 3a.5.5 0 0 1 .5.5V8a3 3 0 0 1-3 3"></path><path d="M15 11v10"></path><line x1="15" y1="3" x2="15" y2="5"></line><path d="M3 11v10"></path>
    </svg>
  ),
  Bolt: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  ),
  ChevronDown: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Target: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
    </svg>
  )
};

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER', 'PRE_WORKOUT', 'POST_WORKOUT'];
const DIET_TYPES = ['VEG', 'NON_VEG', 'VEGAN', 'KETO'];

const emptyMeal = {
  mealName: '',
  foods: [],
  protein: { proteinName: '', proteinQuantity: '' }
};

// --- Custom Premium Select Component ---
const CustomSelect = ({ value, onChange, options, placeholder = 'Select...', icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt === value);
    const displayValue = selectedOption?.label || selectedOption || placeholder;

    return (
        <div className="custom-select-container" ref={containerRef}>
            <div 
                className={`custom-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {Icon && <Icon size={18} style={{ opacity: 0.7 }} />}
                    <span>{displayValue}</span>
                </div>
                <Icons.ChevronDown 
                    size={16} 
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} 
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
                    >
                        {options.map((opt, idx) => {
                            const val = opt.value || opt;
                            const label = opt.label || opt;
                            const isSelected = val === value;
                            
                            return (
                                <div 
                                    key={idx} 
                                    className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(val);
                                        setIsOpen(false);
                                    }}
                                >
                                    {label}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub-Component for Individual Meal Card ---
const MealPlanCard = ({ meal, index, onChange, onRemove, onFoodAdd, onFoodRemove }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSearchFood, setSelectedSearchFood] = useState(null);
    const [addQuantity, setAddQuantity] = useState('');
    const [addProteinName, setAddProteinName] = useState('');
    const [addProteinQty, setAddProteinQty] = useState('');
    
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2 && !selectedSearchFood) {
                setIsSearching(true);
                try {
                    const results = await searchFood(searchQuery);
                    setSearchResults(results);
                } catch (err) {
                    console.error("Search failed", err);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedSearchFood]);

    const handleSelectSearchFood = (food) => {
        setSelectedSearchFood(food);
        setSearchQuery(food.name);
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedSearchFood(null);
        setAddQuantity('');
        setAddProteinName('');
        setAddProteinQty('');
        setSearchResults([]);
    };

    const handleAddSelectedFood = () => {
        if (selectedSearchFood && addQuantity) {
            let notes = `${selectedSearchFood.caloriesPer100g} kcal/100g`;
            if (addProteinName) {
                notes += ` | Protein Source: ${addProteinName} (${addProteinQty || '1'})`;
            }

            onFoodAdd(index, {
                foodName: selectedSearchFood.name,
                quantity: addQuantity,
                notes: notes
            });
            handleClearSearch();
        }
    };

    const previewMacros = selectedSearchFood && addQuantity ? {
        cal: (selectedSearchFood.caloriesPer100g * (parseFloat(addQuantity) || 0) / 100).toFixed(0),
        pro: (selectedSearchFood.proteinPer100g * (parseFloat(addQuantity) || 0) / 100).toFixed(1),
        carb: (selectedSearchFood.carbsPer100g * (parseFloat(addQuantity) || 0) / 100).toFixed(1),
        fat: (selectedSearchFood.fatPer100g * (parseFloat(addQuantity) || 0) / 100).toFixed(1),
    } : null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="meal-card-premium"
        >
            <div className="meal-card-header" style={{ paddingRight: '40px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, maxWidth: '300px' }}>
                        <CustomSelect 
                            value={meal.mealName}
                            onChange={(val) => onChange(index, 'mealName', val)}
                            options={MEAL_TYPES}
                            placeholder="Select Meal Type"
                            icon={Icons.Restaurant}
                        />
                    </div>
                </div>
                <button 
                    onClick={() => onRemove(index)} 
                    className="db-btn-icon btn-delete" 
                    style={{ 
                        position: 'absolute', 
                        top: '1.25rem', 
                        right: '1.25rem', 
                        width: '32px', 
                        height: '32px', 
                        background: 'rgba(255, 107, 107, 0.1)',
                        zIndex: 2
                    }}
                >
                    <Icons.Delete size={16} />
                </button>
            </div>

            <div className="diet-search-container">
                <div className="db-form-section-title" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>Add Food Item</div>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: '1rem', color: 'var(--db-text-secondary)' }}><Icons.Search size={18} /></div>
                        <input 
                            type="text" 
                            className="db-input"
                            style={{ paddingLeft: '2.75rem' }}
                            placeholder="Search food (e.g. Oats, Chicken)"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setSelectedSearchFood(null); }}
                        />
                        {searchQuery && (
                            <button 
                                onClick={handleClearSearch}
                                style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', color: 'var(--db-text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <Icons.Close size={16} />
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {(searchResults.length > 0 || (searchQuery.length >= 2 && !isSearching && !selectedSearchFood)) && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="food-search-results"
                            >
                                {searchResults.length === 0 ? (
                                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--db-text-secondary)', fontSize: '0.85rem' }}>No results found</div>
                                ) : (
                                    searchResults.map(food => (
                                        <div key={food.id} className="food-search-item" onClick={() => handleSelectSearchFood(food)}>
                                            <div style={{ fontWeight: 700 }}>{food.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{food.caloriesPer100g} kcal / 100{food.servingUnit||'g'}</div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="db-form-grid meal-header-row" style={{ gap: '1rem', marginBottom: 0 }}>
                    <div className="db-form-group">
                        <label className="db-label" style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.8 }}>Quantity</label>
                        <input 
                            type="number" 
                            className="db-input" 
                            placeholder="g/ml" 
                            style={{ height: '42px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                            value={addQuantity}
                            onChange={(e) => setAddQuantity(e.target.value)}
                        />
                    </div>
                    <div className="db-form-group">
                        <label className="db-label" style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.8 }}>Protein Source (Optional)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                className="db-input" 
                                placeholder="Source" 
                                style={{ height: '42px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                                value={addProteinName}
                                onChange={(e) => setAddProteinName(e.target.value)}
                            />
                            <input 
                                type="text" 
                                className="db-input" 
                                style={{ height: '42px', maxWidth: '70px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                                placeholder="Qty" 
                                value={addProteinQty}
                                onChange={(e) => setAddProteinQty(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button 
                            className="db-btn db-btn-primary" 
                            style={{ 
                                height: '42px', 
                                width: '100%', 
                                background: 'linear-gradient(135deg, #51cf66, #2db44d)', 
                                border: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(81, 207, 102, 0.3)',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}
                            disabled={!selectedSearchFood || !addQuantity}
                            onClick={handleAddSelectedFood}
                        >
                            <Icons.Add size={16} /> <span style={{ marginLeft: '4px' }}>Add</span>
                        </button>
                    </div>
                </div>

                {previewMacros && (
                    <div className="macro-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                        <div className="macro-badge" style={{ background: 'linear-gradient(135deg, rgba(77, 171, 247, 0.1), rgba(77, 171, 247, 0.05))', borderRadius: '18px' }}>
                            <span className="macro-label" style={{ color: '#4dabf7', fontWeight: 800 }}>Cal</span>
                            <span className="macro-value cal" style={{ fontSize: '1.2rem' }}>{previewMacros.cal}</span>
                        </div>
                        <div className="macro-badge" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))', borderRadius: '18px' }}>
                            <span className="macro-label" style={{ color: '#ff6b6b', fontWeight: 800 }}>Pro</span>
                            <span className="macro-value pro" style={{ fontSize: '1.2rem' }}>{previewMacros.pro}</span>
                        </div>
                        <div className="macro-badge" style={{ background: 'linear-gradient(135deg, rgba(81, 207, 102, 0.1), rgba(81, 207, 102, 0.05))', borderRadius: '18px' }}>
                            <span className="macro-label" style={{ color: '#51cf66', fontWeight: 800 }}>Carb</span>
                            <span className="macro-value carb" style={{ fontSize: '1.2rem' }}>{previewMacros.carb}</span>
                        </div>
                        <div className="macro-badge" style={{ background: 'linear-gradient(135deg, rgba(204, 93, 232, 0.1), rgba(204, 93, 232, 0.05))', borderRadius: '18px' }}>
                            <span className="macro-label" style={{ color: '#cc5de8', fontWeight: 800 }}>Fat</span>
                            <span className="macro-value fat" style={{ fontSize: '1.2rem' }}>{previewMacros.fat}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="db-form-section-title" style={{ fontSize: '0.8rem', color: 'var(--db-text-primary)' }}>
                Added Foods ({meal.foods.length})
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {meal.foods.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--db-text-secondary)', fontSize: '0.9rem', opacity: 0.6 }}>No foods added to this meal.</div>
                ) : (
                    meal.foods.map((food, fIdx) => {
                        const hasProtein = food.notes && food.notes.includes('Protein Source:');
                        const proteinText = hasProtein ? food.notes.split('Protein Source:')[1].trim() : null;
                        
                        return (
                            <div key={fIdx} className="food-item-premium">
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--db-green)', textTransform: 'uppercase', marginBottom: '2px' }}>{meal.mealName} Item</div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{food.foodName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>Quantity: {food.quantity}</div>
                                    {hasProtein && (
                                        <div className="protein-source-indicator">
                                            <Icons.Bolt size={14} /> Protein: {proteinText}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => onFoodRemove(index, fIdx)} className="db-btn-icon btn-delete" style={{ width: '32px', height: '32px' }}>
                                    <Icons.Delete size={14} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
};

const AssignDietForm = ({ memberId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    memberId: memberId,
    planName: '',
    dietType: 'NON_VEG',
    meals: [{ ...emptyMeal }]
  });
  const [error, setError] = useState('');
  
  // Strategy State
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [existingPlanName, setExistingPlanName] = useState(null);
  const [pendingSubmission, setPendingSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (memberId) {
        setFormData(prev => ({ ...prev, memberId: Number(memberId) }));
    }
  }, [memberId]);

  const handlePlanChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { ...emptyMeal }]
    }));
  };

  const removeMeal = (index) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const handleMealChange = (index, field, value) => {
    setFormData(prev => ({
        ...prev,
        meals: prev.meals.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };

  const addFood = (mealIndex, foodData) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, index) => 
        index === mealIndex 
          ? { ...meal, foods: [...meal.foods, foodData] }
          : meal
      )
    }));
  };

  const removeFood = (mealIndex, foodIndex) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, index) => 
        index === mealIndex 
          ? { ...meal, foods: meal.foods.filter((_, i) => i !== foodIndex) }
          : meal
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.planName) {
      setError('Plan name is required');
      return;
    }
    for (let meal of formData.meals) {
        if (!meal.mealName) {
            setError('All meals must have a name (type)');
            return;
        }
    }
    setError('');
    
    const cleanedMeals = formData.meals.map(meal => {
        const cleanMeal = { ...meal };
        const proteinData = cleanMeal.protein || {};
        if (!proteinData.proteinName && !proteinData.proteinQuantity) cleanMeal.protein = null;
        return cleanMeal;
    });

    const submissionData = { ...formData, meals: cleanedMeals };

    // Check for existing plan
    try {
        setIsLoading(true);
        const existingPlan = await getMemberDietPlan(memberId);
        
        if (existingPlan && existingPlan.meals && existingPlan.meals.length > 0) {
            // Plan exists -> Prompt
            setExistingPlanName(existingPlan.planName || 'Current Plan');
            setPendingSubmission(submissionData);
            setStrategyModalOpen(true);
        } else {
             // No plan -> Default
             onSubmit({ ...submissionData, strategy: 'REPLACE' });
        }
    } catch (err) {
        // Assume no plan
        console.warn("Could not check diet plan, proceeding.", err);
        onSubmit({ ...submissionData, strategy: 'REPLACE' });
    } finally {
        setIsLoading(false);
    }
  };

  const finalizeSubmission = (strategy) => {
      if (pendingSubmission) {
          onSubmit({ ...pendingSubmission, strategy });
          setStrategyModalOpen(false);
          setPendingSubmission(null);
      }
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {error && (
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              {error}
          </div>
      )}

      <div className="db-form-grid diet-plan-header" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="db-form-group">
            <label className="db-label" style={{ marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>Plan Name</label>
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
                value={formData.planName}
                onChange={(e) => handlePlanChange('planName', e.target.value)}
                placeholder="e.g. Muscle Gain Phase 1"
            />
        </div>
        <div className="db-form-group">
            <label className="db-label" style={{ marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700, opacity: 0.8 }}>Diet Type</label>
            <CustomSelect 
                value={formData.dietType}
                onChange={(val) => handlePlanChange('dietType', val)}
                options={DIET_TYPES}
                placeholder="Select Diet"
            />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: 'var(--db-text-primary)' }}>Daily Meal Plan</h3>
          <button 
              onClick={addMeal}
              className="db-btn db-btn-outline"
              style={{ borderStyle: 'dashed', color: 'var(--db-green)', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
              <Icons.Add size={16} /> <span style={{ marginLeft: '4px' }}>Add New Meal Card</span>
          </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formData.meals.map((meal, mealIndex) => (
            <MealPlanCard 
                key={mealIndex}
                index={mealIndex}
                meal={meal}
                onChange={handleMealChange}
                onRemove={removeMeal}
                onFoodAdd={addFood}
                onFoodRemove={removeFood}
            />
        ))}
      </div>

      <div className="db-divider" style={{ margin: '3rem 0 2rem 0' }} />

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
                  background: 'linear-gradient(135deg, #51cf66, #2db44d)', 
                  color: '#fff', 
                  padding: '0.8rem 2.2rem', 
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 8px 30px rgba(81, 207, 102, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
          >
              <Icons.Save size={20} /> Deploy Diet Plan
          </button>
      </div>


      {/* STRATEGY MODAL */}
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
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9', fontSize: '1.4rem' }}>Diet Plan Exists</h3>
                        <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>
                            Member already has an active diet plan <strong>"{existingPlanName}"</strong>. <br/>
                            How would you like to apply these new meals?
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
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Add to existing meals</span>
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

export default AssignDietForm;
