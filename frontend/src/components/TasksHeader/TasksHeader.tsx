import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TaskStatus } from "../../types";
import "./TasksHeader.css";

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
    <Box className="tasks-header">
      <Box>
        <Typography variant="h3" className="tasks-header-title">
          My Tasks
        </Typography>
        {filterStatus !== "all" && (
          <Box className="tasks-header-filter">
            <Chip
              label={`Filter: ${filterStatus.replace("_", " ")}`}
              onDelete={onClearFilter}
              className="tasks-header-filter-chip"
            />
          </Box>
        )}
      </Box>
      <Box className="tasks-header-actions">
        <Button
          variant="contained"
          onClick={onNavigateToDashboard}
          className="tasks-header-dashboard-button"
        >
          Dashboard
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          className="tasks-header-create-button"
        >
          Create Task
        </Button>
      </Box>
    </Box>
  );
};
