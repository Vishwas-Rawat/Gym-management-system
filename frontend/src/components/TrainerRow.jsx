// src/components/TrainerRow.jsx
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
  Avatar,
} from "@mui/material";

import { Visibility, Edit, Send, Delete, Person, FitnessCenter } from "@mui/icons-material";

// ---- Framer Motion ----
import { motion } from "framer-motion";

// Motion components for readability
const MotionBox = motion(Box);
const MotionTableRow = motion(TableRow);

// ---- Animation Variants ----
const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.01 },
  exit: { opacity: 0, y: -8 },
};

const buttonVariants = {
  hover: { scale: 1.15 },
  tap: { scale: 0.9 },
};

const TrainerRow = React.memo(
  ({ trainer, onDetail, onEdit, onResend, onDelete, index, isSelected }) => {
    const isMobile = useMediaQuery("(max-width:900px)");


    const singleLine = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    };

    // --------------------- MOBILE VIEW ---------------------
    if (isMobile) {
      return (
        <MotionBox
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
          sx={{
            border: isSelected ? "2px solid #007BFF" : "1px solid #E5E7EB",
            borderRadius: "12px",
            p: 2,
            mb: 2,
            bgcolor: isSelected ? "rgba(0, 123, 255, 0.08)" : "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            cursor: "pointer",
          }}
          onClick={onDetail}
        >
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                }}
              >
                <FitnessCenter sx={{ color: "white" }} />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600} sx={singleLine}>
                  {trainer.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={singleLine}>
                  {trainer.email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {trainer.phoneNo || "—"}
              </Typography>

              <Chip
                label={trainer.specialization || "General"}
                size="small"
                sx={{
                  bgcolor: "success.light",
                  color: "success.main",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              Exp: {trainer.experienceYears ? `${trainer.experienceYears} Years` : "—"}
            </Typography>

            {/* Mobile action buttons */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <IconButton size="small" sx={{ color: "info.main", bgcolor: "rgba(23, 162, 184, 0.08)" }} onClick={onDetail}>
                  <Visibility fontSize="small" />
                </IconButton>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <IconButton size="small" sx={{ color: "warning.main", bgcolor: "#fffbeb" }} onClick={onEdit}>
                  <Edit fontSize="small" />
                </IconButton>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <IconButton size="small" sx={{ color: "success.main", bgcolor: "success.light" }} onClick={onResend}>
                  <Send fontSize="small" />
                </IconButton>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <IconButton size="small" sx={{ color: "error.main", bgcolor: "#fef2f2" }} onClick={onDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              </motion.div>
            </Stack>
          </Stack>
        </MotionBox>
      );
    }

    // --------------------- DESKTOP VIEW ---------------------
    return (
      <MotionTableRow
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        layout
        onClick={onDetail}
        sx={{
          cursor: "pointer",
          bgcolor: isSelected ? "rgba(0, 123, 255, 0.08)" : "inherit",
          "&:hover": { bgcolor: isSelected ? "rgba(0, 123, 255, 0.15)" : "#f9fafb" },
          transition: "background-color 0.2s",
        }}
      >
        <TableCell sx={{ py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }}>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "primary.main",
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                }}
              >
                <FitnessCenter sx={{ color: "white", fontSize: 20 }} />
              </Avatar>
            </motion.div>

            <Typography fontWeight={600} sx={{ color: "text.primary", ...singleLine }}>
              {trainer.fullName}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ color: "text.secondary", ...singleLine }}>{trainer.email}</TableCell>

        <TableCell sx={{ color: "text.secondary", ...singleLine }}>
          {trainer.phoneNo || "—"}
        </TableCell>

        <TableCell>
          <Chip
            label={trainer.specialization || "General"}
            size="small"
            sx={{
              bgcolor: "success.light",
              color: "success.main",
              fontWeight: 600,
              borderRadius: "6px",
              fontSize: "0.8rem",
              height: 26,
            }}
          />
        </TableCell>

        <TableCell sx={{ color: "text.secondary", ...singleLine }}>
          {trainer.experienceYears ? `${trainer.experienceYears} Yrs` : "—"}
        </TableCell>

        {/* Action buttons */}
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="View">
                <IconButton size="small" sx={{ color: "info.main" }} onClick={onDetail}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Edit">
                <IconButton size="small" sx={{ color: "warning.main" }} onClick={onEdit}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Resend Invite">
                <IconButton size="small" sx={{ color: "success.main" }} onClick={onResend}>
                  <Send fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Delete">
                <IconButton size="small" sx={{ color: "error.main" }} onClick={onDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>
          </Stack>
        </TableCell>
      </MotionTableRow>
    );
  }
);

export default TrainerRow;
