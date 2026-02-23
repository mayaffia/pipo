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
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { TaskStats } from "../types";

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
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Completed",
      value: stats?.byStatus?.done || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "#48bb78",
      bgGradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    },
    {
      title: "In Progress",
      value: stats?.byStatus?.in_progress || 0,
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: "#ed8936",
      bgGradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    },
    {
      title: "To Do",
      value: stats?.byStatus?.todo || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#4299e1",
      bgGradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header Section */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: "2rem",
                      fontWeight: 700,
                    }}
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Welcome back, {user?.firstName}!
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      icon={<PersonIcon />}
                      label={user?.email}
                      sx={{
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        color: "#667eea",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/tasks")}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": {
                          // transform: "translateY(-2px)",
                          boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      View Tasks
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExitToAppIcon />}
                      onClick={handleLogout}
                      sx={{
                        borderColor: "#667eea",
                        color: "#667eea",
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#764ba2",
                          bgcolor: "rgba(102, 126, 234, 0.05)",
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Stats Section */}
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 3,
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Task Overview
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" sx={{ color: "white" }}>
                  Loading statistics...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Fade in timeout={500 + index * 100}>
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            // transform: "translateY(-8px)",
                            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                background: stat.bgGradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                              }}
                            >
                              {stat.icon}
                            </Box>
                          </Box>
                          <Typography
                            variant="h3"
                            sx={{
                              fontWeight: 700,
                              color: stat.color,
                              mb: 1,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 500,
                            }}
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
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  mt: 4,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "#2d3748",
                  }}
                >
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks")}
                      sx={{
                        py: 2,
                        borderColor: "#667eea",
                        color: "#667eea",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#764ba2",
                          bgcolor: "rgba(102, 126, 234, 0.05)",
                        },
                      }}
                    >
                      Manage All Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=done")}
                      sx={{
                        py: 2,
                        borderColor: "#48bb78",
                        color: "#48bb78",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#38a169",
                          bgcolor: "rgba(72, 187, 120, 0.05)",
                        },
                      }}
                    >
                      View Completed Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=in_progress")}
                      sx={{
                        py: 2,
                        borderColor: "#ed8936",
                        color: "#ed8936",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#dd6b20",
                          bgcolor: "rgba(237, 137, 54, 0.05)",
                        },
                      }}
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
