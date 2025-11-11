// src/pages/AdminAddTrainerPage.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import {
  FitnessCenter,
  AttachMoney,
  Group,
  PersonAdd,
  Edit,
  Delete,
  Search,
  TrendingUp,
  Verified,
  AccessTime,
  LocationOn,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import lightTheme from "../themes/lightTheme";
import TrainerAddForm from "../components/TrainerAddForm";

// EMERALD + TEAL THEME
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

// ADMIN LAYOUT
const AdminLayout = ({ title, subtitle, children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Particles */}
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
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                px: 3,
                py: 1.5,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "16px",
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #34d399, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FitnessCenter sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white", fontSize: "1rem" }}>
                Trainers Dashboard
              </Typography>
            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
                lineHeight: 1.2,
                mb: 2,
                background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 400, lineHeight: 1.6, fontSize: "1.1rem" }}>
              {subtitle}
            </Typography>
          </Box>
        </motion.div>

        <Paper elevation={0} sx={{ width: "100vw", maxWidth: "100%", mx: 0, borderRadius: 0, overflow: "hidden", background: "white", p: { xs: 3, sm: 4, md: 5 } }}>
          <Fade in timeout={400}>
            <Box>{children}</Box>
          </Fade>
        </Paper>
      </Box>
    </Box>
  );
};

// Dashboard Stats
const dashboardStats = [
  { label: "Total Trainers", value: 38, icon: FitnessCenter, color: "primary", trend: "+18.2%", trendColor: "success" },
  { label: "Active Sessions", value: 124, icon: AccessTime, color: "info", trend: "+5.1%", trendColor: "success" },
  { label: "Certified Experts", value: 32, icon: Verified, color: "success", trend: "+10.3%", trendColor: "success" },
  { label: "New This Month", value: 6, icon: PersonAdd, color: "warning", trend: "+33.3%", trendColor: "success" },
];

// Sample Trainers
const sampleTrainers = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh.k@gmail.com", phoneNo: "+91 98765 43211", gymName: "FitZone Downtown", specialty: "Strength", experience: "8 yrs", salary: 45000, status: "Active" },
  { id: 2, name: "Neha Sharma", email: "neha.s@outlook.com", phoneNo: "+91 87654 32100", gymName: "PowerGym Central", specialty: "Yoga", experience: "5 yrs", salary: 38000, status: "Active" },
  { id: 3, name: "Vikram Singh", email: "vikram.s@yahoo.com", phoneNo: "+91 76543 21099", gymName: "Elite Fitness Hub", specialty: "Cardio", experience: "6 yrs", salary: 42000, status: "On Leave" },
  { id: 4, name: "Priya Mehta", email: "priya.m@gmail.com", phoneNo: "+91 91234 56780", gymName: "Iron Temple", specialty: "HIIT", experience: "4 yrs", salary: 35000, status: "Active" },
  { id: 5, name: "Amit Patel", email: "amit.p@icloud.com", phoneNo: "+91 82345 67891", gymName: "Core Strength Studio", specialty: "CrossFit", experience: "7 yrs", salary: 48000, status: "Active" },
];

