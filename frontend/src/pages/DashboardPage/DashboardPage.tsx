import React, { useEffect, useState } from "react";
import { Container, Box, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiService } from "../../services/api";
import { TaskStats } from "../../types";
import { DashboardHeader, StatsOverview, QuickActions } from "./components";
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box className={styles.dashboardPage}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <DashboardHeader
              user={user}
              onNavigateToTasks={() => navigate("/tasks")}
              onLogout={handleLogout}
            />

            <StatsOverview stats={stats} loading={loading} />

            <QuickActions onNavigate={navigate} />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default DashboardPage;
