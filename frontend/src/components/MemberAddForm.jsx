// src/components/MemberAddForm.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Divider, Stack, Button, Typography, IconButton, Paper, Tabs, Tab,
  TabScrollButton, CircularProgress, Alert, AlertTitle, useMediaQuery
} from "@mui/material";
import { Add, Delete, ChevronLeft, ChevronRight, FitnessCenter } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ["00", "15", "30", "45"];
const ampm = ["AM", "PM"];
const paymentMethods = ["CASH", "ONLINE", "UPI", "CARD", "NETBANKING"];

const emptyMember = {
  fullName: "", email: "", phoneNo: "", monthsPaid: "", monthsFree: "",
  fromHour: "", fromMinute: "", fromPeriod: "", toHour: "", toMinute: "", toPeriod: "",
  registrationFee: "", planPrice: "", discount: "", totalAmount: 0,
  paymentMethod: "", startDate: new Date().toISOString().split("T")[0],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function MemberAddForm({ onSuccess, multiple = false, member = null, onCancel }) {
  const navigate = useNavigate();
  const isEdit = !!member;

  const isJioPhone = useMediaQuery("(max-width:280px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  const [members, setMembers] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [globalGymId, setGlobalGymId] = useState("");
  const [dropdownWidth, setDropdownWidth] = useState(160);
  const labelRef = useRef(null);

  const [gymOptions, setGymOptions] = useState([]);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [showNoGymMessage, setShowNoGymMessage] = useState(false);

  /* ---------- FETCH GYMS ---------- */
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoadingGyms(true);
        const response = await api.get("/gym/my-gyms");
        const gyms = Array.isArray(response.data) ? response.data : [];
        if (gyms.length === 0) setShowNoGymMessage(true);
        else setGymOptions(gyms.map(g => ({ id: g.gymId, name: g.gymName })));
      } catch {
        setShowNoGymMessage(true);
        setGymOptions([]);
      } finally {
        setLoadingGyms(false);
      }
    };
    fetchGyms();
  }, []);

  useEffect(() => {
    if (labelRef.current) setDropdownWidth(Math.max(labelRef.current.offsetWidth + 50, 160));
  }, [gymOptions]);

  /* ---------- EDIT INITIALISE ---------- */
  useEffect(() => {
  if (isEdit && member) {
    const timeSlot = member.workoutTimeSlot || "";
    let fromHour = "", fromMinute = "", fromPeriod = "";
    let toHour = "", toMinute = "", toPeriod = "";

    if (timeSlot && !member.fromHour) {
      const [fromPart = "", toPart = ""] = timeSlot.split(" to ");
      const [fromTime = "", fromP = ""] = fromPart.trim().split(" ");
      const [toTime = "", toP = ""] = toPart.trim().split(" ");
      [fromHour, fromMinute] = fromTime.split(":");
      [toHour, toMinute] = toTime.split(":");
      fromPeriod = fromP;
      toPeriod = toP;
    } else {
      fromHour = member.fromHour ?? "";
      fromMinute = member.fromMinute ?? "";
      fromPeriod = member.fromPeriod ?? "";
      toHour = member.toHour ?? "";
      toMinute = member.toMinute ?? "";
      toPeriod = member.toPeriod ?? "";
    }

    const init = {
      ...emptyMember,
      fullName: member.fullName ?? "",
      email: member.email ?? "",
      phoneNo: member.phoneNo || member.phoneNumber || "",
      monthsPaid: member.monthsPaid?.toString() ?? "",
      monthsFree: member.monthsFree?.toString() ?? "0",
      fromHour, fromMinute, fromPeriod,
      toHour, toMinute, toPeriod,
      registrationFee: member.registrationFee?.toString() ?? "",
      planPrice: member.planPrice?.toString() ?? "",
      discount: member.discount?.toString() ?? "",
      totalAmount: Number(member.totalAmount) || 0,
      paymentMethod: member.paymentMethod ?? "",
      startDate: member.startDate || member.joiningDate || "",
    };

    setMembers([init]);
    setGlobalGymId("");
  } else {
    setMembers([emptyMember]);
    setGlobalGymId("");
  }
}, [isEdit, member]);

  useEffect(() => {
    setMembers(prev => prev.map(m => ({ ...m, gymId: globalGymId })));
  }, [globalGymId]);

  /* ---------- AUTO TOTAL ---------- */
  useEffect(() => {
    let changed = false;
    const updated = members.map(m => {
      const reg = Number(m.registrationFee || 0);
      const plan = Number(m.planPrice || 0);
      const disc = Number(m.discount || 0);
      const total = Math.max(0, reg + plan - disc);
      if (m.totalAmount !== total) { changed = true; return { ...m, totalAmount: total }; }
      return m;
    });
    if (changed) setMembers(updated);
  }, [members]);

  const handleChange = useCallback((idx, field, value) => {
    if (["monthsPaid","monthsFree","registrationFee","planPrice","discount"].includes(field) && value && !/^\d*$/.test(value)) return;
    setMembers(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }, []);

  const addMember = useCallback(() => {
    setMembers(prev => [...prev, { ...emptyMember, gymId: globalGymId }]);
    setActiveIdx(members.length);
  }, [globalGymId, members.length]);

  const removeMember = useCallback(idx => {
    if (members.length === 1) return;
    setMembers(prev => prev.filter((_, i) => i !== idx));
    setActiveIdx(prev => prev >= members.length - 1 ? members.length - 2 : prev);
  }, [members.length]);

  const submit = useCallback(() => {
    const payload = multiple || members.length > 1 ? members : members[0];
    const required = ["fullName","email","phoneNo","monthsPaid","paymentMethod","startDate"];

    if (!globalGymId) { alert("Please select a gym before submitting."); return; }

    for (const m of Array.isArray(payload) ? payload : [payload]) {
      const missing = required.filter(f => !m[f]);
      if (missing.length) { alert(`Member ${members.indexOf(m)+1} missing: ${missing.join(", ")}`); return; }
    }

    const final = (Array.isArray(payload) ? payload : [payload]).map(m => {
      const timing = m.fromHour && m.toHour ? {
        fromHour: m.fromHour,
        fromMinute: m.fromMinute || "00",
        fromPeriod: m.fromPeriod,
        toHour: m.toHour,
        toMinute: m.toMinute || "00",
        toPeriod: m.toPeriod,
        workoutTimeSlot: `${m.fromHour}:${m.fromMinute || "00"} ${m.fromPeriod} to ${m.toHour}:${m.toMinute || "00"} ${m.toPeriod}`
      } : {};

      return {
        fullName: m.fullName,
        email: m.email,
        phoneNo: m.phoneNo,
        gymId: Number(globalGymId),
        monthsPaid: Number(m.monthsPaid),
        monthsFree: Number(m.monthsFree || 0),
        paymentMethod: m.paymentMethod,
        joiningDate: m.startDate,
        registrationFee: Number(m.registrationFee || 0),
        planPrice: Number(m.planPrice || 0),
        discount: Number(m.discount || 0),
        totalAmount: Number(m.totalAmount || 0),
        ...timing,
      };
    });

    onSuccess(isEdit ? { memberId: member.id, ...final[0] } : (multiple || members.length > 1 ? final : final[0]));
  }, [globalGymId, members, multiple, onSuccess, isEdit, member]);

  /* ---------- STYLES ---------- */
  const fieldMargin = isJioPhone ? 0.8 : 1;

  const inputSx = useMemo(() => ({
    mb: fieldMargin,
    "& .MuiOutlinedInput-root": {
      height: isJioPhone ? 38 : 52,
      borderRadius: "6px",
      fontSize: isJioPhone ? "0.75rem" : "0.95rem",
      "& fieldset": { borderColor: "rgba(0,0,0,0.23)" },
      "&:hover fieldset": { borderColor: "rgba(0,0,0,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
    "& .MuiInputLabel-root": {
      fontSize: isJioPhone ? "0.65rem" : "0.8rem",
      transform: "translate(14px, -6px) scale(0.75)",
      backgroundColor: "white",
      padding: "0 6px",
      zIndex: 1,
      whiteSpace: "nowrap",
      overflow: "visible",
      textOverflow: "clip",
      maxWidth: "none",
    },
    "& .MuiInputBase-input": {
      padding: "8px 12px",
      fontSize: isJioPhone ? "0.75rem" : "0.95rem",
      height: "100%",
      boxSizing: "border-box",
    },
    width: "100%",
  }), [isJioPhone, fieldMargin]);

  const selectSx = useMemo(() => ({
    ...inputSx,
    mb: fieldMargin,
    "& .MuiSelect-select": {
      padding: "8px 32px 8px 12px",
      fontSize: isJioPhone ? "0.75rem" : "0.95rem",
      display: "flex",
      alignItems: "center",
    },
    minWidth: { xs: 85, sm: 100 },
  }), [inputSx, isJioPhone, fieldMargin]);

  const ScrollButton = useCallback(props => (
    <TabScrollButton {...props} icon={props.direction === "left" ? <ChevronLeft /> : <ChevronRight />}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "6px",
        minWidth: 30,
        width: 30,
        height: 30,
        "&.Mui-disabled": { opacity: 0.3 }
      }} />
  ), []);

  const getTabLabel = useCallback((m, idx) => m.fullName?.trim() || `M${idx + 1}`, []);
  const current = members[activeIdx] || {};

  return (
    <Box sx={{
      p: isJioPhone ? 0.8 : { xs: 1.2, sm: 1.8, md: 2.5 },
      maxWidth: "100vw",
      overflowX: "hidden",
      mx: "auto"
    }}>
      {/* ---------- GYM SELECT ---------- */}
      <Grid container spacing={isJioPhone ? 0.8 : 1.2} sx={{ mb: isJioPhone ? 1.2 : 1.8 }}>
        <Grid item xs={12} sm={8}>
          <FormControl fullWidth sx={selectSx}>
            <InputLabel shrink ref={labelRef}>Gym Name</InputLabel>
            <Select value={globalGymId} onChange={e => setGlobalGymId(e.target.value)}
              disabled={loadingGyms || showNoGymMessage} displayEmpty>
              <MenuItem value="" disabled sx={{ fontSize: isJioPhone ? "0.7rem" : "0.85rem" }}>
                {loadingGyms ? "Loading..." : showNoGymMessage ? "No gym" : "Select Gym"}
              </MenuItem>
              {gymOptions.map(g => (
                <MenuItem key={g.id} value={g.id} sx={{ fontSize: isJioPhone ? "0.7rem" : "0.85rem" }}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
            {loadingGyms && <CircularProgress size={14} sx={{ position: "absolute", right: 6, top: 10 }} />}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" startIcon={<FitnessCenter />}
            onClick={() => navigate("/gym-register")}
            sx={{
              height: isJioPhone ? 38 : 52,
              borderRadius: "6px",
              background: "primary.main",
              "&:hover": { background: "#0069d9" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: isJioPhone ? "0.7rem" : "0.85rem",
              py: isJioPhone ? 0.6 : 0.8
            }}>
            Create Gym
          </Button>
        </Grid>
      </Grid>

      {/* ---------- ALERTS ---------- */}
      {!globalGymId && !loadingGyms && !showNoGymMessage && (
        <Alert severity="warning" sx={{ mb: 1.2, fontSize: isJioPhone ? "0.68rem" : "0.85rem", py: 0.4 }}>
          <AlertTitle sx={{ fontSize: isJioPhone ? "0.78rem" : "0.95rem" }}>Gym Required</AlertTitle>
          Please select a gym.
        </Alert>
      )}
      {showNoGymMessage && (
        <Alert severity="warning" sx={{ mb: 1.2, fontSize: isJioPhone ? "0.68rem" : "0.85rem", py: 0.4 }}>
          <AlertTitle sx={{ fontSize: isJioPhone ? "0.78rem" : "0.95rem" }}>No Gym</AlertTitle>
          Create one first.
        </Alert>
      )}

      {/* ---------- TABS ---------- */}
      <Box sx={{ overflowX: "auto", mb: 1.2, "&::-webkit-scrollbar": { display: "none" } }}>
        <Tabs value={activeIdx} onChange={(_, v) => setActiveIdx(v)} variant="scrollable"
          scrollButtons allowScrollButtonsMobile ScrollButtonComponent={ScrollButton}
          sx={{
            minHeight: isJioPhone ? 34 : 38,
            "& .MuiTabs-indicator": { height: 2.5, borderRadius: "2.5px 2.5px 0 0", background: "primary.main" },
            "& .MuiTab-root": { minHeight: isJioPhone ? 34 : 38, fontSize: isJioPhone ? "0.68rem" : "0.85rem", py: 0.4 }
          }}>
          {members.map((m, idx) => (
            <Tab key={idx}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                  <span>{getTabLabel(m, idx)}</span>
                  {multiple && members.length > 1 && (
                    <IconButton size="small" color="error"
                      onClick={e => { e.stopPropagation(); removeMember(idx); }} sx={{ p: 0.2 }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                minHeight: isJioPhone ? 34 : 38,
                borderRadius: "6px 6px 0 0",
                mr: 0.2,
                bgcolor: activeIdx === idx ? "rgba(0, 123, 255, 0.08)" : "background.paper",
                "&:hover": { bgcolor: "rgba(0, 123, 255, 0.15)" }
              }} />
          ))}
          {multiple && (
            <Tab icon={<Add />} label="Add" onClick={addMember}
              sx={{
                minWidth: "auto",
                bgcolor: "background.paper",
                borderRadius: "6px 6px 0 0",
                ml: 0.4,
                border: "1px dashed",
                borderColor: "divider",
                "&:hover": { borderColor: "primary.main" },
                fontSize: isJioPhone ? "0.68rem" : "0.85rem"
              }} />
          )}
        </Tabs>
      </Box>

      {/* ---------- FORM CONTENT ---------- */}
      <Stack spacing={isJioPhone ? 1.2 : 1.8} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        <Paper variant="outlined" sx={{ p: isJioPhone ? 1.2 : { xs: 1.8, sm: 2.5 }, borderRadius: 1.5 }}>
          <Typography variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.2,
              color: "primary.main",
              fontSize: isJioPhone ? "0.85rem" : { xs: "0.95rem", sm: "1.05rem" }
            }}>
            {multiple ? getTabLabel(current, activeIdx) : isEdit ? "Edit" : "New Member"}
          </Typography>

          {/* PERSONAL INFO */}
          <Grid container spacing={isJioPhone ? 0.8 : 1.2}>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Full Name" value={current.fullName || ""} onChange={e => handleChange(activeIdx, "fullName", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Email" type="email" value={current.email || ""} onChange={e => handleChange(activeIdx, "email", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Phone" value={current.phoneNo || ""} onChange={e => handleChange(activeIdx, "phoneNo", e.target.value)} sx={inputSx} inputProps={{ maxLength: 10 }} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Months Paid" type="number" value={current.monthsPaid || ""} onChange={e => handleChange(activeIdx, "monthsPaid", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Months Free" type="number" value={current.monthsFree || ""} onChange={e => handleChange(activeIdx, "monthsFree", e.target.value)} sx={inputSx} /></Grid>
          </Grid>

          <Divider sx={{ my: 1.2 }} />
          <Typography variant="subtitle2" sx={{ mb: 0.8, color: "primary.main", fontSize: isJioPhone ? "0.75rem" : "0.9rem" }}>Timing</Typography>

          {/* TIMING – FULL‑WIDTH ON MOBILE */}
          <Grid container spacing={isMobile ? 0.8 : 0.6}>
            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>From Hour</InputLabel><Select value={current.fromHour || ""} onChange={e => handleChange(activeIdx, "fromHour", e.target.value)}><MenuItem value=""><em>Hr</em></MenuItem>{hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>From Min</InputLabel><Select value={current.fromMinute || ""} onChange={e => handleChange(activeIdx, "fromMinute", e.target.value)}><MenuItem value=""><em>Min</em></MenuItem>{minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>AM/PM</InputLabel><Select value={current.fromPeriod || ""} onChange={e => handleChange(activeIdx, "fromPeriod", e.target.value)}><MenuItem value=""><em>—</em></MenuItem>{ampm.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>

            <Grid item xs={12} textAlign="center"><Typography sx={{ fontWeight: 600, color: "primary.main", fontSize: isJioPhone ? "0.75rem" : "0.9rem" }}>to</Typography></Grid>

            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>To Hour</InputLabel><Select value={current.toHour || ""} onChange={e => handleChange(activeIdx, "toHour", e.target.value)}><MenuItem value=""><em>Hr</em></MenuItem>{hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>To Min</InputLabel><Select value={current.toMinute || ""} onChange={e => handleChange(activeIdx, "toMinute", e.target.value)}><MenuItem value=""><em>Min</em></MenuItem>{minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={isMobile ? 12 : 4} component={motion.div} variants={itemVariants}><FormControl fullWidth sx={selectSx}><InputLabel shrink>AM/PM</InputLabel><Select value={current.toPeriod || ""} onChange={e => handleChange(activeIdx, "toPeriod", e.target.value)}><MenuItem value=""><em>—</em></MenuItem>{ampm.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}</Select></FormControl></Grid>
          </Grid>

          <Divider sx={{ my: 1.2 }} />
          <Typography variant="subtitle2" sx={{ mb: 0.8, color: "primary.main", fontSize: isJioPhone ? "0.75rem" : "0.9rem" }}>Payment</Typography>

          <Grid container spacing={0.8}>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Reg Fee" type="number" value={current.registrationFee} onChange={e => handleChange(activeIdx, "registrationFee", e.target.value)} InputProps={{ startAdornment: "₹" }} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Plan" type="number" value={current.planPrice} onChange={e => handleChange(activeIdx, "planPrice", e.target.value)} InputProps={{ startAdornment: "₹" }} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Discount" type="number" value={current.discount} onChange={e => handleChange(activeIdx, "discount", e.target.value)} InputProps={{ startAdornment: "₹" }} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Total" value={Math.max(0, current.totalAmount || 0)} disabled InputProps={{ startAdornment: "₹" }} sx={inputSx} /></Grid>

            {/* PAYMENT METHOD – 100% FULL WIDTH */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <FormControl fullWidth sx={selectSx}>
                <InputLabel shrink sx={{ whiteSpace: "nowrap", overflow: "visible", textOverflow: "clip", maxWidth: "none" }}>
                  Payment Method
                </InputLabel>
                <Select value={current.paymentMethod || ""} onChange={e => handleChange(activeIdx, "paymentMethod", e.target.value)}>
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {paymentMethods.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Start" type="date" value={current.startDate || ""} onChange={e => handleChange(activeIdx, "startDate", e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} /></Grid>
          </Grid>
        </Paper>

        {/* ACTION BUTTONS */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} mt={1.2} justifyContent="flex-end">
          <Button onClick={onCancel || (() => onSuccess(null))} fullWidth={isMobile}
            size={isJioPhone ? "small" : "medium"}
            sx={{ minHeight: 38, fontSize: isJioPhone ? "0.7rem" : "0.85rem" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submit} disabled={!globalGymId} fullWidth={isMobile}
            size={isJioPhone ? "small" : "medium"}
            sx={{
              minHeight: 38,
              background: "primary.main",
              "&:hover": { background: "#0069d9" },
              fontSize: isJioPhone ? "0.7rem" : "0.85rem"
            }}>
            {isEdit ? "Update" : multiple ? "Register All" : "Register"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}