// src/pages/AdminAddTrainerPage.jsx
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
  Close,
  FitnessCenter,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import lightTheme from "../themes/lightTheme";
import TrainerAddForm from "../components/TrainerAddForm";
import { TrainerDetailView } from "../components/TrainerDetailView";
import { TrainerRegistrationProvider, useTrainerRegistration } from "../context/TrainerRegistrationContext";
import TrainerRow from "../components/TrainerRow";
import AssignMembersDialog from "../components/AssignMembersDialog";
import { userApi } from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";



const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: "#007BFF" }, // Bootstrap Blue
    secondary: { main: "#6c757d" }, // Bootstrap Secondary (Gray)
    success: { main: "#27C499", light: "#D1FAE5" }, // Clean SaaS Green
    warning: { main: "#F6A23E" }, // Amber
    error: { main: "#E53935" }, // Material Red
    info: { main: "#17A2B8" }, // Info Blue-light
    background: { default: "#F4F6F9", paper: "#FFFFFF" },
    text: { primary: "#1F2937", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        },
        containedPrimary: {
          background: "#007BFF",
          "&:hover": { background: "#0056b3" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 24px",
        },
        head: {
          fontWeight: 600,
          color: "#6B7280",
          backgroundColor: "#F9FAFB",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

const AdminLayout = ({ title, subtitle, children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "background.default",
      pb: 6,
      overflowX: "hidden",
    }}
  >
    {/* HEADER */}
    <Box
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #E5E7EB",
        py: 2,
        px: { xs: 2, sm: 3, md: 4 },
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
          }}
        >
          <FitnessCenter />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>
      {children}
    </Box>
  </Box>
);

