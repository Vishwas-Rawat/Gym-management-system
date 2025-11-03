// src/components/MemberAddForm.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Button,
  Typography,
} from "@mui/material";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ["00", "15", "30", "45"];
const ampm = ["AM", "PM"];

const MemberAddForm = ({ onSuccess }) => {
  const initial = {
    fullName: "", email: "", phoneNo: "", gymId: "",
    monthsPaid: "", monthsFree: "",
    fromHour: "", fromMinute: "", fromPeriod: "",
    toHour: "", toMinute: "", toPeriod: "",
    registrationFee: 500, planPrice: 0, discount: 0, totalAmount: 0,
    paymentMethod: "", startDate: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(initial);
  const [dropdownWidth, setDropdownWidth] = useState(180);
  const labelRef = useRef(null);

  useEffect(() => {
    if (labelRef.current) setDropdownWidth(labelRef.current.offsetWidth + 60);
  }, []);

  useEffect(() => {
    const total = form.registrationFee + form.planPrice - form.discount;
    setForm(p => ({ ...p, totalAmount: total }));
  }, [form.registrationFee, form.planPrice, form.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["monthsPaid", "monthsFree"].includes(name) && value && !/^\d*$/.test(value)) return;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    const required = ["fullName", "email", "phoneNo", "gymId", "monthsPaid", "paymentMethod", "startDate"];
    const missing = required.filter(f => !form[f]);
    if (missing.length) {
      alert(`Missing: ${missing.join(", ")}`);
      return;
    }

    const timing = form.fromHour && form.toHour
      ? `${form.fromHour}:${form.fromMinute || "00"} ${form.fromPeriod} to ${form.toHour}:${form.toMinute || "00"} ${form.toPeriod}`
      : null;

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phoneNo: form.phoneNo,
      gymId: Number(form.gymId),
      monthsPaid: Number(form.monthsPaid),
      monthsFree: Number(form.monthsFree) || 0,
      ...(timing && {
        fromHour: form.fromHour, fromMinute: form.fromMinute, fromPeriod: form.fromPeriod,
        toHour: form.toHour, toMinute: form.toMinute, toPeriod: form.toPeriod
      }),
      totalAmount: Number(form.totalAmount),
      paymentMethod: form.paymentMethod,
      startDate: form.startDate,
    };

    onSuccess(payload);
  };

  const reset = () => setForm(initial);
  const fixed = { "& .MuiOutlinedInput-root": { height: 56, borderRadius: "8px" }, width: dropdownWidth };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#059669" }}>1. Member Info</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Phone" name="phoneNo" value={form.phoneNo} onChange={handleChange} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Gym ID" name="gymId" type="number" value={form.gymId} onChange={handleChange} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Months Paid" name="monthsPaid" type="number" value={form.monthsPaid} onChange={handleChange} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Months Free" name="monthsFree" type="number" value={form.monthsFree} onChange={handleChange} sx={fixed} /></Grid>
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#059669" }}>2. Timing (Optional)</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>From Hour</InputLabel><Select name="fromHour" value={form.fromHour} onChange={handleChange} displayEmpty><MenuItem value=""><em>Hr</em></MenuItem>{hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>Minute</InputLabel><Select name="fromMinute" value={form.fromMinute} onChange={handleChange} displayEmpty><MenuItem value=""><em>Min</em></MenuItem>{minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>AM/PM</InputLabel><Select name="fromPeriod" value={form.fromPeriod} onChange={handleChange} displayEmpty><MenuItem value=""><em>—</em></MenuItem>{ampm.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={1}><Typography sx={{ fontWeight: 600, color: "#059669" }}>to</Typography></Grid>
            <Grid item xs={12} sm={5}>
              <Grid container spacing={2}>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>To Hour</InputLabel><Select name="toHour" value={form.toHour} onChange={handleChange} displayEmpty><MenuItem value=""><em>Hr</em></MenuItem>{hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>Minute</InputLabel><Select name="toMinute" value={form.toMinute} onChange={handleChange} displayEmpty><MenuItem value=""><em>Min</em></MenuItem>{minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth sx={fixed}><InputLabel shrink>AM/PM</InputLabel><Select name="toPeriod" value={form.toPeriod} onChange={handleChange} displayEmpty><MenuItem value=""><em>—</em></MenuItem>{ampm.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#059669" }}>3. Payment</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Reg Fee" name="registrationFee" type="number" value={form.registrationFee} onChange={handleChange} InputProps={{ startAdornment: "₹" }} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Plan Price" name="planPrice" type="number" value={form.planPrice} onChange={handleChange} InputProps={{ startAdornment: "₹" }} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Discount" name="discount" type="number" value={form.discount} onChange={handleChange} InputProps={{ startAdornment: "₹" }} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Total" value={form.totalAmount} disabled InputProps={{ startAdornment: "₹" }} sx={fixed} /></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth sx={fixed}><InputLabel shrink>Payment Method</InputLabel><Select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} displayEmpty><MenuItem value=""><em>Select</em></MenuItem>{["Cash","UPI","Card","NetBanking"].map(v=><MenuItem key={v} value={v}>{v}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={fixed} /></Grid>
          </Grid>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button onClick={reset}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
            Register Member
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default MemberAddForm;