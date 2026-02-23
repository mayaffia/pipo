import { useState } from "react";
import { Task, TaskStatus, TaskPriority, CreateTaskRequest } from "../types";

const initialTaskState: CreateTaskRequest = {
  title: "",
  description: "",
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
};

export const useTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskData, setTaskData] = useState<CreateTaskRequest>(initialTaskState);

  const openCreate = () => {
    setEditingTask(null);
    setTaskData(initialTaskState);
    setOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTaskData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditingTask(null);
    setTaskData(initialTaskState);
  };

  const updateTaskData = (data: CreateTaskRequest) => {
    setTaskData(data);
  };

  return {
    open,
    isEditing: !!editingTask,
    editingTask,
    taskData,
    openCreate,
    openEdit,
    close,
    updateTaskData,
  };
};