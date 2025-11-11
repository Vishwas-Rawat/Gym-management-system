// src/components/MemberDetailModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
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
} from "@mui/icons-material";

const SectionTitle = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, mt: 2 }}>
    <Icon sx={{ color: "#059669", fontSize: { xs: 18, sm: 22 } }} />
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: "#059669",
        fontSize: { xs: "0.95rem", sm: "1.1rem" },
      }}
    >
      {title}
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

export default function MemberDetailModal({ open, onClose, member: rawMember }) {
  const isJioPhone = useMediaQuery("(max-width:280px)");

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

  const registrationFee = member.registrationFee ?? 0;
  const planPrice = member.planPrice ?? 0;
  const discount = member.discount ?? 0;
  const totalPaid = member.totalPaid ?? 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isJioPhone}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          border: "1px solid #d1fae5",
          m: 0,
          maxHeight: { xs: "100vh", sm: "90vh" },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, bgcolor: "#f0fdf4" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5"
            fontWeight={800}
            color="#059669"
            fontSize={{ xs: "1rem", sm: "1.25rem" }}
            noWrap
          >
            Member Profile
          </Typography>
          <IconButton onClick={onClose} size={isJioPhone ? "small" : "medium"}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 1.5, sm: 3 },
          py: 2,
          overflowY: "auto",
          bgcolor: "#fafcfa",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            borderRadius: 2,
            bgcolor: "#f8fdfb",
            border: "1px solid #d1fae5",
          }}
        >
          <Stack spacing={2}>

            {/* ---------- PERSONAL INFO ---------- */}
            <Box>
              <SectionTitle icon={Person} title="Personal Information" />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Full Name
                  </Typography>
                  <Typography
                    fontWeight={600}
                    fontSize={{ xs: "0.95rem", sm: "1.1rem" }}
                    noWrap
                    sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {member.fullName || "—"}
                  </Typography>
                </Box>

                {/* EMAIL – SINGLE LINE WITH ELLIPSIS */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Email
                  </Typography>
                  <Typography
                    fontSize={{ xs: "0.9rem", sm: "1rem" }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    <Email sx={{ fontSize: 16, color: "#059669", flexShrink: 0 }} />
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.email || "—"}
                    </Box>
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Phone
                  </Typography>
                  <Typography
                    fontSize={{ xs: "0.9rem", sm: "1rem" }}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <Phone sx={{ fontSize: 16, color: "#059669" }} />
                    {member.phoneNo || member.phoneNumber || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "#d1fae5" }} />

            {/* ---------- MEMBERSHIP PLAN ---------- */}
            <Box>
              <SectionTitle icon={CalendarToday} title="Membership Plan" />
              <Stack spacing={2}>
                {/* PLAN – VALUE ON NEXT LINE */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Plan
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={member.membershipPlan || "—"}
                      color="primary"
                      size={isJioPhone ? "small" : "medium"}
                      sx={{
                        fontWeight: 600,
                        height: { xs: 28, sm: 36 },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Months Paid
                  </Typography>
                  <Typography fontWeight={600} fontSize={{ xs: "0.9rem", sm: "1rem" }}>
                    {member.monthsPaid ?? "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Months Free
                  </Typography>
                  <Typography fontWeight={600} fontSize={{ xs: "0.9rem", sm: "1rem" }}>
                    {member.monthsFree ?? "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Start Date
                  </Typography>
                  <Typography fontSize={{ xs: "0.9rem", sm: "1rem" }}>
                    {formatDateOnly(member.startDate)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "#d1fae5" }} />

            {/* ---------- WORKOUT TIMING ---------- */}
            <Box>
              <SectionTitle icon={AccessTime} title="Workout Timing" />
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "#f0fdf4",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  fontWeight={700}
                  fontSize={{ xs: "1rem", sm: "1.25rem" }}
                  color="#059669"
                >
                  {timing}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ borderColor: "#d1fae5" }} />

            {/* ---------- PAYMENT DETAILS ---------- */}
            <Box>
              <SectionTitle icon={Payment} title="Payment Details" />
              <Stack spacing={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={{ xs: "0.8rem", sm: "0.9rem" }}>
                    Registration Fee
                  </Typography>
                  <Typography fontWeight={600} fontSize={{ xs: "0.85rem", sm: "1rem" }}>
                    ₹{registrationFee.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={{ xs: "0.8rem", sm: "0.9rem" }}>
                    Plan Price
                  </Typography>
                  <Typography fontWeight={600} fontEmail= {{ xs: "0.85rem", sm: "1rem" }}>
                    ₹{planPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={{ xs: "0.8rem", sm: "0.9rem" }}>
                    Discount
                  </Typography>
                  <Typography fontWeight={600} color="error.main" fontSize={{ xs: "0.85rem", sm: "1rem" }}>
                    -₹{discount.toFixed(2)}
                  </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={700} fontSize={{ xs: "0.9rem", sm: "1rem" }}>
                    Total Paid
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="#059669"
                    fontSize={{ xs: "1rem", sm: "1.1rem" }}
                  >
                    ₹{totalPaid.toFixed(2)}
                  </Typography>
                </Box>

                {/* PAYMENT METHOD – VALUE ON NEXT LINE */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Payment Method
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={member.paymentMethod || "—"}
                      color="info"
                      size={isJioPhone ? "small" : "medium"}
                      sx={{
                        fontWeight: 600,
                        height: { xs: 28, sm: 36 },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "#d1fae5" }} />

            {/* ---------- RECORD INFO ---------- */}
            <Box>
              <SectionTitle icon={CalendarToday} title="Record Info" />
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Created At
                  </Typography>
                  <Typography fontSize={{ xs: "0.8rem", sm: "0.9rem" }} sx={{ fontFamily: "monospace" }}>
                    {formatDateOnly(member.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    Updated At
                  </Typography>
                  <Typography fontSize={{ xs: "0.8rem", sm: "0.9rem" }} sx={{ fontFamily: "monospace" }}>
                    {formatDateOnly(member.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 2,
          bgcolor: "#f8fdfb",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size={isJioPhone ? "medium" : "large"}
          fullWidth={isJioPhone}
          sx={{
            minHeight: 44,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}