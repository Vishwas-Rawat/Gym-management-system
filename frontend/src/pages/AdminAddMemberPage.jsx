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
  People,
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
import MemberAddForm from "../components/MemberAddForm";
import {
  MemberRegistrationProvider,
  useMemberRegistration,
} from "../context/MemberRegistrationContext";

// NEW EMERALD + TEAL THEME
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
                <People sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white", fontSize: "1rem" }}>
                Members Dashboard
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
  { label: "Total Members", value: 247, icon: People, color: "primary", trend: "+12.5%", trendColor: "success" },
  { label: "Pending Fees", value: 23, icon: AttachMoney, color: "warning", trend: "-3.2%", trendColor: "error" },
  { label: "Active Memberships", value: 189, icon: Group, color: "success", trend: "+8.7%", trendColor: "success" },
  { label: "New This Month", value: 42, icon: PersonAdd, color: "info", trend: "+25.3%", trendColor: "success" },
];

// UPDATED SAMPLE MEMBERS WITH 10+ REALISTIC ENTRIES
const sampleMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phoneNo: "+91 98765 43210",
    gymName: "FitZone Downtown",
    currentPlan: "Gold",
    planPrice: 4999,
    amountPaid: 4999,
    paymentMethod: "UPI",
    timeSlot: "6:00 AM - 7:00 AM",
    status: "Paid",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya.mehta@outlook.com",
    phoneNo: "+91 87654 32109",
    gymName: "PowerGym Central",
    currentPlan: "Silver",
    planPrice: 2999,
    amountPaid: 1500,
    paymentMethod: "Cash",
    timeSlot: "7:30 PM - 8:30 PM",
    status: "Pending",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@yahoo.com",
    phoneNo: "+91 76543 21098",
    gymName: "Elite Fitness Hub",
    currentPlan: "Premium",
    planPrice: 7999,
    amountPaid: 7999,
    paymentMethod: "Credit Card",
    timeSlot: "5:00 PM - 6:00 PM",
    status: "Paid",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phoneNo: "+91 91234 56789",
    gymName: "Iron Temple",
    currentPlan: "Bronze",
    planPrice: 1999,
    amountPaid: 1999,
    paymentMethod: "Debit Card",
    timeSlot: "8:00 AM - 9:00 AM",
    status: "Paid",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@icloud.com",
    phoneNo: "+91 82345 67890",
    gymName: "Core Strength Studio",
    currentPlan: "Gold",
    planPrice: 4999,
    amountPaid: 2500,
    paymentMethod: "UPI",
    timeSlot: "9:00 PM - 10:00 PM",
    status: "Pending",
  },
  {
    id: 6,
    name: "Ananya Gupta",
    email: "ananya.g@protonmail.com",
    phoneNo: "+91 70123 45678",
    gymName: "FitZone Downtown",
    currentPlan: "Premium",
    planPrice: 7999,
    amountPaid: 7999,
    paymentMethod: "Net Banking",
    timeSlot: "6:30 in the morning",
    status: "Paid",
  },
  {
    id: 7,
    name: "Rohan Kapoor",
    email: "rohan.kapoor@gmail.com",
    phoneNo: "+91 99887 77666",
    gymName: "PowerGym Central",
    currentPlan: "Silver",
    planPrice: 2999,
    amountPaid: 2999,
    paymentMethod: "Cash",
    timeSlot: "6:30 PM - 7:30 PM",
    status: "Paid",
  },
  {
    id: 8,
    name: "Kavya Nair",
    email: "kavya.nair@live.com",
    phoneNo: "+91 88776 66555",
    gymName: "Elite Fitness Hub",
    currentPlan: "Bronze",
    planPrice: 1999,
    amountPaid: 0,
    paymentMethod: "Pending",
    timeSlot: "7:00 AM - 8:00 AM",
    status: "Pending",
  },
  {
    id: 9,
    name: "Arjun Malhotra",
    email: "arjun.malhotra@gmail.com",
    phoneNo: "+91 77665 55444",
    gymName: "Iron Temple",
    currentPlan: "Gold",
    planPrice: 4999,
    amountPaid: 4999,
    paymentMethod: "UPI",
    timeSlot: "5:30 AM - 6:30 AM",
    status: "Paid",
  },
  {
    id: 10,
    name: "Ishita Verma",
    email: "ishita.verma@zoho.com",
    phoneNo: "+91 66554 44333",
    gymName: "Core Strength Studio",
    currentPlan: "Premium",
    planPrice: 7999,
    amountPaid: 4000,
    paymentMethod: "Credit Card",
    timeSlot: "8:00 PM - 9:00 PM",
    status: "Pending",
  },
];

