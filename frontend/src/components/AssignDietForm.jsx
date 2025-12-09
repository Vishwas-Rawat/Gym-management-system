import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Grid,
  Paper,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER', 'PRE_WORKOUT', 'POST_WORKOUT'];
const DIET_TYPES = ['VEG', 'NON_VEG', 'VEGAN', 'KETO'];

const emptyFood = { foodName: '', quantity: '', notes: '' };
const emptyMeal = {
  mealName: '',
  foods: [{ ...emptyFood }],
  protein: { proteinName: '', proteinQuantity: '' }
};

const AssignDietForm = ({ memberId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    memberId: memberId,
    planName: '',
    dietType: 'NON_VEG',
    meals: [{ ...emptyMeal }]
  });
  const [error, setError] = useState('');

  const handlePlanChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Meal Handlers ---
  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { ...emptyMeal, foods: [{ ...emptyFood }] }]
    }));
  };

  const removeMeal = (index) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const handleMealChange = (index, field, value) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[index] = { ...updatedMeals[index], [field]: value };
      return { ...prev, meals: updatedMeals };
    });
  };

  const handleProteinChange = (mealIndex, field, value) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        protein: { ...updatedMeals[mealIndex].protein, [field]: value }
      };
      return { ...prev, meals: updatedMeals };
    });
  };

  // --- Food Handlers ---
  const addFood = (mealIndex) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[mealIndex].foods.push({ ...emptyFood });
      return { ...prev, meals: updatedMeals };
    });
  };

  const removeFood = (mealIndex, foodIndex) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[mealIndex].foods = updatedMeals[mealIndex].foods.filter((_, i) => i !== foodIndex);
      return { ...prev, meals: updatedMeals };
    });
  };

  const handleFoodChange = (mealIndex, foodIndex, field, value) => {
    setFormData(prev => {
      const updatedMeals = [...prev.meals];
      updatedMeals[mealIndex].foods[foodIndex] = {
        ...updatedMeals[mealIndex].foods[foodIndex],
        [field]: value
      };
      return { ...prev, meals: updatedMeals };
    });
  };

  const handleSubmit = () => {
    if (!formData.planName) {
      setError('Plan name is required');
      return;
    }
    // Basic validation
    for (let meal of formData.meals) {
        if (!meal.mealName) {
            setError('All meals must have a name (type)');
            return;
        }
    }
    setError('');
    
    // Clean up empty protein objects if they are empty
    const cleanedMeals = formData.meals.map(meal => {
        const cleanMeal = { ...meal };
        if (!cleanMeal.protein.proteinName && !cleanMeal.protein.proteinQuantity) {
            cleanMeal.protein = null;
        }
        return cleanMeal;
    });

    onSubmit({ ...formData, meals: cleanedMeals });
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Assign Diet Plan</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Plan Name"
            value={formData.planName}
            onChange={(e) => handlePlanChange('planName', e.target.value)}
            placeholder="e.g. Muscle Gain Phase 1"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Diet Type</InputLabel>
            <Select
              value={formData.dietType}
              label="Diet Type"
              onChange={(e) => handlePlanChange('dietType', e.target.value)}
            >
              {DIET_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Meals</Typography>
      
      <Stack spacing={3}>
        {formData.meals.map((meal, mealIndex) => (
          <Paper key={mealIndex} variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={10} sm={4}>
                 <FormControl fullWidth size="small">
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={meal.mealName}
                      label="Meal Type"
                      onChange={(e) => handleMealChange(mealIndex, 'mealName', e.target.value)}
                    >
                      {MEAL_TYPES.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={2} sm={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => removeMeal(mealIndex)} color="error" size="small">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>

            {/* Protein Section */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: '#e0f2fe', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#0284c7' }}>Protein Source (Optional)</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField 
                            fullWidth size="small" 
                            label="Protein Name" 
                            placeholder="e.g. Whey Protein"
                            value={meal.protein.proteinName}
                            onChange={(e) => handleProteinChange(mealIndex, 'proteinName', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            fullWidth size="small" 
                            label="Quantity" 
                            placeholder="e.g. 1 Scoop"
                            value={meal.protein.proteinQuantity}
                            onChange={(e) => handleProteinChange(mealIndex, 'proteinQuantity', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Foods</Typography>
            <Stack spacing={1}>
                {meal.foods.map((food, foodIndex) => (
                    <Grid container spacing={1} key={foodIndex} alignItems="center">
                        <Grid item xs={4}>
                            <TextField 
                                fullWidth size="small" 
                                placeholder="Food Item" 
                                value={food.foodName}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'foodName', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField 
                                fullWidth size="small" 
                                placeholder="Qty" 
                                value={food.quantity}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'quantity', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField 
                                fullWidth size="small" 
                                placeholder="Notes" 
                                value={food.notes}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'notes', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => removeFood(mealIndex, foodIndex)}
                                disabled={meal.foods.length === 1}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button 
                    startIcon={<Add />} 
                    size="small" 
                    onClick={() => addFood(mealIndex)}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                >
                    Add Food
                </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Button 
        variant="outlined" 
        startIcon={<Add />} 
        onClick={addMeal}
        fullWidth
        sx={{ mt: 2, mb: 4, borderStyle: 'dashed' }}
      >
        Add Meal
      </Button>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button 
            variant="contained" 
            startIcon={<Save />} 
            onClick={handleSubmit}
        >
            Assign Plan
        </Button>
      </Stack>
    </Box>
  );
};

export default AssignDietForm;
