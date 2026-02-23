import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Task, TaskStatus, TaskPriority } from "../../types";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenStatusMenu: (event: React.MouseEvent<HTMLElement>, task: Task) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return "default";
    case TaskStatus.IN_PROGRESS:
      return "primary";
    case TaskStatus.DONE:
      return "success";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.LOW:
      return "info";
    case TaskPriority.MEDIUM:
      return "warning";
    case TaskPriority.HIGH:
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE:
      return <CheckCircleIcon fontSize="small" />;
    case TaskStatus.IN_PROGRESS:
      return <AccessTimeIcon fontSize="small" />;
    default:
      return <RadioButtonUncheckedIcon fontSize="small" />;
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onOpenStatusMenu,
}) => {
  return (
    <Fade in timeout={500 + index * 100}>
      <Card elevation={3} className="task-card">
        <CardContent className="task-card-content">
          <Box className="task-card-header">
            <Box className="task-card-status-wrapper">
              <Box
                className={`task-card-status-icon-${task.status === TaskStatus.DONE ? "done" : task.status === TaskStatus.IN_PROGRESS ? "in-progress" : "todo"}`}
              >
                {getStatusIcon(task.status)}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => onOpenStatusMenu(e, task)}
                className="task-card-status-button"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              className={`task-card-title ${task.status === TaskStatus.DONE ? "task-card-title-done" : ""}`}
            >
              {task.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            className="task-card-description"
          >
            {task.description || "No description"}
          </Typography>

          <Box className="task-card-chips">
            <Chip
              label={task.status.replace("_", " ")}
              color={getStatusColor(task.status)}
              size="small"
              className="task-card-chip"
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
              className="task-card-chip"
            />
          </Box>
        </CardContent>

        <CardActions className="task-card-actions">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(task)}
            className="task-card-edit-button"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(task.id)}
            className="task-card-delete-button"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>
    </Fade>
  );
};
