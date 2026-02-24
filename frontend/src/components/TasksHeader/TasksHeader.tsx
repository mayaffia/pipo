import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TaskStatus } from "../../types";
import styles from "./TasksHeader.module.css";

interface TasksHeaderProps {
  filterStatus: TaskStatus | "all";
  onClearFilter: () => void;
  onNavigateToDashboard: () => void;
  onCreateTask: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  filterStatus,
  onClearFilter,
  onNavigateToDashboard,
  onCreateTask,
}) => {
  return (
    <Box className={styles.tasksHeader}>
      <Box>
        <Typography variant="h3" className={styles.tasksHeaderTitle}>
          My Tasks
        </Typography>
        {filterStatus !== "all" && (
          <Box className={styles.tasksHeaderFilter}>
            <Chip
              label={`Filter: ${filterStatus.replace("_", " ")}`}
              onDelete={onClearFilter}
              className={styles.tasksHeaderFilterChip}
            />
          </Box>
        )}
      </Box>
      <Box className={styles.tasksHeaderActions}>
        <Button
          variant="contained"
          onClick={onNavigateToDashboard}
          className={styles.tasksHeaderDashboardButton}
        >
          Dashboard
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          className={styles.tasksHeaderCreateButton}
        >
          Create Task
        </Button>
      </Box>
    </Box>
  );
};
