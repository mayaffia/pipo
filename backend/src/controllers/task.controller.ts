import { Response } from 'express';
import { TaskService, CreateTaskDto, UpdateTaskDto, TaskFilters } from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { TaskStatus, TaskPriority } from '../entities/Task';

const taskService = new TaskService();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const taskData: CreateTaskDto = {
      title,
      description,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    const task = await taskService.createTask(req.user.id, taskData);

    return res.status(201).json(task);
  } catch (error) {
    logger.error('Create task controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for current user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const filters: TaskFilters = {
      status: req.query.status as TaskStatus,
      priority: req.query.priority as TaskPriority,
      search: req.query.search as string,
    };

    const tasks = await taskService.getTasks(req.user.id, filters);

    return res.json(tasks);
  } catch (error) {
    logger.error('Get tasks controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task data
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const task = await taskService.getTaskById(id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    logger.error('Get task by ID controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const updateData: UpdateTaskDto = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status as TaskStatus;
    if (priority !== undefined) updateData.priority = priority as TaskPriority;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);

    const task = await taskService.updateTask(id, req.user.id, updateData);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    logger.error('Update task controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const deleted = await taskService.deleteTask(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(204).send();
  } catch (error) {
    logger.error('Delete task controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task statistics
 *       401:
 *         description: Unauthorized
 */
export const getTaskStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const stats = await taskService.getTaskStats(req.user.id);

    return res.json(stats);
  } catch (error) {
    logger.error('Get task stats controller error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};