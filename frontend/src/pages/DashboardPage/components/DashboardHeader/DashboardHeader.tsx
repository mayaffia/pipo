import React from "react";
import {
  Grid,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { User } from "../../../../types";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  user: User | null;
  onNavigateToTasks: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onNavigateToTasks,
  onLogout,
}) => {
  return (
    <Paper elevation={3} className={styles.headerPaper}>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar className={styles.avatar}>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h3" className={styles.welcomeTitle}>
            Welcome back, {user?.firstName}!
          </Typography>
          <Box className={styles.userInfo}>
            <Chip
              icon={<PersonIcon />}
              label={user?.email}
              className={styles.emailChip}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box className={styles.actions}>
            <Button
              variant="contained"
              onClick={onNavigateToTasks}
              className={styles.viewTasksButton}
            >
              View Tasks
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              onClick={onLogout}
              className={styles.logoutButton}
            >
              Logout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
