// src/pages/AdminAddMemberPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
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
  IconButton,
} from "@mui/material";
import {
  PersonAdd,
  Search,
  Group,
  People,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import lightTheme from "../themes/lightTheme";
import MemberAddForm from "../components/MemberAddForm";
import { MemberDetailView } from "../components/MemberDetailModal";
import { MemberRegistrationProvider, useMemberRegistration } from "../context/MemberRegistrationContext";
import MemberRow from "../components/MemberRow";

const emeraldTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    primary: { main: "#10b981", dark: "#059669", light: "#34d399" },
    background: { default: "#f0fdf4", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

const AdminLayout = ({ title, subtitle, children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#0f766e", // Darker teal background
      backgroundImage: "linear-gradient(135deg, #0f766e 0%, #047857 100%)",
      pb: 6,
      overflowX: "hidden", // Prevent horizontal scroll during transitions
    }}
  >
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, pt: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 6, color: "white" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            mb: 2,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <People fontSize="small" />
          <Typography variant="subtitle2" fontWeight={600}>
            Members Dashboard
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: "-0.02em" }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
          {subtitle}
        </Typography>
      </Box>

      {children}
    </Box>
  </Box>
);

// GYM DROPDOWN
const SelectGym = ({ onGymChange }) => {
  const { gyms, fetchGyms } = useMemberRegistration();
  const [gymId, setGymId] = useState("all");

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  const handleChange = (e) => {
    const value = e.target.value;
    setGymId(value);
    onGymChange(value === "all" ? null : value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="gym-select-label">Gyms</InputLabel>
      <Select
        labelId="gym-select-label"
        value={gymId}
        label="Gyms"
        onChange={handleChange}
        sx={{
          bgcolor: "white",
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
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
    sendPaymentReminder,
    getMemberDetail,
    getMemberById,
  } = useMemberRegistration();

  const isMobile = useMediaQuery("(max-width:900px)"); // Treat tablets as mobile for split view

  // Side Panel State
  const [sidePanel, setSidePanel] = useState({
    open: false,
    view: "none", // 'add', 'edit', 'detail'
    data: null,
  });

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

  const closePanel = () => {
    setSidePanel({ open: false, view: "none", data: null });
    clearMessages();
  };

  const handleAddSuccess = async (payloadArray) => {
    const arr = Array.isArray(payloadArray) ? payloadArray : [payloadArray];
    await addMultipleMembers(arr);
    closePanel();
  };

  const handleEditSuccess = async (payload) => {
    if (sidePanel.data) {
      await updateMember(sidePanel.data.id, payload);
      closePanel();
    }
  };

  const openAddMember = () => {
    setSidePanel({ open: true, view: "add", data: null });
  };

  const openEdit = async (memberId) => {
    const mem = await getMemberById(memberId);
    if (mem) {
      setSidePanel({ open: true, view: "edit", data: mem });
    }
  };

  const openDetail = async (memberId) => {
    if (!memberId) return;
    const mem = await getMemberDetail(memberId);
    if (mem) {
      setSidePanel({ open: true, view: "detail", data: mem });
    }
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

  const handlePaymentReminder = async (memberId) => {
    if (!window.confirm("Send payment reminder to this member?")) return;
    await sendPaymentReminder(memberId);
  };

  const renderMembersList = () => {
    if (isLoading || (isSearchingAPI && searchTerm.trim())) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#10b981" }} />
        </Box>
      );
    }

    if (!displayMembers.length) {
      return (
        <Typography align="center" sx={{ py: 8, color: "text.secondary", fontSize: "1.1rem" }}>
          {searchTerm.trim()
            ? "No members found matching your search."
            : selectedGymId
            ? "No members found in this gym."
            : "No members added yet."}
        </Typography>
      );
    }

    if (isMobile) {
      return (
        <Box sx={{ p: 2 }}>
          <AnimatePresence>
            {displayMembers.map((m, index) => {
               const id = m.memberId || m.id || m.gymMemberId; 
               const isSelected = sidePanel.open && sidePanel.data && (sidePanel.data.memberId === id || sidePanel.data.id === id);
               return (
                <MemberRow
                  key={id || index}
                  member={m}
                  index={index}
                  isSelected={isSelected}
                  onDetail={() => openDetail(id)}
                  onEdit={() => openEdit(id)}
                  onPaymentReminder={() => handlePaymentReminder(id)}
                  onResend={() => handleResend(m.userId || id)}
                  onDelete={() => handleDelete(id)}
                />
              );
            })}
          </AnimatePresence>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Full Name", "Email", "Phone Number", "Plan", "Workout Timing", "Actions"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 700,
                    color: "#047857",
                    bgcolor: "#f0fdf4",
                    borderBottom: "2px solid #d1fae5",
                    py: 2,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody component={motion.tbody} layout>
            <AnimatePresence>
              {displayMembers.map((m, index) => {
                const id = m.memberId || m.id || m.gymMemberId;
                const isSelected = sidePanel.open && sidePanel.data && (sidePanel.data.memberId === id || sidePanel.data.id === id);
                return (
                  <MemberRow
                    key={id || index}
                    member={m}
                    index={index}
                    isSelected={isSelected}
                    onDetail={() => openDetail(id)}
                    onEdit={() => openEdit(id)}
                    onPaymentReminder={() => handlePaymentReminder(id)}
                    onResend={() => handleResend(m.userId || id)}
                    onDelete={() => handleDelete(id)}
                  />
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <AdminLayout title="Manage Members" subtitle="Real-time member management">
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {successMessage}
            </Alert>
          </motion.div>
        )}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {apiError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPLIT SCREEN CONTAINER */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 2 }}>
        
        {/* LEFT PANEL: MEMBER LIST */}
        <motion.div
          layout
          initial={false}
          animate={{
            width: sidePanel.open ? (isMobile ? "100%" : "60%") : "100%",
            x: sidePanel.open && isMobile ? "-100%" : "0%",
            opacity: sidePanel.open && isMobile ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ flexShrink: 0, width: "100%" }}
        >
          <Paper
            sx={{
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              borderRadius: "24px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
              minHeight: "70vh",
            }}
          >
            {/* TOOLBAR */}
            <Box
              sx={{
                p: 4,
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: { xs: "column", lg: sidePanel.open ? "column" : "row", xl: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: sidePanel.open ? "stretch" : "center", xl: "center" },
                gap: 3,
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    bgcolor: "#ecfdf5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                  }}
                >
                  <Group sx={{ fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    All Members
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {displayMembers.length} members found
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, flexWrap: "wrap" }}>
                <SelectGym onGymChange={handleGymChange} />
                
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#f9fafb",
                    borderRadius: "12px",
                    px: 2.5,
                    py: 1.5,
                    border: "1px solid #e5e7eb",
                    flexGrow: 1,
                    minWidth: { xs: "100%", sm: "250px" },
                    maxWidth: { xs: "100%", sm: "350px" },
                    "&:focus-within": { borderColor: "#10b981", boxShadow: "0 0 0 4px rgba(16,185,129,0.1)" },
                  }}
                >
                  <Search sx={{ color: "text.secondary", mr: 1.5, fontSize: 24 }} />
                  <InputBase
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: "100%", fontSize: "1.05rem" }}
                  />
                </Box>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={openAddMember}
                    sx={{
                      bgcolor: "#059669",
                      "&:hover": { bgcolor: "#047857" },
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add Member
                  </Button>
                </motion.div>
              </Box>
            </Box>

            {renderMembersList()}
          </Paper>
        </motion.div>

        {/* RIGHT PANEL: SIDE PANEL */}
        <AnimatePresence>
          {sidePanel.open && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: isMobile ? "absolute" : "relative",
                right: 0,
                top: 0,
                width: isMobile ? "100%" : "40%",
                height: "100%",
                minHeight: "70vh",
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <Paper
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
                  bgcolor: "white",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Close Button for Mobile/Desktop */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #f3f4f6" }}>
                  <IconButton onClick={closePanel}>
                    <Close />
                  </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                  {sidePanel.view === "add" && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, px: 2, color: "#065f46" }}>
                        Add New Member
                      </Typography>
                      <MemberAddForm onSuccess={handleAddSuccess} multiple onCancel={closePanel} />
                    </Box>
                  )}

                  {sidePanel.view === "edit" && sidePanel.data && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, px: 2, color: "#065f46" }}>
                        Edit Member
                      </Typography>
                      <MemberAddForm onSuccess={handleEditSuccess} member={sidePanel.data} onCancel={closePanel} />
                    </Box>
                  )}

                  {sidePanel.view === "detail" && sidePanel.data && (
                    <MemberDetailView member={sidePanel.data} />
                  )}
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

      </Box>
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