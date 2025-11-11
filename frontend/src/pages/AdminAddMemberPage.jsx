// src/pages/AdminAddMemberPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
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
  Paper,
  Alert,
  CircularProgress,
  Typography,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import {
  PersonAdd,
  Search,
  Group,
  People,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import lightTheme from "../themes/lightTheme";
import MemberAddForm from "../components/MemberAddForm";
import MemberDetailModal from "../components/MemberDetailModal";
import { MemberRegistrationProvider, useMemberRegistration } from "../context/MemberRegistrationContext";
import MemberRow from "../components/MemberRow";

const emeraldTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    primary: { main: "#059669", dark: "#047857" },
    background: { default: "#f8fdfb", paper: "#ffffff" },
  },
});

const AdminLayout = ({ title, subtitle, children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
      position: "relative",
      overflow: "hidden",
      width: "100%",
    }}
  >
    {/* Background Animation */}
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 100, 0], y: [0, -100, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
            left: `${10 + i * 8}%`,
            top: `${20 + i * 7}%`,
          }}
        />
      ))}
    </Box>

    {/* Main Content */}
    <Box
      sx={{
        width: "100%",
        pt: { xs: 3, sm: 4, md: 6 },
        pb: 6,
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              px: 3,
              py: 1.5,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "16px",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #34d399, #10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <People sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
              Members Dashboard
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.25rem", md: "3.5rem" },
              background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>{subtitle}</Typography>
        </Box>
      </motion.div>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: { xs: 0, md: "24px" },
          overflow: "hidden",
          background: "white",
          p: { xs: 3, sm: 4, md: 5 },
          boxShadow: { md: "0 20px 40px rgba(0,0,0,0.08)" },
        }}
      >
        <Box>{children}</Box>
      </Paper>
    </Box>
  </Box>
);

