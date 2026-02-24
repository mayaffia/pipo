import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { TaskStats } from "../../../../types";
import { StatCard } from "../StatCard/StatCard";
import styles from "./StatsOverview.module.css";

interface StatsOverviewProps {
  stats: TaskStats | null;
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  loading,
}) => {
  const statCards = [
    {
      title: "Total Tasks",
      value: stats?.total || 0,
      icon: <AssignmentIcon className={styles.statIcon} />,
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Completed",
      value: stats?.byStatus?.done || 0,
      icon: <CheckCircleIcon className={styles.statIcon} />,
      color: "#48bb78",
      bgGradient: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    },
    {
      title: "In Progress",
      value: stats?.byStatus?.in_progress || 0,
      icon: <AccessTimeIcon className={styles.statIcon} />,
      color: "#ed8936",
      bgGradient: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    },
    {
      title: "To Do",
      value: stats?.byStatus?.todo || 0,
      icon: <TrendingUpIcon className={styles.statIcon} />,
      color: "#4299e1",
      bgGradient: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    },
  ];

  return (
    <>
      <Typography variant="h5" className={styles.sectionTitle}>
        Task Overview
      </Typography>

      {loading ? (
        <Box className={styles.loading}>
          <Typography variant="h6" className={styles.loadingText}>
            Loading statistics...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} index={index} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};
