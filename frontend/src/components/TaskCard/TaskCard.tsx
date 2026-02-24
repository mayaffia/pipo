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
import styles from "./TaskCard.module.css";

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
      <Card elevation={3} className={styles.taskCard}>
        <CardContent className={styles.taskCardContent}>
          <Box className={styles.taskCardHeader}>
            <Box className={styles.taskCardStatusWrapper}>
              <Box
                className={
                  task.status === TaskStatus.DONE
                    ? styles.taskCardStatusIconDone
                    : task.status === TaskStatus.IN_PROGRESS
                      ? styles.taskCardStatusIconInProgress
                      : styles.taskCardStatusIconTodo
                }
              >
                {getStatusIcon(task.status)}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => onOpenStatusMenu(e, task)}
                className={styles.taskCardStatusButton}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              className={`${styles.taskCardTitle} ${task.status === TaskStatus.DONE ? styles.taskCardTitleDone : ""}`}
            >
              {task.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.taskCardDescription}
          >
            {task.description || "No description"}
          </Typography>

          <Box className={styles.taskCardChips}>
            <Chip
              label={task.status.replace("_", " ")}
              color={getStatusColor(task.status)}
              size="small"
              className={styles.taskCardChip}
            />
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
              className={styles.taskCardChip}
            />
          </Box>
        </CardContent>

        <CardActions className={styles.taskCardActions}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(task)}
            className={styles.taskCardEditButton}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(task.id)}
            className={styles.taskCardDeleteButton}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>
    </Fade>
  );
};
