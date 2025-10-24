import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Stack,
  Button,
  Typography,
} from "@mui/material";

const gyms = ["FitZone Downtown", "PowerGym Central", "Elite Fitness Hub", "Iron Temple", "Core Strength Studio"];
const planDurationMap = { "Monthly": 1, "3 Months": 3, "6 Months": 6, "1 Year": 12 };

/* --------------------------------------------------------------
   Green hover / focus + SAME border-radius & height as TextField
   -------------------------------------------------------------- */
const hoverFocusGreenStyles = {
  // TextField & Select share the same height (56px) and radius (4px)
  "& .MuiOutlinedInput-root": {
    height: 56,               // <-- same as TextField
    borderRadius: "4px",      // <-- same as TextField
    "& fieldset": {},
    "&:hover fieldset": { borderColor: "#059669" },
    "&.Mui-focused fieldset": { borderColor: "#059669", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": {},
  "&.Mui-focused .MuiInputLabel-root": {
    color: "#059669",
    fontWeight: 600,
  },
  // keep the inner select padding identical to TextField
  "& .MuiSelect-select": { py: 1.2 },
};

const MemberAddForm = ({ onSuccess }) => {
  const initialForm = {
    fullName: "", email: "", phoneNo: "", gender: "", address: "",
    gym: "", plan: "", facilities: "", timeSlot: "", trainerRequired: "No",
    joiningFee: 500, planPrice: 0, discount: 0, totalAmount: 0, paymentMethod: "",
    paymentStatus: "Pending", offerApplied: "", adminNotes: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "", status: "Active"
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const total = form.joiningFee + form.planPrice - form.discount;
    setForm(prev => ({ ...prev, totalAmount: total }));

    if (form.startDate && form.plan) {
      const start = new Date(form.startDate);
      const months = planDurationMap[form.plan] || 0;
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      setForm(prev => ({ ...prev, endDate: end.toISOString().split("T")[0] }));
    }
  }, [form.joiningFee, form.planPrice, form.discount, form.startDate, form.plan]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};
  const handleSubmit = () => {
    if (!form.gym) {
      alert("Please select a gym.");
      return;
    }
    const newMember = {
      id: Date.now(),
      name: form.fullName,
      email: form.email,
      phoneNo: form.phoneNo,
      gymName: form.gym,
      currentPlan: form.facilities,
      planPrice: form.totalAmount,
      amountPaid: form.paymentStatus === "Paid" ? form.totalAmount : 0,
      paymentMethod: form.paymentMethod,
      timeSlot: form.timeSlot,
      status: form.paymentStatus,
    };
    setTimeout(() => onSuccess(newMember), 500);
  };

  const resetForm = () => setForm(initialForm);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "lg", mx: "auto" }}>
      <Stack spacing={5}>

        {/* ---------- 1. Member Details ---------- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#059669", fontSize: "1.1rem" }}>
            1. Member Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" name="phoneNo" value={form.phoneNo} onChange={handleChange} sx={hoverFocusGreenStyles} />
            </Grid>

            {/* ----- Gender (reference) ----- */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="gender-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  label="Gender"
                  displayEmpty
                >
                  <MenuItem value=""><em>Select Gender</em></MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Address (optional)" name="address" value={form.address} onChange={handleChange} multiline rows={2} sx={hoverFocusGreenStyles} />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#d1fae5" }} />

        {/* ---------- 2. Membership Details ---------- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#059669", fontSize: "1.1rem" }}>
            2. Membership Details
          </Typography>
          <Grid container spacing={3}>

            {/* Gym */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="gym-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Gym</InputLabel>
                <Select labelId="gym-label" name="gym" value={form.gym} onChange={handleChange} label="Gym" displayEmpty>
                  <MenuItem value=""><em>Select Gym</em></MenuItem>
                  {gyms.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Plan */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="plan-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Plan</InputLabel>
                <Select labelId="plan-label" name="plan" value={form.plan} onChange={handleChange} label="Plan" displayEmpty>
                  <MenuItem value=""><em>Select Plan</em></MenuItem>
                  {Object.keys(planDurationMap).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Facilities */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="facilities-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Facilities</InputLabel>
                <Select labelId="facilities-label" name="facilities" value={form.facilities} onChange={handleChange} label="Facilities" displayEmpty>
                  <MenuItem value=""><em>Select Facilities</em></MenuItem>
                  <MenuItem value="Gym">Gym</MenuItem>
                  <MenuItem value="Gym + Cardio">Gym + Cardio</MenuItem>
                  <MenuItem value="Gym + Trainer">Gym + Trainer</MenuItem>
                  <MenuItem value="Full Access">Full Access</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Slot Timing */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="timeSlot-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Slot Timing</InputLabel>
                <Select labelId="timeSlot-label" name="timeSlot" value={form.timeSlot} onChange={handleChange} label="Slot Timing" displayEmpty>
                  <MenuItem value=""><em>Select Slot</em></MenuItem>
                  <MenuItem value="6–8 AM">6–8 AM</MenuItem>
                  <MenuItem value="8–10 AM">8–10 AM</MenuItem>
                  <MenuItem value="5–7 PM">5–7 PM</MenuItem>
                  <MenuItem value="7–9 PM">7–9 PM</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Trainer Required */}
            <Grid item xs={12} sm={6}>
              <FormControl sx={hoverFocusGreenStyles}>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>Trainer Required</Typography>
                <RadioGroup row name="trainerRequired" value={form.trainerRequired} onChange={handleChange}>
                  <FormControlLabel value="Yes" control={<Radio sx={{ color: "#059669", "&.Mui-checked": { color: "#059669" } }} />} label="Yes" />
                  <FormControlLabel value="No"  control={<Radio sx={{ color: "#059669", "&.Mui-checked": { color: "#059669" } }} />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#d1fae5" }} />

        {/* ---------- 3. Payment Info ---------- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#059669", fontSize: "1.1rem" }}>
            3. Payment Info
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Joining Fee" name="joiningFee" type="number" value={form.joiningFee} onChange={handleChange}
                InputProps={{ startAdornment: "₹" }} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Plan Price" name="planPrice" type="number" value={form.planPrice} onChange={handleChange}
                InputProps={{ startAdornment: "₹" }} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Discount" name="discount" type="number" value={form.discount} onChange={handleChange}
                InputProps={{ startAdornment: "₹" }} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Total Amount" value={form.totalAmount} disabled
                InputProps={{ startAdornment: "₹" }} sx={hoverFocusGreenStyles} />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="paymentMethod-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Payment Method</InputLabel>
                <Select labelId="paymentMethod-label" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
                  label="Payment Method" displayEmpty>
                  <MenuItem value=""><em>Select Payment Method</em></MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="NetBanking">NetBanking</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Payment Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="paymentStatus-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Payment Status</InputLabel>
                <Select labelId="paymentStatus-label" name="paymentStatus" value={form.paymentStatus} onChange={handleChange}
                  label="Payment Status" displayEmpty>
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#d1fae5" }} />

        {/* ---------- 4. Offer / Notes ---------- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#059669", fontSize: "1.1rem" }}>
            4. Offer / Notes
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Offer Applied" name="offerApplied" value={form.offerApplied}
                onChange={handleChange} placeholder="e.g. 3M + 1 Free" sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Admin Notes (optional)" name="adminNotes" value={form.adminNotes}
                onChange={handleChange} multiline rows={3} sx={hoverFocusGreenStyles} />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#d1fae5" }} />

        {/* ---------- 5. System Fields ---------- */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#059669", fontSize: "1.1rem" }}>
            5. System Fields
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Start Date" name="startDate" type="date" value={form.startDate}
                onChange={handleChange} InputLabelProps={{ shrink: true }} sx={hoverFocusGreenStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="End Date" value={form.endDate} disabled sx={hoverFocusGreenStyles} />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" sx={hoverFocusGreenStyles}>
                <InputLabel id="status-label" shrink sx={{ fontWeight: 600, color: "#059669" }}>Status</InputLabel>
                <Select labelId="status-label" name="status" value={form.status} onChange={handleChange}
                  label="Status" displayEmpty>
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* ---------- Action Buttons ---------- */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button size="large" onClick={resetForm}>Cancel</Button>
          <Button
            size="large"
            variant="contained"
            onClick={handleSubmit}
            sx={{
              px: 4,
              background: "linear-gradient(135deg, #059669, #047857)",
              boxShadow: "0 6px 16px rgba(5,150,105,0.25)",
              "&:hover": { boxShadow: "0 10px 24px rgba(5,150,105,0.35)" },
            }}
          >
            Register Member
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default MemberAddForm;