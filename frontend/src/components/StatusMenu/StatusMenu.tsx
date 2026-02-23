import React from "react";
import { Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { Task, TaskStatus } from "../../types";
import "./StatusMenu.css";

interface StatusMenuProps {
  anchorEl: HTMLElement | null;
  selectedTask: Task | null;
  onClose: () => void;
  onChangeStatus: (status: TaskStatus) => void;
}

export const StatusMenu: React.FC<StatusMenuProps> = ({
  anchorEl,
  selectedTask,
  onClose,
  onChangeStatus,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        className: "status-menu-paper",
      }}
    >
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.TODO)}
        disabled={selectedTask?.status === TaskStatus.TODO}
        className="status-menu-item status-menu-item-todo"
      >
        <ListItemIcon>
          <RadioButtonUncheckedIcon
            fontSize="small"
            className="status-menu-icon-todo"
          />
        </ListItemIcon>
        <Typography>To Do</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.IN_PROGRESS)}
        disabled={selectedTask?.status === TaskStatus.IN_PROGRESS}
        className="status-menu-item status-menu-item-in-progress"
      >
        <ListItemIcon>
          <AccessTimeIcon
            fontSize="small"
            className="status-menu-icon-in-progress"
          />
        </ListItemIcon>
        <Typography>In Progress</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.DONE)}
        disabled={selectedTask?.status === TaskStatus.DONE}
        className="status-menu-item status-menu-item-done"
      >
        <ListItemIcon>
          <CheckCircleIcon fontSize="small" className="status-menu-icon-done" />
        </ListItemIcon>
        <Typography>Done</Typography>
      </MenuItem>
    </Menu>
  );
};
