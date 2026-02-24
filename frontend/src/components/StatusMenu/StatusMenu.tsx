import React from "react";
import { Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { Task, TaskStatus } from "../../types";
import styles from "./StatusMenu.module.css";

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
        className: styles.statusMenuPaper,
      }}
    >
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.TODO)}
        disabled={selectedTask?.status === TaskStatus.TODO}
        className={`${styles.statusMenuItem} ${styles.statusMenuItemTodo}`}
      >
        <ListItemIcon>
          <RadioButtonUncheckedIcon
            fontSize="small"
            className={styles.statusMenuIconTodo}
          />
        </ListItemIcon>
        <Typography>To Do</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.IN_PROGRESS)}
        disabled={selectedTask?.status === TaskStatus.IN_PROGRESS}
        className={`${styles.statusMenuItem} ${styles.statusMenuItemInProgress}`}
      >
        <ListItemIcon>
          <AccessTimeIcon
            fontSize="small"
            className={styles.statusMenuIconInProgress}
          />
        </ListItemIcon>
        <Typography>In Progress</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => onChangeStatus(TaskStatus.DONE)}
        disabled={selectedTask?.status === TaskStatus.DONE}
        className={`${styles.statusMenuItem} ${styles.statusMenuItemDone}`}
      >
        <ListItemIcon>
          <CheckCircleIcon
            fontSize="small"
            className={styles.statusMenuIconDone}
          />
        </ListItemIcon>
        <Typography>Done</Typography>
      </MenuItem>
    </Menu>
  );
};
