import { AppDataSource } from '../config/database';
import { Task, TaskStatus, TaskPriority } from '../entities/Task';
import { logger } from '../utils/logger';
import { FindOptionsWhere } from 'typeorm';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

  async createTask(userId: string, data: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create({
        ...data,
        userId,
      });

      await this.taskRepository.save(task);
      logger.info(`Task created: ${task.id} by user ${userId}`);

      return task;
    } catch (error) {
      logger.error('Create task error:', error);
      throw error;
    }
  }

  async getTasks(userId: string, filters?: TaskFilters): Promise<Task[]> {
    try {
      const where: FindOptionsWhere<Task> = { userId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.priority) {
        where.priority = filters.priority;
      }

      let query = this.taskRepository.createQueryBuilder('task').where('task.userId = :userId', {
        userId,
      });

      if (filters?.status) {
        query = query.andWhere('task.status = :status', { status: filters.status });
      }

      if (filters?.priority) {
        query = query.andWhere('task.priority = :priority', { priority: filters.priority });
      }

      if (filters?.search) {
        query = query.andWhere(
          '(task.title ILIKE :search OR task.description ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      const tasks = await query.orderBy('task.createdAt', 'DESC').getMany();

      return tasks;
    } catch (error) {
      logger.error('Get tasks error:', error);
      throw error;
    }
  }

  async getTaskById(id: string, userId: string): Promise<Task | null> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id, userId },
      });

      return task;
    } catch (error) {
      logger.error('Get task error:', error);
      throw error;
    }
  }

  async updateTask(id: string, userId: string, data: UpdateTaskDto): Promise<Task | null> {
    try {
      const task = await this.getTaskById(id, userId);

      if (!task) {
        return null;
      }

      Object.assign(task, data);
      await this.taskRepository.save(task);

      logger.info(`Task updated: ${id} by user ${userId}`);

      return task;
    } catch (error) {
      logger.error('Update task error:', error);
      throw error;
    }
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    try {
      const result = await this.taskRepository.delete({ id, userId });

      if (result.affected === 0) {
        return false;
      }

      logger.info(`Task deleted: ${id} by user ${userId}`);

      return true;
    } catch (error) {
      logger.error('Delete task error:', error);
      throw error;
    }
  }

  async getTaskStats(userId: string): Promise<{
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  }> {
    try {
      const tasks = await this.getTasks(userId);

      const stats = {
        total: tasks.length,
        byStatus: {
          [TaskStatus.TODO]: 0,
          [TaskStatus.IN_PROGRESS]: 0,
          [TaskStatus.DONE]: 0,
        },
        byPriority: {
          [TaskPriority.LOW]: 0,
          [TaskPriority.MEDIUM]: 0,
          [TaskPriority.HIGH]: 0,
        },
      };

      tasks.forEach((task) => {
        stats.byStatus[task.status]++;
        stats.byPriority[task.priority]++;
      });

      return stats;
    } catch (error) {
      logger.error('Get task stats error:', error);
      throw error;
    }
  }
}