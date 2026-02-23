import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  Paper,
  Chip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import { TaskStats } from "../../types";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiService.getTaskStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: stats?.total || 0,
      icon: <AssignmentIcon style={{ fontSize: 40 }} />,
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Completed",
      value: stats?.byStatus?.done || 0,
      icon: <CheckCircleIcon style={{ fontSize: 40 }} />,
      color: "#48bb78",
      bgGradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    },
    {
      title: "In Progress",
      value: stats?.byStatus?.in_progress || 0,
      icon: <AccessTimeIcon style={{ fontSize: 40 }} />,
      color: "#ed8936",
      bgGradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    },
    {
      title: "To Do",
      value: stats?.byStatus?.todo || 0,
      icon: <TrendingUpIcon style={{ fontSize: 40 }} />,
      color: "#4299e1",
      bgGradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    },
  ];

  return (
    <Box className="dashboard-page">
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header Section */}
            <Paper elevation={3} className="dashboard-header-paper">
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar className="dashboard-avatar">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h3" className="dashboard-welcome-title">
                    Welcome back, {user?.firstName}!
                  </Typography>
                  <Box className="dashboard-user-info">
                    <Chip
                      icon={<PersonIcon />}
                      label={user?.email}
                      className="dashboard-email-chip"
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Box className="dashboard-actions">
                    <Button
                      variant="contained"
                      onClick={() => navigate("/tasks")}
                      className="dashboard-view-tasks-button"
                    >
                      View Tasks
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExitToAppIcon />}
                      onClick={handleLogout}
                      className="dashboard-logout-button"
                    >
                      Logout
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Stats Section */}
            <Typography variant="h5" className="dashboard-section-title">
              Task Overview
            </Typography>

            {loading ? (
              <Box className="dashboard-loading">
                <Typography variant="h6" style={{ color: "white" }}>
                  Loading statistics...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Fade in timeout={500 + index * 100}>
                      <Card elevation={3} className="dashboard-stat-card">
                        <CardContent className="dashboard-stat-card-content">
                          <Box className="dashboard-stat-icon-wrapper">
                            <Box
                              className="dashboard-stat-icon-box"
                              style={{ background: stat.bgGradient }}
                            >
                              {stat.icon}
                            </Box>
                          </Box>
                          <Typography
                            variant="h3"
                            className="dashboard-stat-value"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body1"
                            className="dashboard-stat-title"
                          >
                            {stat.title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Quick Actions */}
            <Fade in timeout={1200}>
              <Paper elevation={3} className="dashboard-quick-actions-paper">
                <Typography
                  variant="h5"
                  className="dashboard-quick-actions-title"
                >
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks")}
                      className="dashboard-quick-action-button dashboard-quick-action-all"
                    >
                      Manage All Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=done")}
                      className="dashboard-quick-action-button dashboard-quick-action-done"
                    >
                      View Completed Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=in_progress")}
                      className="dashboard-quick-action-button dashboard-quick-action-in-progress"
                    >
                      View In Progress
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default DashboardPage;
