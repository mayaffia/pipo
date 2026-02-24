import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { TaskStatus, TaskPriority, CreateTaskRequest } from "../../types";
import styles from "./TaskDialog.module.css";

interface TaskDialogProps {
  open: boolean;
  isEditing: boolean;
  task: CreateTaskRequest;
  onClose: () => void;
  onSave: () => void;
  onChange: (task: CreateTaskRequest) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  isEditing,
  task,
  onClose,
  onSave,
  onChange,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: styles.taskDialogPaper,
      }}
    >
      <DialogTitle className={styles.taskDialogTitle}>
        {isEditing ? "Edit Task" : "Create New Task"}
      </DialogTitle>
      <DialogContent className={styles.taskDialogContent}>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          required
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className={styles.taskDialogField}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className={styles.taskDialogField}
        />
        <TextField
          select
          margin="dense"
          label="Status"
          fullWidth
          value={task.status}
          onChange={(e) =>
            onChange({ ...task, status: e.target.value as TaskStatus })
          }
          className={styles.taskDialogField}
        >
          <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
          <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
          <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
        </TextField>
        <TextField
          select
          margin="dense"
          label="Priority"
          fullWidth
          value={task.priority}
          onChange={(e) =>
            onChange({ ...task, priority: e.target.value as TaskPriority })
          }
        >
          <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
          <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
          <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions className={styles.taskDialogActions}>
        <Button onClick={onClose} className={styles.taskDialogCancelButton}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          className={styles.taskDialogSaveButton}
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