// GYM DROPDOWN
const SelectGym = ({ onGymChange }) => {
  const { gyms, fetchGyms } = useTrainerRegistration();
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
        {Array.isArray(gyms) && gyms.map((gym) => (
          <MenuItem key={gym.gymId} value={gym.gymId}>
            {gym.gymName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const AdminAddTrainerPageContent = () => {
  const {
    isLoading,
    successMessage,
    apiError,
    clearMessages,
    fetchTrainers,
    searchTrainers,
    addMultipleTrainers,
    deleteTrainer,
    updateTrainer,
    resendInvite,
    getTrainerById,
    assignMembers,
  } = useTrainerRegistration();

  const isMobile = useMediaQuery("(max-width:900px)");

  const [sidePanel, setSidePanel] = useState({
    open: false,
    view: "none", // 'add', 'edit', 'detail'
    data: null,
  });

  const [originalTrainers, setOriginalTrainers] = useState([]); // Always array
  const [trainers, setTrainers] = useState([]);                 // Always array
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState(null);
  const searchTimeoutRef = useRef(null);

  const [stats, setStats] = useState(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    severity: "warning",
    onConfirm: null,
  });

  useEffect(() => {
    userApi.get("/admin/dashboard/18").then((res) => setStats(res.data)).catch(console.error);
  }, []);



  // Assign Dialog State
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [trainerForAssign, setTrainerForAssign] = useState(null);

  // Load trainers safely
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchTrainers(selectedGymId);
        const trainerList = Array.isArray(data) ? data : [];
        if (mounted) {
          setOriginalTrainers(trainerList);
          setTrainers(trainerList);
        }
      } catch (err) {
        console.error("Failed to load trainers:", err);
        if (mounted) {
          setOriginalTrainers([]);
          setTrainers([]);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [fetchTrainers, selectedGymId]);

  // Search + Filter Logic
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setLocalSearchResults([]);
      setTrainers(originalTrainers);
      setIsSearchingAPI(false);
      return;
    }

    // Local filter
    const filtered = originalTrainers.filter((t) => {
      return (
        (t.fullName?.toLowerCase().includes(term)) ||
        (t.email?.toLowerCase().includes(term)) ||
        (t.phoneNo?.includes(term)) ||
        (t.specialization?.toLowerCase().includes(term))
      );
    });
    setLocalSearchResults(filtered);

    // Debounced API search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAPI(true);
      try {
        const results = await searchTrainers(term, selectedGymId);
        setTrainers(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("Search failed:", err);
        setTrainers([]);
      } finally {
        setIsSearchingAPI(false);
      }
    }, 600);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, originalTrainers, searchTrainers, selectedGymId]);

  // THIS IS THE KEY FIX: Always return a valid array
  const displayTrainers = searchTerm.trim()
    ? (Array.isArray(localSearchResults) ? localSearchResults : [])
    : (Array.isArray(trainers) ? trainers : []);

  const handleGymChange = (gymId) => {
    setSelectedGymId(gymId);
  };

  const closePanel = () => {
    setSidePanel({ open: false, view: "none", data: null });
    clearMessages();
  };

  const handleAddSuccess = async (payloadArray) => {
    const arr = Array.isArray(payloadArray) ? payloadArray : [payloadArray];
    await addMultipleTrainers(arr);
    closePanel();
    const updated = await fetchTrainers(selectedGymId);
    const list = Array.isArray(updated) ? updated : [];
    setOriginalTrainers(list);
    setTrainers(list);
  };

  const handleEditSuccess = async (payload) => {
    if (sidePanel.data) {
      const id = sidePanel.data.trainerId || sidePanel.data.id;
      await updateTrainer(id, payload);
      closePanel();
      const updated = await fetchTrainers(selectedGymId);
      const list = Array.isArray(updated) ? updated : [];
      setOriginalTrainers(list);
      setTrainers(list);
    }
  };

  const openAddTrainer = () => {
    setSidePanel({ open: true, view: "add", data: null });
  };

  const openEdit = async (trainerId) => {
    const trainer = await getTrainerById(trainerId);
    if (trainer) {
      setSidePanel({ open: true, view: "edit", data: trainer });
    }
  };

  const openDetail = async (trainerId) => {
    if (!trainerId) return;
    const trainer = await getTrainerById(trainerId);
    if (trainer) {
      setSidePanel({ open: true, view: "detail", data: trainer });
    }
  };

  const handleResend = (userId) => {
    setConfirmDialog({
      open: true,
      title: "Resend Invite?",
      message: "Resend the registration invitation link to this trainer?",
      severity: "info",
      confirmText: "Resend",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await resendInvite(userId);
      }
    });
  };

  const handleDelete = (trainerId) => {
    setConfirmDialog({
      open: true,
      title: "Delete Trainer?",
      message: "Are you sure you want to soft-delete this trainer?",
      severity: "error",
      confirmText: "Delete",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        const ok = await deleteTrainer(trainerId);
        if (ok) {
          const updated = await fetchTrainers(selectedGymId);
          const list = Array.isArray(updated) ? updated : [];
          setOriginalTrainers(list);
          setTrainers(list);
        }
      }
    });
  };

  // Assign Members Handlers
  const openAssignDialog = () => {
    if (sidePanel.data) {
        setTrainerForAssign(sidePanel.data);
        setAssignDialogOpen(true);
    }
  };

  const handleAssignMembers = async (trainerId, memberIds) => {
      await assignMembers(trainerId, memberIds);
  };

  const renderTrainersList = () => {
    if (isLoading || (isSearchingAPI && searchTerm.trim())) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      );
    }

    if (!displayTrainers || displayTrainers.length === 0) {
      return (
        <Typography align="center" sx={{ py: 8, color: "text.secondary", fontSize: "1.1rem" }}>
          {searchTerm.trim()
            ? "No trainers found matching your search."
            : selectedGymId
            ? "No trainers found in this gym."
            : "No trainers added yet."}
        </Typography>
      );
    }

    if (isMobile) {
      return (
        <Box sx={{ p: 2 }}>
          <AnimatePresence>
            {displayTrainers.map((t, index) => {
              const id = t.trainerId || t.id || index;
              const isSelected = sidePanel.open && sidePanel.data && 
                (sidePanel.data.trainerId === id || sidePanel.data.id === id);

              return (
                <TrainerRow
                  key={id}
                  trainer={t}
                  index={index}
                  isSelected={isSelected}
                  onDetail={() => openDetail(id)}
                  onEdit={() => openEdit(id)}
                  onResend={() => handleResend(t.userId || id)}
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
              {["Full Name", "Email", "Phone", "Specialization", "Experience", "Actions"].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    bgcolor: "background.paper",
                    borderBottom: "2px solid #E5E7EB",
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
              {displayTrainers.map((t, index) => {
                const id = t.trainerId || t.id || index;
                const isSelected = sidePanel.open && sidePanel.data && 
                  (sidePanel.data.trainerId === id || sidePanel.data.id === id);

                return (
                  <TrainerRow
                    key={id}
                    trainer={t}
                    index={index}
                    isSelected={isSelected}
                    onDetail={() => openDetail(id)}
                    onEdit={() => openEdit(id)}
                    onResend={() => handleResend(t.userId || id)}
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
    <AdminLayout title="Manage Trainers" subtitle="Real-time trainer management">
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
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

      <Box sx={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 2 }}>
        {/* LEFT PANEL: TRAINER LIST */}
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
          <Paper sx={{ overflow: "hidden", border: "1px solid #E5E7EB", borderRadius: "24px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)", minHeight: "70vh" }}>
            <Box
              sx={{
                p: 4,
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: { xs: "column", lg: sidePanel.open ? "column" : "row", xl: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: sidePanel.open ? "stretch" : "center", xl: "center" },
                gap: 3,
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: "rgba(0, 123, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
                  <Group sx={{ fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>All Trainers</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {displayTrainers.length} trainers found
                  </Typography>
                   {stats && (
                    <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mt: 0.5 }}>
                      Trainers Present Today: {stats.trainersPresentToday}
                    </Typography>
                  )}

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
                    border: "1px solid #E5E7EB",
                    flexGrow: 1,
                    minWidth: { xs: "100%", sm: "250px" },
                    "&:focus-within": { borderColor: "#007BFF", boxShadow: "0 0 0 4px rgba(0, 123, 255, 0.1)" },
                  }}
                >
                  <Search sx={{ color: "text.secondary", mr: 1.5, fontSize: 24 }} />
                  <InputBase
                    placeholder="Search trainers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: "100%", fontSize: "1.05rem" }}
                  />
                </Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={openAddTrainer}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: "12px",
                    }}
                  >
                    Add Trainer
                  </Button>
                </motion.div>
              </Box>
            </Box>

            {renderTrainersList()}
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
                zIndex: 10,
              }}
            >
              <Paper sx={{ height: "100%", borderRadius: "24px", overflow: "hidden", boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", bgcolor: "white", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #E5E7EB" }}>
                  <IconButton onClick={closePanel}>
                    <Close />
                  </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                  {sidePanel.view === "add" && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, px: 2, color: "primary.main" }}>
                        Add New Trainer
                      </Typography>
                      <TrainerAddForm onSuccess={handleAddSuccess} multiple onCancel={closePanel} />
                    </Box>
                  )}
                  {sidePanel.view === "edit" && sidePanel.data && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, px: 2, color: "primary.main" }}>
                        Edit Trainer
                      </Typography>
                      <TrainerAddForm onSuccess={handleEditSuccess} trainer={sidePanel.data} onCancel={closePanel} />
                    </Box>
                  )}
                  {sidePanel.view === "detail" && sidePanel.data && (
                    <TrainerDetailView 
                        trainer={sidePanel.data} 
                        onClose={closePanel}
                        onAssignMembers={openAssignDialog}
                    />
                  )}
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <AssignMembersDialog 
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        trainer={trainerForAssign}
        onAssign={handleAssignMembers}
      />
      
      <ConfirmationDialog 
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </AdminLayout>
  );
};

const AdminAddTrainerPage = () => (
  <ThemeProvider theme={dashboardTheme}>
    <CssBaseline />
    <TrainerRegistrationProvider>
      <AdminAddTrainerPageContent />
    </TrainerRegistrationProvider>
  </ThemeProvider>
);

export default AdminAddTrainerPage;