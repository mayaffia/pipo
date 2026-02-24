import React from "react";
import { Paper, Typography, Grid, Button, Fade } from "@mui/material";
import styles from "./QuickActions.module.css";

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  return (
    <Fade in timeout={1200}>
      <Paper elevation={3} className={styles.quickActionsPaper}>
        <Typography variant="h5" className={styles.quickActionsTitle}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onNavigate("/tasks")}
              className={`${styles.quickActionButton} ${styles.quickActionAll}`}
            >
              Manage All Tasks
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onNavigate("/tasks?status=done")}
              className={`${styles.quickActionButton} ${styles.quickActionDone}`}
            >
              View Completed Tasks
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onNavigate("/tasks?status=in_progress")}
              className={`${styles.quickActionButton} ${styles.quickActionInProgress}`}
            >
              View In Progress
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );
};
