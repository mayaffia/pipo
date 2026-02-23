import { useState } from "react";
import { Task } from "../types";

export const useStatusMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const open = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const close = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  return {
    anchorEl,
    selectedTask,
    isOpen: Boolean(anchorEl),
    open,
    close,
  };
};