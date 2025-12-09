// src/components/TrainerAddForm.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Divider, Stack, Button, Typography, IconButton, Paper, Tabs, Tab,
  TabScrollButton, CircularProgress, Alert, AlertTitle, useMediaQuery
} from "@mui/material";
import { Add, Delete, ChevronLeft, ChevronRight, FitnessCenter } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api, { userApi } from "../services/api";
import { motion } from "framer-motion";

const statuses = ["FULL_TIME", "PART_TIME", "CONTRACT", "ON_LEAVE"];

const emptyTrainer = {
  fullName: "",
  email: "",
  phoneNo: "",
  specialization: "",
  experienceYears: "",
  availability: "",
  salary: "",
  status: "FULL_TIME",
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

export default function TrainerAddForm({ onSuccess, multiple = false, trainer = null, onCancel }) {
  const navigate = useNavigate();
  const isEdit = !!trainer;

  const isJioPhone = useMediaQuery("(max-width:280px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  const [trainers, setTrainers] = useState([]);
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
        const response = await userApi.get("/gym/my-gyms");
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
    if (isEdit && trainer) {
      const init = {
        ...emptyTrainer,
        fullName: trainer.fullName ?? "",
        email: trainer.email ?? "",
        phoneNo: trainer.phoneNo || trainer.phoneNumber || "",
        specialization: trainer.specialization ?? "",
        experienceYears: trainer.experienceYears ?? "",
        availability: trainer.availability ?? "",
        salary: trainer.salary ?? "",
        status: trainer.status ?? "FULL_TIME",
      };

      setTrainers([init]);
      // If editing, we might want to set the gym ID from the trainer if available
      // But for now we let the user select or keep it global if editing implies moving gyms?
      // Usually edit keeps the gym. Let's assume globalGymId handles it or we set it.
      const gId = trainer.gymId || trainer.gym?.gymId;
      if (gId) setGlobalGymId(String(gId));
    } else {
      setTrainers([emptyTrainer]);
      setGlobalGymId("");
    }
  }, [isEdit, trainer]);

  useEffect(() => {
    setTrainers(prev => prev.map(t => ({ ...t, gymId: globalGymId })));
  }, [globalGymId]);

  const handleChange = useCallback((idx, field, value) => {
    setTrainers(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }, []);

  const addTrainer = useCallback(() => {
    setTrainers(prev => [...prev, { ...emptyTrainer, gymId: globalGymId }]);
    setActiveIdx(trainers.length);
  }, [globalGymId, trainers.length]);

  const removeTrainer = useCallback(idx => {
    if (trainers.length === 1) return;
    setTrainers(prev => prev.filter((_, i) => i !== idx));
    setActiveIdx(prev => prev >= trainers.length - 1 ? trainers.length - 2 : prev);
  }, [trainers.length]);

  const submit = useCallback(() => {
    const payload = multiple || trainers.length > 1 ? trainers : trainers[0];
    const required = ["fullName", "email", "phoneNo", "specialization", "status"];

    if (!globalGymId) { alert("Please select a gym before submitting."); return; }

    for (const t of Array.isArray(payload) ? payload : [payload]) {
      const missing = required.filter(f => !t[f]);
      if (missing.length) { alert(`Trainer ${trainers.indexOf(t) + 1} missing: ${missing.join(", ")}`); return; }
    }

    const final = (Array.isArray(payload) ? payload : [payload]).map(t => ({
      fullName: t.fullName,
      email: t.email,
      phoneNo: t.phoneNo,
      gymId: Number(globalGymId),
      specialization: t.specialization,
      experienceYears: Number(t.experienceYears || 0),
      availability: t.availability,
      salary: Number(t.salary || 0),
      status: t.status,
    }));

    onSuccess(isEdit ? { trainerId: trainer.id || trainer.trainerId, ...final[0] } : (multiple || trainers.length > 1 ? final : final[0]));
  }, [globalGymId, trainers, multiple, onSuccess, isEdit, trainer]);

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

  const getTabLabel = useCallback((t, idx) => t.fullName?.trim() || `T${idx + 1}`, []);
  const current = trainers[activeIdx] || {};

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
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
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
            "& .MuiTabs-indicator": { height: 2.5, borderRadius: "2.5px 2.5px 0 0", bgcolor: "primary.main" },
            "& .MuiTab-root": { minHeight: isJioPhone ? 34 : 38, fontSize: isJioPhone ? "0.68rem" : "0.85rem", py: 0.4 }
          }}>
          {trainers.map((t, idx) => (
            <Tab key={idx}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
                  <span>{getTabLabel(t, idx)}</span>
                  {multiple && trainers.length > 1 && (
                    <IconButton size="small" color="error"
                      onClick={e => { e.stopPropagation(); removeTrainer(idx); }} sx={{ p: 0.2 }}>
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
            <Tab icon={<Add />} label="Add" onClick={addTrainer}
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
            {multiple ? getTabLabel(current, activeIdx) : isEdit ? "Edit Trainer" : "New Trainer"}
          </Typography>

          {/* PERSONAL INFO */}
          <Grid container spacing={isJioPhone ? 0.8 : 1.2}>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Full Name" value={current.fullName || ""} onChange={e => handleChange(activeIdx, "fullName", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Email" type="email" value={current.email || ""} onChange={e => handleChange(activeIdx, "email", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Phone" value={current.phoneNo || ""} onChange={e => handleChange(activeIdx, "phoneNo", e.target.value)} sx={inputSx} inputProps={{ maxLength: 10 }} /></Grid>
          </Grid>

          <Divider sx={{ my: 1.2 }} />
          <Typography variant="subtitle2" sx={{ mb: 0.8, color: "primary.main", fontSize: isJioPhone ? "0.75rem" : "0.9rem" }}>Professional Info</Typography>

          <Grid container spacing={isJioPhone ? 0.8 : 1.2}>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField required fullWidth label="Specialization" value={current.specialization || ""} onChange={e => handleChange(activeIdx, "specialization", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Experience (Years)" type="number" value={current.experienceYears || ""} onChange={e => handleChange(activeIdx, "experienceYears", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}><TextField fullWidth label="Availability (e.g. Mon-Fri 6AM-10PM)" value={current.availability || ""} onChange={e => handleChange(activeIdx, "availability", e.target.value)} sx={inputSx} /></Grid>
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}><TextField fullWidth label="Salary" type="number" value={current.salary || ""} onChange={e => handleChange(activeIdx, "salary", e.target.value)} InputProps={{ startAdornment: "₹" }} sx={inputSx} /></Grid>
            
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
              <FormControl fullWidth sx={selectSx}>
                <InputLabel shrink>Status</InputLabel>
                <Select value={current.status || "FULL_TIME"} onChange={e => handleChange(activeIdx, "status", e.target.value)}>
                  {statuses.map(s => <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
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
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              fontSize: isJioPhone ? "0.7rem" : "0.85rem"
            }}>
            {isEdit ? "Update" : multiple ? "Register All" : "Register"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
