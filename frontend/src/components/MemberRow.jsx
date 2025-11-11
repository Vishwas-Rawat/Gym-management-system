// src/components/MemberRow.jsx
import React from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  People,
  Visibility,
  Edit,
  Notifications,
  Refresh,
  Delete,
} from "@mui/icons-material";

const MemberRow = React.memo(
  ({ member, onDetail, onEdit, onNotify, onResend, onDelete }) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const isJioPhone = useMediaQuery("(max-width:280px)"); // Jio Phone 2

    const planText =
      member.membershipPlan ||
      (member.monthsPaid
        ? `${member.monthsPaid} mo${member.monthsPaid > 1 ? "s" : ""}${
            member.monthsFree ? ` + ${member.monthsFree}f` : ""
          }`
        : "—");

    const timing = member.workoutTimeSlot || member.timing || "—";

    const singleLine = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    };

    // ────── JIO PHONE 2 (≤ 280px) ──────
    if (isJioPhone) {
      return (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            p: 1,
            mb: 1.5,
            bgcolor: "background.paper",
            cursor: "pointer",
            fontSize: "12px",
          }}
          onClick={onDetail}
        >
          <Stack spacing={0.8}>
            {/* Name + Tiny Avatar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <People sx={{ color: "white", fontSize: 14 }} />
              </Box>
              <Typography fontWeight={600} sx={singleLine} fontSize="13px">
                {member.fullName}
              </Typography>
            </Box>

            {/* Email */}
            <Typography variant="caption" color="text.secondary" sx={singleLine}>
              {member.email}
            </Typography>

            {/* Phone */}
            <Typography variant="caption" color="text.secondary" sx={singleLine}>
              {member.phoneNo || member.phoneNumber || "—"}
            </Typography>

            {/* Plan & Timing */}
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              <Chip label={planText} size="small" color="primary" sx={{ fontSize: 10, py: 0.2 }} />
              {timing !== "—" && (
                <Chip label={timing} size="small" variant="outlined" sx={{ fontSize: 10, py: 0.2, ...singleLine }} />
              )}
            </Box>

            {/* HORIZONTAL ACTIONS – LEFT ALIGNED + SCROLLABLE */}
            <Stack
              direction="row"
              justifyContent="flex-start"
              spacing={0.3}
              sx={{
                flexWrap: "nowrap",
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                py: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="View">
                <IconButton size="small" color="primary" onClick={onDetail} sx={{ p: 0.8 }}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" color="secondary" onClick={onEdit} sx={{ p: 0.8 }}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notify">
                <IconButton size="small" color="warning" onClick={onNotify} sx={{ p: 0.8 }}>
                  <Notifications fontSize="small" />
                </IconButton>
              </Tooltip>
              {member.registrationStatus === "PENDING" && (
                <Tooltip title="Resend">
                  <IconButton size="small" color="info" onClick={onResend} sx={{ p: 0.8 }}>
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={onDelete} sx={{ p: 0.8 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      );
    }

    // ────── MOBILE CARD (281px – 600px) ──────
    if (isMobile) {
      return (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            mb: 2,
            bgcolor: "background.paper",
            cursor: "pointer",
          }}
          onClick={onDetail}
        >
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <People sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography fontWeight={600} sx={singleLine}>
                {member.fullName}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={singleLine}>
              {member.email}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={singleLine}>
              {member.phoneNo || member.phoneNumber || "—"}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={planText} size="small" color="primary" />
              {timing !== "—" && <Chip label={timing} size="small" variant="outlined" sx={singleLine} />}
            </Box>

            {/* HORIZONTAL LEFT-ALIGNED */}
            <Stack
              direction="row"
              justifyContent="flex-start"
              spacing={0.5}
              sx={{
                flexWrap: "nowrap",
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="View Details"><IconButton size="small" color="primary" onClick={onDetail}><Visibility fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Edit"><IconButton size="small" color="secondary" onClick={onEdit}><Edit fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Notify"><IconButton size="small" color="warning" onClick={onNotify}><Notifications fontSize="small" /></IconButton></Tooltip>
              {member.registrationStatus === "PENDING" && (
                <Tooltip title="Resend"><IconButton size="small" color="info" onClick={onResend}><Refresh fontSize="small" /></IconButton></Tooltip>
              )}
              <Tooltip title="Delete"><IconButton size="small" color="error" onClick={onDelete}><Delete fontSize="small" /></IconButton></Tooltip>
            </Stack>
          </Stack>
        </Box>
      );
    }

    // ────── DESKTOP TABLE (≥ 601px) ──────
    return (
      <TableRow hover onClick={onDetail} sx={{ cursor: "pointer" }}>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <People sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={600} sx={singleLine}>
              {member.fullName}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ maxWidth: 200, ...singleLine }}>{member.email}</TableCell>
        <TableCell sx={{ maxWidth: 140, ...singleLine }}>
          {member.phoneNo || member.phoneNumber || "—"}
        </TableCell>
        <TableCell>
          <Chip label={planText} size="small" color="primary" sx={{ minWidth: 80 }} />
        </TableCell>
        <TableCell sx={{ maxWidth: 180, ...singleLine }}>{timing}</TableCell>

        <TableCell
          align="center"
          sx={{
            whiteSpace: "nowrap",
            "& .MuiButtonBase-root": { mx: 0.25 },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View Details"><IconButton color="primary" size="small" onClick={onDetail}><Visibility fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Edit"><IconButton color="secondary" size="small" onClick={onEdit}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Notify"><IconButton color="warning" size="small" onClick={onNotify}><Notifications fontSize="small" /></IconButton></Tooltip>
          {member.registrationStatus === "PENDING" && (
            <Tooltip title="Resend"><IconButton color="info" size="small" onClick={onResend}><Refresh fontSize="small" /></IconButton></Tooltip>
          )}
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={onDelete}><Delete fontSize="small" /></IconButton></Tooltip>
        </TableCell>
      </TableRow>
    );
  }
);

export default MemberRow;