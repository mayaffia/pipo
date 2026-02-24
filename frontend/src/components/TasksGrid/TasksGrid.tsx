import React from "react";
import { Grid, Paper, Typography, Button, Fade } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { Task } from "../../types";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./TasksGrid.module.css";

interface TasksGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenStatusMenu: (event: React.MouseEvent<HTMLElement>, task: Task) => void;
  onCreateTask: () => void;
}

export const TasksGrid: React.FC<TasksGridProps> = ({
  tasks,
  onEdit,
  onDelete,
  onOpenStatusMenu,
  onCreateTask,
}) => {
  if (tasks.length === 0) {
    return (
      <Fade in timeout={1000}>
        <Paper elevation={3} className={styles.tasksGridEmpty}>
          <Typography
            variant="h5"
            color="text.secondary"
            gutterBottom
            className={styles.tasksGridEmptyTitle}
          >
            No tasks yet
          </Typography>
          <Typography
            color="text.secondary"
            className={styles.tasksGridEmptyDescription}
          >
            Create your first task to get started!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateTask}
            size="large"
            className={styles.tasksGridEmptyButton}
          >
            Create Your First Task
          </Button>
        </Paper>
      </Fade>
    );
  }

  return (
    <Grid container spacing={3}>
      {tasks.map((task, index) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <TaskCard
            task={task}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenStatusMenu={onOpenStatusMenu}
          />
        </Grid>
      ))}
    </Grid>
  );
};
