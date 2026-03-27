// src/components/MemberAnalytics.jsx
import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 1.5,
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {label}
        </Typography>
        <Typography variant="body2" color="primary.main">
          {payload[0].value} Members
        </Typography>
      </Box>
    );
  }
  return null;
};

const MemberAnalytics = ({ members = [] }) => {
  const theme = useTheme();

  // 1. Plan Distribution
  const planData = useMemo(() => {
    const counts = {};
    members.forEach((m) => {
      const plan = m.membershipPlan || "Unknown";
      counts[plan] = (counts[plan] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key.length > 15 ? key.substring(0, 15) + "..." : key,
      full: key,
      value: counts[key],
    }));
  }, [members]);

  // 2. Joining Trend (Last 6 months)
  const trendData = useMemo(() => {
    const months = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short" });
      months[key] = 0;
    }

    members.forEach((m) => {
      if (m.startDate) {
        const d = new Date(m.startDate);
        const key = d.toLocaleString("default", { month: "short" });
        if (months[key] !== undefined) {
          months[key]++;
        }
      }
    });

    return Object.keys(months).map((key) => ({
      name: key,
      value: months[key],
    }));
  }, [members]);

  if (!members.length) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* Plan Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 350,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "visible",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Membership Plans
              </Typography>
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={planData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40}>
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Joining Trend Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 350,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "visible",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Joining Trends
              </Typography>
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberAnalytics;
