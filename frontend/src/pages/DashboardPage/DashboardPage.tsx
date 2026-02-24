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
import styles from "./DashboardPage.module.css";

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
      icon: <AssignmentIcon className={styles.dashboardStatIcon} />,
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Completed",
      value: stats?.byStatus?.done || 0,
      icon: <CheckCircleIcon className={styles.dashboardStatIcon} />,
      color: "#48bb78",
      bgGradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    },
    {
      title: "In Progress",
      value: stats?.byStatus?.in_progress || 0,
      icon: <AccessTimeIcon className={styles.dashboardStatIcon} />,
      color: "#ed8936",
      bgGradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    },
    {
      title: "To Do",
      value: stats?.byStatus?.todo || 0,
      icon: <TrendingUpIcon className={styles.dashboardStatIcon} />,
      color: "#4299e1",
      bgGradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    },
  ];

  return (
    <Box className={styles.dashboardPage}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Paper elevation={3} className={styles.dashboardHeaderPaper}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar className={styles.dashboardAvatar}>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="h3"
                    className={styles.dashboardWelcomeTitle}
                  >
                    Welcome back, {user?.firstName}!
                  </Typography>
                  <Box className={styles.dashboardUserInfo}>
                    <Chip
                      icon={<PersonIcon />}
                      label={user?.email}
                      className={styles.dashboardEmailChip}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Box className={styles.dashboardActions}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/tasks")}
                      className={styles.dashboardViewTasksButton}
                    >
                      View Tasks
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExitToAppIcon />}
                      onClick={handleLogout}
                      className={styles.dashboardLogoutButton}
                    >
                      Logout
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h5" className={styles.dashboardSectionTitle}>
              Task Overview
            </Typography>

            {loading ? (
              <Box className={styles.dashboardLoading}>
                <Typography
                  variant="h6"
                  className={styles.dashboardLoadingText}
                >
                  Loading statistics...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Fade in timeout={500 + index * 100}>
                      <Card elevation={3} className={styles.dashboardStatCard}>
                        <CardContent
                          className={styles.dashboardStatCardContent}
                        >
                          <Box className={styles.dashboardStatIconWrapper}>
                            <Box
                              className={styles.dashboardStatIconBox}
                              style={{ background: stat.bgGradient }}
                            >
                              {stat.icon}
                            </Box>
                          </Box>
                          <Typography
                            variant="h3"
                            className={styles.dashboardStatValue}
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body1"
                            className={styles.dashboardStatTitle}
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

            <Fade in timeout={1200}>
              <Paper
                elevation={3}
                className={styles.dashboardQuickActionsPaper}
              >
                <Typography
                  variant="h5"
                  className={styles.dashboardQuickActionsTitle}
                >
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks")}
                      className={`${styles.dashboardQuickActionButton} ${styles.dashboardQuickActionAll}`}
                    >
                      Manage All Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=done")}
                      className={`${styles.dashboardQuickActionButton} ${styles.dashboardQuickActionDone}`}
                    >
                      View Completed Tasks
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/tasks?status=in_progress")}
                      className={`${styles.dashboardQuickActionButton} ${styles.dashboardQuickActionInProgress}`}
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
