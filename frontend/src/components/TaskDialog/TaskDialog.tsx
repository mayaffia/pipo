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
import "./TaskDialog.css";

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
        className: "task-dialog-paper",
      }}
    >
      <DialogTitle className="task-dialog-title">
        {isEditing ? "Edit Task" : "Create New Task"}
      </DialogTitle>
      <DialogContent className="task-dialog-content">
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          required
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className="task-dialog-field"
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className="task-dialog-field"
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
          className="task-dialog-field"
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
      <DialogActions className="task-dialog-actions">
        <Button onClick={onClose} className="task-dialog-cancel-button">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          className="task-dialog-save-button"
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