const AdminAddTrainerPageContent = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [trainers, setTrainers] = useState(sampleTrainers);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddTrainerSuccess = (newTrainer) => {
    setTrainers((prev) => [newTrainer, ...prev]);
    setSuccessMessage("Trainer added successfully!");
    setOpenDialog(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const filteredTrainers = trainers.filter((t) =>
    Object.values(t).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => status === "Active" ? "success" : "warning";

  return (
    <AdminLayout title="Manage Trainers" subtitle="Hire, track, and manage your fitness trainers efficiently">
      {/* Success Alert */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", border: "1px solid #34d399" }}>
              {successMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Cards */}
      <Grid container spacing={2} sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 }, width: "100%", justifyContent: "center" }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={index} sx={{ minWidth: { md: 240, lg: 260 } }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.3 }}>
              <Card
                sx={{
                  height: "100%",
                  background: "linear-gradient(145deg, #ffffff, #f0fdf4)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #d1fae5",
                  position: "relative",
                  transition: "all 0.2s ease",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 35px rgba(0, 0, 0, 0.12)",
                    borderColor: "#86efac",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${emeraldTheme.palette[stat.color].main}, ${emeraldTheme.palette[stat.color].dark})`,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "16px",
                        background: `linear-gradient(135deg, ${emeraldTheme.palette[stat.color].main}, ${emeraldTheme.palette[stat.color].dark})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <stat.icon sx={{ color: "white", fontSize: 28 }} />
                    </Box>
                    <Chip
                      label={stat.trend}
                      size="small"
                      color={stat.trendColor}
                      sx={{ fontWeight: 700, height: 28, borderRadius: "12px", fontSize: "0.85rem", px: 1.5 }}
                    />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 1.5,
                      background: `linear-gradient(135deg, ${emeraldTheme.palette[stat.color].main}, ${emeraldTheme.palette[stat.color].dark})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.5rem", sm: "2.75rem", md: "3rem" },
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: { xs: "1rem", md: "1.1rem" } }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Add Trainer Button */}
      <Box sx={{ mb: 6, textAlign: "center", px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
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
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0 12px 28px rgba(5, 150, 105, 0.35)",
                background: "linear-gradient(135deg, #047857, #065f46)",
              },
              minWidth: 240,
              height: 56,
            }}
          >
            + Add Trainer
          </Button>
        </motion.div>
      </Box>

      {/* Trainers Table */}
      <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.1)", background: "white", border: "2px solid #d1fae5", mx: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ p: 3, borderBottom: "2px solid #d1fae5" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #0d9488, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Group sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>Active Trainers</Typography>
                <Typography variant="body2" color="text.secondary">({filteredTrainers.length}) trainers</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: { xs: "100%", sm: "auto" } }}>
              <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.50", borderRadius: "12px", px: 3, py: 1.5, minWidth: { xs: "100%", sm: 280 }, border: "2px solid #d1fae5", transition: "all 0.2s ease", "&:hover": { borderColor: "#059669" } }}>
                <Search sx={{ mr: 1.5, color: "text.secondary", fontSize: 20 }} />
                <input type="text" placeholder="Search trainers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", fontWeight: 500, width: "100%" }} />
              </Box>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0fdf4", borderBottom: "2px solid #d1fae5" }}>
                {["Name", "Email", "Phone", "Gym", "Specialty", "Exp", "Salary", "Status", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.1rem", borderBottom: "2px solid #d1fae5" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} sx={{ "&:hover": { backgroundColor: "transparent" } }}>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Verified sx={{ color: "white", fontSize: 18 }} />
                      </Box>
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: "1.05rem" }}>{trainer.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>{trainer.email}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography variant="body2" sx={{ fontSize: "0.95rem" }}>{trainer.phoneNo}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={trainer.gymName} size="small" sx={{ fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={trainer.specialty} color="primary" size="small" sx={{ fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography fontWeight={600}>{trainer.experience}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography fontWeight={600}>₹{trainer.salary.toLocaleString()}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={trainer.status} color={getStatusColor(trainer.status)} size="small" sx={{ fontWeight: 700, fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell align="center" sx={{ borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                        <IconButton size="medium" sx={{ width: 44, height: 44, bgcolor: "success.50", color: "success.main", cursor: "pointer", "&:hover": { bgcolor: "success.100" } }}><Edit fontSize="medium" /></IconButton>
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                        <IconButton size="medium" sx={{ width: 44, height: 44, bgcolor: "error.50", color: "error.main", cursor: "pointer", "&:hover": { bgcolor: "error.100" } }}><Delete fontSize="medium" /></IconButton>
                      </motion.div>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTrainers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)", mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FitnessCenter sx={{ fontSize: 32, color: "grey.400" }} />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary", fontSize: "1.1rem" }}>No trainers found</Typography>
                      <Typography variant="body2" color="text.secondary">Add your first trainer using the button above</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Trainer Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 16px 35px rgba(0, 0, 0, 0.15)",
            maxHeight: "90vh",
            border: "2px solid #d1fae5",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.5, fontWeight: 700, fontSize: "1.25rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonAdd sx={{ color: "white", fontSize: 22 }} />
            </Box>
            Add New Trainer
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflowY: "auto" }}>
          <TrainerAddForm onSuccess={handleAddTrainerSuccess} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const AdminAddTrainerPage = () => {
  return (
    <ThemeProvider theme={emeraldTheme}>
      <CssBaseline />
      <AdminAddTrainerPageContent />
    </ThemeProvider>
  );
};

export default AdminAddTrainerPage;