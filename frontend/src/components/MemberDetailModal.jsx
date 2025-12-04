// src/components/MemberDetailModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Divider,
  Box,
  IconButton,
  Paper,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  CalendarToday,
  AccessTime,
  Payment,
  Person,
  Phone,
  Email,
  Event,
  CreditCard,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const SectionHeader = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, mt: 1 }}>
    <Icon sx={{ color: "#10b981", fontSize: 24 }} />
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: "#065f46",
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

/* ------------------------------------------------------------------ */
/*  Helper – normalises the two possible shapes we receive            */
/* ------------------------------------------------------------------ */
const normaliseMember = (raw) => {
  if (!raw) return {};
  if (raw.message) return raw;

  return {
    ...raw,
    registrationFee: Number(raw.registrationFee || 0),
    planPrice: Number(raw.planPrice || 0),
    discount: Number(raw.discount || 0),
    totalPaid: Number(raw.totalAmount || raw.totalPaid || 0),
    monthsPaid: Number(raw.monthsPaid || 0),
    monthsFree: Number(raw.monthsFree || 0),
  };
};

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

export const MemberDetailView = ({ member: rawMember, onClose, style }) => {
  if (!rawMember) return null;

  const member = normaliseMember(rawMember);

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const timing = member.timing || member.workoutTimeSlot || "Not set";
  const planText = member.membershipPlan || (member.monthsPaid ? `${member.monthsPaid} Months` : "—");

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
          bgcolor: "#f0fdf4",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #d1fae5",
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" fontWeight={800} color="#065f46">
          Member Profile
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "#065f46" }}>
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
              <InfoRow label="Full Name" value={member.fullName} />
              <InfoRow label="Email" value={member.email} icon={Email} />
              <InfoRow label="Phone" value={member.phoneNo || member.phoneNumber} icon={Phone} />
            </Stack>
          </Paper>
        </motion.div>

        {/* Membership Plan */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={CalendarToday} title="Membership Plan" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                Current Plan
              </Typography>
              <Chip
                label={planText}
                sx={{
                  bgcolor: "#10b981",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: 32,
                }}
              />
            </Box>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">Months Paid</Typography>
                <Typography variant="h6" fontWeight={600}>{member.monthsPaid || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Months Free</Typography>
                <Typography variant="h6" fontWeight={600}>{member.monthsFree || 0}</Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 2 }}>
                <InfoRow label="Start Date" value={formatDateOnly(member.startDate)} icon={Event} />
            </Box>
          </Paper>
        </motion.div>

        {/* Workout Timing */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={AccessTime} title="Workout Timing" />
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: "12px",
              borderColor: "#d1fae5",
              bgcolor: "#f0fdf4",
              textAlign: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#047857">
              {timing}
            </Typography>
          </Paper>
        </motion.div>

        {/* Payment Details */}
        <motion.div variants={itemVariants}>
          <SectionHeader icon={Payment} title="Payment Details" />
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderColor: "#e5e7eb", mb: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Registration Fee</Typography>
                <Typography variant="body1" fontWeight={600}>₹{member.registrationFee?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Plan Price</Typography>
                <Typography variant="body1" fontWeight={600}>₹{member.planPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Discount</Typography>
                <Typography variant="body1" fontWeight={600} color="error.main">-₹{member.discount?.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ borderStyle: "dashed" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={700} color="#047857">Total Paid</Typography>
                <Typography variant="h6" fontWeight={700} color="#047857">₹{member.totalPaid?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <InfoRow label="Payment Method" value={member.paymentMethod} icon={CreditCard} />
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
                  {new Date(member.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Updated At</Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {new Date(member.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Box>

      {onClose && (
        <Box sx={{ p: 3, borderTop: "1px solid #f3f4f6", bgcolor: "#f9fafb", flexShrink: 0 }}>
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#6366f1", // Indigo color from the image
              "&:hover": { bgcolor: "#4f46e5" },
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

export default function MemberDetailModal({ open, onClose, member }) {
  const isMobile = useMediaQuery("(max-width:600px)"); // Keep if needed for Dialog sizing, otherwise remove

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: "16px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          overflow: "hidden",
        },
      }}
    >
      <MemberDetailView member={member} onClose={onClose} />
    </Dialog>
  );
}