// GYM DROPDOWN USING CONTEXT
const SelectGym = ({ onGymChange }) => {
  const { gyms, isLoading, fetchGyms } = useMemberRegistration();
  const [gymId, setGymId] = useState("all");

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const handleChange = (e) => {
    const value = e.target.value;
    setGymId(value);
    onGymChange(value === "all" ? null : value);
  };

  if (isLoading) {
    return (
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Gyms</InputLabel>
        <Select value="" disabled label="Gyms">
          <MenuItem disabled>Loading...</MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (!gyms.length) {
    return (
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Gyms</InputLabel>
        <Select value="all" disabled label="Gyms">
          <MenuItem value="all">No gyms</MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel>Gyms</InputLabel>
      <Select
        value={gymId}
        onChange={handleChange}
        label="Gyms"
        sx={{
          borderRadius: "12px",
          bgcolor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
        MenuProps={{
          PaperProps: {
            sx: { borderRadius: "12px", mt: 0.5, overflow: "hidden" },
          },
        }}
      >
        <MenuItem value="all">All Gyms</MenuItem>
        {gyms.map((gym) => (
          <MenuItem key={gym.gymId} value={gym.gymId}>
            {gym.gymName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const AdminAddMemberPageContent = () => {
  const {
    isLoading,
    successMessage,
    apiError,
    clearMessages,
    fetchMembers,
    searchMembers,
    addMultipleMembers,
    deleteMember,
    updateMember,
    resendInvite,
    getMemberDetail,
    getMemberById,
  } = useMemberRegistration();

  const isMobile = useMediaQuery("(max-width:600px)");

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const [originalMembers, setOriginalMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Load members
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await fetchMembers(selectedGymId);
      if (mounted) {
        setOriginalMembers(data || []);
        setMembers(data || []);
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchMembers, selectedGymId]);

  // Search + Gym Filter
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    const term = searchTerm.trim();

    if (!term) {
      setLocalSearchResults([]);
      setMembers(originalMembers);
      setIsSearchingAPI(false);
      return;
    }

    const filtered = originalMembers.filter(
      (m) =>
        (m.fullName?.toLowerCase().includes(term.toLowerCase()) ||
          m.email?.toLowerCase().includes(term.toLowerCase()) ||
          m.phoneNo?.includes(term) ||
          m.phoneNumber?.includes(term))
    );
    setLocalSearchResults(filtered);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAPI(true);
      try {
        const results = await searchMembers(term, selectedGymId);
        setMembers(results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearchingAPI(false);
      }
    }, 600);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, originalMembers, searchMembers, selectedGymId]);

  const displayMembers = searchTerm.trim() ? localSearchResults : members;

  const handleGymChange = (gymId) => {
    setSelectedGymId(gymId);
  };

  const handleAddSuccess = async (payloadArray) => {
    const arr = Array.isArray(payloadArray) ? payloadArray : [payloadArray];
    await addMultipleMembers(arr);
    setOpenDialog(false);
    clearMessages();
  };

  const openEdit = async (memberId) => {
    const mem = await getMemberById(memberId);
    if (mem) {
      setEditingMember(mem);
      setOpenEditDialog(true);
    }
  };

  const openDetail = async (memberId) => {
    const mem = await getMemberDetail(memberId);
    if (mem) {
      setSelectedMember(mem);
      setOpenDetailModal(true);
    }
  };

  const handleEditSuccess = async (payload) => {
    await updateMember(editingMember.id, payload);
    setOpenEditDialog(false);
    setEditingMember(null);
    clearMessages();
  };

  const handleResend = async (userId) => {
    if (!window.confirm("Resend registration link?")) return;
    await resendInvite(userId);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Soft-delete this member?")) return;
    const ok = await deleteMember(memberId);
    if (ok) {
      const updated = await fetchMembers(selectedGymId);
      setOriginalMembers(updated || []);
      setMembers(updated || []);
    }
  };

  const sendPaymentNotification = async (memberId) => {
    if (!window.confirm("Send payment reminder?")) return;
    alert("Payment notification sent!");
  };

  const handleCancelAdd = () => {
    setOpenDialog(false);
    clearMessages();
  };

  const handleCancelEdit = () => {
    setOpenEditDialog(false);
    setEditingMember(null);
    clearMessages();
  };

  const renderMembersList = () => {
    if (isLoading || (isSearchingAPI && searchTerm.trim())) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#059669" }} />
        </Box>
      );
    }

    if (!displayMembers.length) {
      return (
        <Typography align="center" sx={{ py: 4, color: "text.secondary" }}>
          {searchTerm.trim()
            ? "No members found"
            : selectedGymId
            ? "No members in this gym"
            : "No members yet"}
        </Typography>
      );
    }

    if (isMobile) {
      return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          {displayMembers.map((m) => (
            <MemberRow
              key={m.memberId || m.id}
              member={m}
              onDetail={() => openDetail(m.memberId || m.id)}
              onEdit={() => openEdit(m.memberId || m.id)}
              onNotify={() => sendPaymentNotification(m.memberId || m.id)}
              onResend={() => handleResend(m.userId || m.memberId)}
              onDelete={() => handleDelete(m.memberId || m.id)}
            />
          ))}
        </Box>
      );
    }

    return (
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0fdf4" }}>
              {["Full Name", "Email", "Phone Number", "Plan", "Workout Timing", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700, color: "#059669" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayMembers.map((m) => (
              <MemberRow
                key={m.memberId || m.id}
                member={m}
                onDetail={() => openDetail(m.memberId || m.id)}
                onEdit={() => openEdit(m.memberId || m.id)}
                onNotify={() => sendPaymentNotification(m.memberId || m.id)}
                onResend={() => handleResend(m.userId || m.memberId)}
                onDelete={() => handleDelete(m.memberId || m.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <AdminLayout title="Manage Members" subtitle="Real-time member management">
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                color: "white",
              }}
            >
              {successMessage}
            </Alert>
          </motion.div>
        )}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {apiError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          size="small"
          sx={{
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            px: { xs: 2, sm: 3 },
            py: 1,
            minHeight: 36,
            background: "linear-gradient(135deg, #059669, #047857)",
            boxShadow: "0 4px 12px rgba(5,150,105,0.2)",
            "&:hover": {
              background: "linear-gradient(135deg, #047857, #03694f)",
              boxShadow: "0 6px 16px rgba(5,150,105,0.3)",
            },
          }}
        >
          Add Member
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 30px -8px rgba(0,0,0,0.1)",
          mx: "auto",
          maxWidth: "100%",
          mb: 4,
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "2px solid #d1fae5" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.8, sm: 1.5 },
                flexWrap: "wrap",
                maxWidth: { xs: "100%", sm: "auto" },
              }}
            >
              <Box
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #0d9488, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Group sx={{ color: "white", fontSize: { xs: 16, sm: 20 } }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  Members
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayMembers.length} members
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 1.5, sm: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <SelectGym onGymChange={handleGymChange} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "grey.50",
                  borderRadius: "12px",
                  px: { xs: 1.5, sm: 3 },
                  py: 1.2,
                  minWidth: { xs: "100%", sm: 280 },
                  border: "2px solid #d1fae5",
                  "&:hover": { borderColor: "#059669" },
                }}
              >
                <Search sx={{ mr: 1, color: "text.secondary", fontSize: { xs: 18, sm: 20 } }} />
                <InputBase
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: "100%", fontSize: { xs: "0.875rem", sm: "1rem" } }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {renderMembersList()}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCancelAdd}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", boxShadow: "0 16px 35px rgba(0,0,0,0.15)", border: "2px solid #d1fae5" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Member(s)</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <MemberAddForm onSuccess={handleAddSuccess} multiple onCancel={handleCancelAdd} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", boxShadow: "0 16px 35px rgba(0,0,0,0.15)", border: "2 2px solid #d1fae5" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Member</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {editingMember && (
            <MemberAddForm onSuccess={handleEditSuccess} member={editingMember} onCancel={handleCancelEdit} />
          )}
        </DialogContent>
      </Dialog>

      <MemberDetailModal open={openDetailModal} onClose={() => setOpenDetailModal(false)} member={selectedMember} />
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