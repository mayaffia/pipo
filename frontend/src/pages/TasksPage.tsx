import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
  Alert,
  Snackbar,
  Menu,
  ListItemIcon,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Task, TaskStatus, TaskPriority, CreateTaskRequest } from "../types";

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    // Get filter from URL query params
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (
      status &&
      (status === "done" || status === "in_progress" || status === "todo")
    ) {
      setFilterStatus(status as TaskStatus);
    }
  }, []);

  useEffect(() => {
    // Apply filter
    if (filterStatus === "all") {
      setTasks(allTasks);
    } else {
      setTasks(allTasks.filter((task) => task.status === filterStatus));
    }
  }, [filterStatus, allTasks]);

  const loadTasks = async () => {
    try {
      const data = await apiService.getTasks();
      setAllTasks(data);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      showSnackbar("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      showSnackbar("Please enter a task title", "error");
      return;
    }

    try {
      const createdTask = await apiService.createTask(newTask);
      setAllTasks([createdTask, ...allTasks]);
      setOpenDialog(false);
      setNewTask({
        title: "",
        description: "",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
      });
      showSnackbar("Task created successfully!", "success");
    } catch (error) {
      console.error("Failed to create task:", error);
      showSnackbar("Failed to create task", "error");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });
    setOpenDialog(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    if (!newTask.title.trim()) {
      showSnackbar("Please enter a task title", "error");
      return;
    }

    try {
      const updatedTask = await apiService.updateTask(editingTask.id, newTask);
      setAllTasks(
        allTasks.map((task) =>
          task.id === editingTask.id ? updatedTask : task,
        ),
      );
      setOpenDialog(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
      });
      showSnackbar("Task updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update task:", error);
      showSnackbar("Failed to update task", "error");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    });
  };

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLElement>,
    task: Task,
  ) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedTask(task);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
    setSelectedTask(null);
  };

  const handleChangeStatus = async (newStatus: TaskStatus) => {
    if (!selectedTask) return;

    try {
      // Create updated task object with all existing fields plus new status
      const updatedTask = await apiService.updateTask(selectedTask.id, {
        title: selectedTask.title,
        description: selectedTask.description,
        status: newStatus,
        priority: selectedTask.priority,
      });

      // Update allTasks with the complete task data
      const updatedAllTasks = allTasks.map((t) =>
        t.id === selectedTask.id ? updatedTask : t,
      );
      setAllTasks(updatedAllTasks);

      const statusLabels = {
        [TaskStatus.TODO]: "To Do",
        [TaskStatus.IN_PROGRESS]: "In Progress",
        [TaskStatus.DONE]: "Done",
      };

      showSnackbar(
        `Task status changed to ${statusLabels[newStatus]}`,
        "success",
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      showSnackbar("Failed to update task status", "error");
    } finally {
      handleCloseStatusMenu();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteTask(id);
      setAllTasks(allTasks.filter((task) => task.id !== id));
      showSnackbar("Task deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete task:", error);
      showSnackbar("Failed to delete task", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  My Tasks
                </Typography>
                {filterStatus !== "all" && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1,
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={`Filter: ${filterStatus.replace("_", " ")}`}
                      onDelete={() => setFilterStatus("all")}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            color: "white",
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    bgcolor: "white",
                    color: "#667eea",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      // transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                    // transition: "all 0.3s ease",
                  }}
                >
                  Create Task
                </Button>
              </Box>
            </Box>

            {/* Tasks Grid */}
            {tasks.length === 0 ? (
              <Fade in timeout={1000}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No tasks yet
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Create your first task to get started!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Create Your First Task
                  </Button>
                </Paper>
              </Fade>
            ) : (
              <Grid container spacing={3}>
                {tasks.map((task, index) => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Fade in timeout={500 + index * 100}>
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          background: "rgba(255,255,255,0.95)",
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            // transform: "translateY(-8px)",
                            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  color:
                                    task.status === TaskStatus.DONE
                                      ? "#48bb78"
                                      : task.status === TaskStatus.IN_PROGRESS
                                        ? "#ed8936"
                                        : "#cbd5e0",
                                }}
                              >
                                {getStatusIcon(task.status)}
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenStatusMenu(e, task)}
                                sx={{
                                  padding: "2px",
                                  "&:hover": {
                                    bgcolor: "rgba(102, 126, 234, 0.1)",
                                  },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                flexGrow: 1,
                                fontWeight: 600,
                                color: "#2d3748",
                                textDecoration:
                                  task.status === TaskStatus.DONE
                                    ? "line-through"
                                    : "none",
                                opacity:
                                  task.status === TaskStatus.DONE ? 0.7 : 1,
                              }}
                            >
                              {task.title}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, minHeight: 40 }}
                          >
                            {task.description || "No description"}
                          </Typography>

                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            <Chip
                              label={task.status.replace("_", " ")}
                              color={getStatusColor(task.status)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                            <Chip
                              label={task.priority}
                              color={getPriorityColor(task.priority)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </CardContent>

                        <CardActions
                          sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditTask(task)}
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(task.id)}
                            sx={{
                              "&:hover": {
                                bgcolor: "rgba(244, 67, 54, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Create/Edit Task Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              required
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Status"
              fullWidth
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value as TaskStatus })
              }
              sx={{ mb: 2 }}
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
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as TaskPriority,
                })
              }
            >
              <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                px: 3,
              }}
            >
              {editingTask ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Status Change Menu */}
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={handleCloseStatusMenu}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          <MenuItem
            onClick={() => handleChangeStatus(TaskStatus.TODO)}
            disabled={selectedTask?.status === TaskStatus.TODO}
            sx={{
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(203, 213, 224, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <RadioButtonUncheckedIcon
                fontSize="small"
                sx={{ color: "#cbd5e0" }}
              />
            </ListItemIcon>
            <Typography>To Do</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeStatus(TaskStatus.IN_PROGRESS)}
            disabled={selectedTask?.status === TaskStatus.IN_PROGRESS}
            sx={{
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(237, 137, 54, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <AccessTimeIcon fontSize="small" sx={{ color: "#ed8936" }} />
            </ListItemIcon>
            <Typography>In Progress</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => handleChangeStatus(TaskStatus.DONE)}
            disabled={selectedTask?.status === TaskStatus.DONE}
            sx={{
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(72, 187, 120, 0.1)",
              },
            }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" sx={{ color: "#48bb78" }} />
            </ListItemIcon>
            <Typography>Done</Typography>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default TasksPage;
