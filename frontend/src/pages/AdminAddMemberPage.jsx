// src/pages/AdminAddMemberPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper,
  Alert,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  People,
  AttachMoney,
  Group,
  PersonAdd,
  Edit,
  Delete,
  Search,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import lightTheme from "../themes/lightTheme";
import MemberAddForm from "../components/MemberAddForm";
import {
  MemberRegistrationProvider,
  useMemberRegistration,
} from "../context/MemberRegistrationContext";

// Emerald Theme
const emeraldTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    primary: { main: "#059669", dark: "#047857" },
    secondary: { main: "#0d9488", dark: "#0f766e" },
    success: { main: "#10b981", light: "#34d399" },
    background: { default: "#f8fdfb", paper: "#ffffff" },
  },
});

const AdminLayout = ({ title, subtitle, children }) => (
  <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)", position: "relative", overflow: "hidden" }}>
    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", zIndex: 0 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          sx={{ position: "absolute", width: 3, height: 3, background: "rgba(255, 255, 255, 0.15)", borderRadius: "50%" }}
          animate={{ x: [0, 100, 0], y: [0, -100, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          style={{ left: `${10 + i * 8}%`, top: `${20 + i * 7}%` }}
        />
      ))}
    </Box>

    <Box sx={{ width: "100vw", maxWidth: "100%", mx: 0, px: 0, pt: { xs: 3, sm: 4, md: 6 }, pb: 6, position: "relative", zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, mb: 2, px: 3, py: 1.5, background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: "16px" }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #34d399, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <People sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>Members Dashboard</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2.25rem", md: "3.5rem" }, background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {title}
          </Typography>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}>{subtitle}</Typography>
        </Box>
      </motion.div>

      <Paper elevation={0} sx={{ width: "100vw", maxWidth: "100%", mx: 0, borderRadius: 0, overflow: "hidden", background: "white", p: { xs: 3, sm: 4, md: 5 } }}>
        <Fade in timeout={400}><Box>{children}</Box></Fade>
      </Paper>
    </Box>
  </Box>
);

const AdminAddMemberPageContent = () => {
  const {
    isLoading,
    apiError,
    successMessage,
    clearMessages,
    fetchMembers,
    searchMembers,
    addMember,
    deleteMember,
  } = useMemberRegistration();

  const [openDialog, setOpenDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Stable load function
  const loadMembers = useCallback(async () => {
    const data = await fetchMembers();
    setMembers(data);
  }, [fetchMembers]);

  // Fetch on mount only
  useEffect(() => {
    loadMembers();
  }, []); // ← FIXED: Empty deps

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim()) {
        const results = await searchMembers(searchTerm);
        setMembers(results);
      } else {
        loadMembers();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchMembers, loadMembers]);

  // Add success
  const handleAddSuccess = async (payload) => {
    try {
      await addMember(payload);
      await loadMembers();
      setOpenDialog(false);
    } catch (_) {}
  };

  // Delete
  const handleDelete = async (memberId) => {
    if (!window.confirm("Soft-delete this member?")) return;
    const ok = await deleteMember(memberId);
    if (ok) await loadMembers();
  };

  const getStatusColor = (status) => (status === "Paid" ? "success" : "warning");

  return (
    <AdminLayout title="Manage Members" subtitle="Real-time member management">
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", color: "white" }}>
              {successMessage}
            </Alert>
          </motion.div>
        )}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px", background: "linear-gradient(135deg, #ef4444, #f87171)" }}>
              {apiError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setOpenDialog(true)}
          size="large"
          sx={{
            borderRadius: "14px",
            fontWeight: 700,
            fontSize: "1.1rem",
            px: 6,
            py: 2,
            boxShadow: "0 8px 20px rgba(5, 150, 105, 0.25)",
            background: "linear-gradient(135deg, #059669, #047857)",
            "&:hover": { background: "linear-gradient(135deg, #047857, #065f46)" },
          }}
        >
          + Add Member
        </Button>
      </Box>

      <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 30px -8px rgba(0,0,0,0.1)", mx: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "2px solid #d1fae5" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #0d9488, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Group sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Members</Typography>
                <Typography variant="body2" color="text.secondary">{members.length} members</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.50", borderRadius: "12px", px: 3, py: 1.5, minWidth: { xs: "100%", sm: 280 }, border: "2px solid #d1fae5", "&:hover": { borderColor: "#059669" } }}>
              <Search sx={{ mr: 1.5, color: "text.secondary" }} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", width: "100%" }}
              />
            </Box>
          </Box>
        </Box>

        {isLoading && !members.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f0fdf4" }}>
                  {["Name", "Email", "Phone", "Plan", "Paid", "Method", "Slot", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.memberId} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #34d399)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <People sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Typography fontWeight={600}>{m.fullName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phoneNo}</TableCell>
                    <TableCell><Chip label={m.membershipPlan} size="small" color="primary" /></TableCell>
                    <TableCell sx={{ color: m.amountPaid >= m.totalAmount ? "success.main" : "warning.main" }}>
                      ₹{m.amountPaid?.toFixed(2) ?? "0"}
                    </TableCell>
                    <TableCell>{m.paymentMethod}</TableCell>
                    <TableCell>{m.timing || "—"}</TableCell>
                    <TableCell>
                      <Chip label={m.paymentStatus || "Pending"} color={getStatusColor(m.paymentStatus || "Pending")} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary"><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(m.memberId)} color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Typography>No members found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", boxShadow: "0 16px 35px rgba(0,0,0,0.15)", border: "2px solid #d1fae5" } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PersonAdd sx={{ color: "white" }} />
            </Box>
            Add New Member
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <MemberAddForm onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const AdminAddMemberPage = () => (
  <ThemeProvider theme={emeraldTheme}>
    <CssBaseline />
    <MemberRegistrationProvider>
      <AdminAddMemberPageContent />
    </MemberRegistrationProvider>
  </ThemeProvider>
);

export default AdminAddMemberPage;