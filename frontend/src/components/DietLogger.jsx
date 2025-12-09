import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Snackbar
} from '@mui/material';
import { Add, Save } from '@mui/icons-material';
import { logDiet } from '../services/memberService';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER', 'PRE_WORKOUT', 'POST_WORKOUT'];

const DietLogger = ({ onLogSuccess }) => {
    const [formData, setFormData] = useState({
        mealName: 'BREAKFAST',
        foodName: '',
        quantity: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.foodName || !formData.quantity || !formData.calories) {
            setMessage({ type: 'error', text: 'Please fill in required fields (Food, Qty, Cals)' });
            return;
        }

        setLoading(true);
        try {
            await logDiet({
                ...formData,
                quantity: parseFloat(formData.quantity),
                calories: parseFloat(formData.calories),
                protein: parseFloat(formData.protein) || 0,
                carbs: parseFloat(formData.carbs) || 0,
                fat: parseFloat(formData.fat) || 0
            });
            setMessage({ type: 'success', text: 'Meal logged successfully!' });
            setFormData({
                mealName: formData.mealName, // Keep meal type
                foodName: '',
                quantity: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: ''
            });
            if (onLogSuccess) onLogSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: error.toString() });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Box sx={{ mb: 3 }}>
                 <Typography variant="h6" fontWeight={800} color="primary.main">Create Your Own Today's Diet</Typography>
                 <Typography variant="body2" color="text.secondary">Track your daily intake accurately.</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Row 1: Main Info */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Meal Type</InputLabel>
                        <Select
                            name="mealName"
                            value={formData.mealName}
                            label="Meal Type"
                            onChange={handleChange}
                        >
                            {MEAL_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                    <TextField 
                        fullWidth
                        label="Food Name" 
                        name="foodName"
                        value={formData.foodName}
                        onChange={handleChange}
                        placeholder="e.g. Grilled Chicken Breast"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                     <TextField 
                        fullWidth
                        label="Qty (g/unit)" 
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Row 2: Macros */}
                <Grid item xs={6} md={3}>
                     <TextField 
                        fullWidth
                        label="Calories" 
                        name="calories"
                        type="number"
                        value={formData.calories}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                     <TextField 
                        fullWidth
                        label="Protein (g)" 
                        name="protein"
                        type="number"
                        value={formData.protein}
                        onChange={handleChange}
                    />
                </Grid>
                 <Grid item xs={6} md={3}>
                     <TextField 
                        fullWidth
                        label="Carbs (g)" 
                        name="carbs"
                        type="number"
                        value={formData.carbs}
                        onChange={handleChange}
                    />
                </Grid>
                 <Grid item xs={6} md={3}>
                     <TextField 
                        fullWidth
                        label="Fat (g)" 
                        name="fat"
                        type="number"
                        value={formData.fat}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={<Add />}
                        sx={{ 
                            py: 1.5, 
                            fontSize: '1rem', 
                            fontWeight: 700,
                            borderRadius: 3,
                            boxShadow: '0 8px 20px -4px rgba(0, 123, 255, 0.5)'
                        }}
                    >
                        {loading ? 'Logging...' : 'Log This Meal'}
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: '', text: '' })}>
                <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ borderRadius: 3 }}>{message.text}</Alert>
            </Snackbar>
        </Paper>
    );
};

export default DietLogger;
