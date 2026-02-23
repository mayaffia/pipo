import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Task, TaskStatus, CreateTaskRequest } from "../types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTasks();
      setAllTasks(data);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async (taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      const createdTask = await apiService.createTask(taskData);
      setAllTasks([createdTask, ...allTasks]);
      return createdTask;
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task");
      return null;
    }
  };

  const updateTask = async (id: string, taskData: Partial<CreateTaskRequest>): Promise<Task | null> => {
    try {
      const updatedTask = await apiService.updateTask(id, taskData);
      setAllTasks(allTasks.map((task) => (task.id === id ? updatedTask : task)));
      return updatedTask;
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task");
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await apiService.deleteTask(id);
      setAllTasks(allTasks.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
      return false;
    }
  };

  const filterTasks = (status: TaskStatus | "all") => {
    if (status === "all") {
      setTasks(allTasks);
    } else {
      setTasks(allTasks.filter((task) => task.status === status));
    }
  };

  return {
    tasks,
    allTasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    filterTasks,
    refreshTasks: loadTasks,
  };
};