const AdminAddMemberPageContent = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [members, setMembers] = useState(sampleMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const { successMessage, apiError } = useMemberRegistration();

  const handleAddMemberSuccess = (newMember) => {
  setMembers((prev) => [newMember, ...prev]);
  setOpenDialog(false);
};

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => (status === "Paid" ? "success" : "warning");

  return (
    <AdminLayout title="Manage Members" subtitle="Manage members efficiently with real-time insights">
      {/* Alerts */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", border: "1px solid #34d399" }}>
              {successMessage}
            </Alert>
          </motion.div>
        )}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px", background: "linear-gradient(135deg, #ef4444, #f87171)", border: "1px solid #f87171" }}>
              {apiError}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Cards */}
      <Grid container spacing={2} sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 }, width: "100%", justifyContent: "center" }}>
        {dashboardStats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} lg={3} key={index} sx={{ minWidth: { md: 240, lg: 260 } }}>
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

      {/* Add Member Button */}
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
            + Add Member
          </Button>
        </motion.div>
      </Box>

      {/* UPDATED TABLE WITH 10 COLUMNS */}
      <Paper sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.1)", background: "white", border: "2px solid #d1fae5", mx: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ p: 3, borderBottom: "2px solid #d1fae5" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #0d9488, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Group sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>Recent Members</Typography>
                <Typography variant="body2" color="text.secondary">({filteredMembers.length}) members</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: { xs: "100%", sm: "auto" } }}>
              <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.50", borderRadius: "12px", px: 3, py: 1.5, minWidth: { xs: "100%", sm: 280 }, border: "2px solid #d1fae5", transition: "all 0.2s ease", "&:hover": { borderColor: "#059669" } }}>
                <Search sx={{ mr: 1.5, color: "text.secondary", fontSize: 20 }} />
                <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", fontWeight: 500, width: "100%" }} />
              </Box>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0fdf4", borderBottom: "2px solid #d1fae5" }}>
                {["Name", "Email", "Phone", "Gym", "Plan", "Price", "Paid", "Method", "Slot", "Status", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.1rem", borderBottom: "2px solid #d1fae5" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} sx={{ "&:hover": { backgroundColor: "transparent" } }}>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #34d399)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Verified sx={{ color: "white", fontSize: 18 }} />
                      </Box>
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: "1.05rem" }}>{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography variant="body2" color="text.secondary" sx={{ fontSize: "1rem" }}>{member.email}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography variant="body2" sx={{ fontSize: "0.95rem" }}>{member.phoneNo}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={member.gymName} size="small" sx={{ fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={member.currentPlan} color="primary" size="small" sx={{ fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography fontWeight={600}>₹{member.planPrice}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Typography color={member.amountPaid >= member.planPrice ? "success.main" : "warning.main"}>₹{member.amountPaid}</Typography></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={member.paymentMethod} size="small" sx={{ fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><AccessTime fontSize="small" /><Typography variant="body2">{member.timeSlot}</Typography></Box></TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #d1fae5" }}><Chip label={member.status} color={getStatusColor(member.status)} size="small" sx={{ fontWeight: 700, fontSize: "0.8rem", height: 28 }} /></TableCell>
                  <TableCell align="center" sx={{ borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
                        <IconButton size="medium" sx={{ width: 44, height: 44, bgcolor: "success.50", color: "success.main", cursor: "pointer", "&:hover": { bgcolor: "success.100" } }}><Edit fontSize="medium" /></IconButton>
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
                        <IconButton size="medium" sx={{ width: 44, height: 44, bgcolor: "error.50", color: "error.main", cursor: "pointer", "&:hover": { bgcolor: "error.100" } }}><Delete fontSize="medium" /></IconButton>
                      </motion.div>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6, borderBottom: "1px solid #d1fae5" }}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)", mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <People sx={{ fontSize: 32, color: "grey.400" }} />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary", fontSize: "1.1rem" }}>No members found</Typography>
                      <Typography variant="body2" color="text.secondary">Add your first member using the button above</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog - WIDER & BETTER SPACED */}
<Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  maxWidth="lg"           // CHANGED FROM "sm" TO "lg"
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
      Add New Member
    </Box>
  </DialogTitle>
  <DialogContent sx={{ p: 0, overflowY: "auto" }}>
    <MemberAddForm onSuccess={handleAddMemberSuccess} />
  </DialogContent>
</Dialog>
    </AdminLayout>
  );
};

const AdminAddMemberPage = () => {
  return (
    <ThemeProvider theme={emeraldTheme}>
      <CssBaseline />
      <MemberRegistrationProvider>
        <AdminAddMemberPageContent />
      </MemberRegistrationProvider>
    </ThemeProvider>
  );
};

export default AdminAddMemberPage;