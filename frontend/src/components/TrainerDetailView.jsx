// src/components/TrainerDetailView.jsx
import React from "react";
import {
  Typography,
  Chip,
  Box,
  IconButton,
  Paper,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import {
  Close,
  Person,
  Phone,
  Email,
  Event,
  FitnessCenter,
  Work,
  AttachMoney,
  AccessTime,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const SectionHeader = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, mt: 1 }}>
    <Icon sx={{ color: "primary.main", fontSize: 24 }} />
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: "primary.dark",
        fontSize: "1.1rem",
      }}
    >
      {title}
    </Typography>
  </Box>
);

const InfoRow = ({ label, value, icon: Icon, highlight = false }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
      {Icon && <Icon sx={{ fontSize: 14 }} />} {label}
    </Typography>
    <Typography
      variant="body1"
      fontWeight={highlight ? 700 : 500}
      color={highlight ? "primary.main" : "text.primary"}
      sx={{ fontSize: "1rem" }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const TrainerDetailView = ({ trainer, onClose, onAssignMembers, style }) => {
  if (!trainer) return null;

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ bgcolor: "white", height: "100%", display: "flex", flexDirection: "column", ...style }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "rgba(0, 123, 255, 0.08)",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 123, 255, 0.15)",
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" fontWeight={800} color="primary.dark">
          Trainer Profile
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "primary.dark" }}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 3, overflowY: "auto", flexGrow: 1 }}>
        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={Person} title="Personal Information" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", mb: 3 }}>
            <Stack spacing={2}>
              <InfoRow label="Full Name" value={trainer.fullName} />
              <InfoRow label="Email" value={trainer.email} icon={Email} />
              <InfoRow label="Phone" value={trainer.phoneNo || trainer.phoneNumber} icon={Phone} />
            </Stack>
          </Paper>
        </motion.div>

        {/* Professional Info */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={Work} title="Professional Info" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", mb: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Specialization
                  </Typography>
                  <Chip
                    label={trainer.specialization || "General"}
                    sx={{
                      bgcolor: "success.light",
                      color: "success.main",
                      fontWeight: 700,
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: 32,
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Status
                  </Typography>
                  <Chip
                    label={(trainer.status || "FULL_TIME").replace("_", " ")}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ borderStyle: "dashed" }} />
              
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Experience</Typography>
                  <Typography variant="h6" fontWeight={600}>{trainer.experienceYears || 0} Years</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Gym</Typography>
                  <Typography variant="h6" fontWeight={600}>{trainer.gym?.gymName || trainer.gymName || "—"}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        {/* Availability & Salary */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={AccessTime} title="Availability & Salary" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", mb: 3 }}>
            <Stack spacing={2}>
              <InfoRow label="Availability" value={trainer.availability} icon={AccessTime} />
              <Divider sx={{ borderStyle: "dashed" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AttachMoney sx={{ fontSize: 16 }} /> Monthly Salary
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  ₹{Number(trainer.salary || 0).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </motion.div>

        {/* Record Info */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={Event} title="Record Info" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", bgcolor: "#f9fafb" }}>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Created At</Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {trainer.createdAt ? new Date(trainer.createdAt).toLocaleString() : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Updated At</Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {trainer.updatedAt ? new Date(trainer.updatedAt).toLocaleString() : "—"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Box>

      {onClose && (
        <Box sx={{ p: 3, borderTop: "1px solid #f3f4f6", bgcolor: "#f9fafb", flexShrink: 0, display: 'flex', gap: 2 }}>
          <Button
            onClick={onAssignMembers}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": { borderColor: "primary.dark", bgcolor: "rgba(0, 123, 255, 0.08)" },
              borderRadius: "10px",
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Assign Members
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              borderRadius: "10px",
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};
