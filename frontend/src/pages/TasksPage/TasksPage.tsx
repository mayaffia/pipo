import React, { useEffect, useState } from "react";
import { Container, Box, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TaskStatus } from "../../types";
import {
  TasksHeader,
  TasksGrid,
  TaskDialog,
  StatusMenu,
  LoadingScreen,
  NotificationSnackbar,
} from "../../components";
import {
  useTasks,
  useSnackbar,
  useTaskDialog,
  useStatusMenu,
} from "../../hooks";
import "./TasksPage.modules.css";

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");

  // Custom hooks
  const { tasks, loading, createTask, updateTask, deleteTask, filterTasks } =
    useTasks();
  const {
    snackbar,
    showSuccess,
    showError,
    close: closeSnackbar,
  } = useSnackbar();
  const dialog = useTaskDialog();
  const statusMenu = useStatusMenu();

  // Initialize filter from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (
      status &&
      (status === "done" || status === "in_progress" || status === "todo")
    ) {
      setFilterStatus(status as TaskStatus);
    }
  }, []);

  // Apply filter when it changes
  useEffect(() => {
    filterTasks(filterStatus);
  }, [filterStatus, filterTasks]);

  // Handlers
  const handleCreateTask = async () => {
    if (!dialog.taskData.title.trim()) {
      showError("Please enter a task title");
      return;
    }

    const result = await createTask(dialog.taskData);
    if (result) {
      dialog.close();
      showSuccess("Task created successfully!");
    } else {
      showError("Failed to create task");
    }
  };

  const handleUpdateTask = async () => {
    if (!dialog.editingTask) return;

    if (!dialog.taskData.title.trim()) {
      showError("Please enter a task title");
      return;
    }

    const result = await updateTask(dialog.editingTask.id, dialog.taskData);
    if (result) {
      dialog.close();
      showSuccess("Task updated successfully!");
    } else {
      showError("Failed to update task");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const result = await deleteTask(id);
      if (result) {
        showSuccess("Task deleted successfully");
      } else {
        showError("Failed to delete task");
      }
    }
  };

  const handleChangeStatus = async (newStatus: TaskStatus) => {
    if (!statusMenu.selectedTask) return;

    const result = await updateTask(statusMenu.selectedTask.id, {
      title: statusMenu.selectedTask.title,
      description: statusMenu.selectedTask.description,
      status: newStatus,
      priority: statusMenu.selectedTask.priority,
    });

    if (result) {
      const statusLabels = {
        [TaskStatus.TODO]: "To Do",
        [TaskStatus.IN_PROGRESS]: "In Progress",
        [TaskStatus.DONE]: "Done",
      };
      showSuccess(`Task status changed to ${statusLabels[newStatus]}`);
    } else {
      showError("Failed to update task status");
    }

    statusMenu.close();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box className="tasks-page">
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <TasksHeader
              filterStatus={filterStatus}
              onClearFilter={() => setFilterStatus("all")}
              onNavigateToDashboard={() => navigate("/dashboard")}
              onCreateTask={dialog.openCreate}
            />

            <TasksGrid
              tasks={tasks}
              onEdit={dialog.openEdit}
              onDelete={handleDeleteTask}
              onOpenStatusMenu={statusMenu.open}
              onCreateTask={dialog.openCreate}
            />
          </Box>
        </Fade>

        <TaskDialog
          open={dialog.open}
          isEditing={dialog.isEditing}
          task={dialog.taskData}
          onClose={dialog.close}
          onSave={dialog.isEditing ? handleUpdateTask : handleCreateTask}
          onChange={dialog.updateTaskData}
        />

        <StatusMenu
          anchorEl={statusMenu.anchorEl}
          selectedTask={statusMenu.selectedTask}
          onClose={statusMenu.close}
          onChangeStatus={handleChangeStatus}
        />

        <NotificationSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
        />
      </Container>
    </Box>
  );
};

export default TasksPage;
