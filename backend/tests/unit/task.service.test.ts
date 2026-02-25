import { TaskService } from '../../src/services/task.service';
import { AppDataSource } from '../../src/config/database';
import { TaskStatus, TaskPriority } from '../../src/entities/Task';

jest.mock('../../src/config/database');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(() => {
    mockTaskRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      })),
    };

    (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockTaskRepository);
    
    taskService = new TaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should successfully create a new task', async () => {
      const userId = 'user-123';
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      };

      const mockTask = {
        id: 'task-123',
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await taskService.createTask(userId, taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...taskData,
        userId,
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks for a user', async () => {
      const userId = 'user-123';
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          userId,
          status: 'todo',
          priority: 'high',
        },
        {
          id: 'task-2',
          title: 'Task 2',
          userId,
          status: 'done',
          priority: 'low',
        },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTasks),
      };
      
      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await taskService.getTasks(userId);

      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const userId = 'user-123';
      const taskId = 'task-123';
      const mockTask = {
        id: taskId,
        title: 'Test Task',
        userId,
        status: 'todo',
        priority: 'medium',
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(taskId, userId);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error if task not found', async () => {
      const userId = 'user-123';
      const taskId = 'non-existent';

      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.getTaskById(taskId, userId);

      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should successfully update a task', async () => {
      const userId = 'user-123';
      const taskId = 'task-123';
      const updateData = {
        title: 'Updated Title',
        status: TaskStatus.IN_PROGRESS,
      };

      const existingTask = {
        id: taskId,
        title: 'Old Title',
        userId,
        status: 'todo',
        priority: 'medium',
      };

      const updatedTask = {
        ...existingTask,
        ...updateData,
      };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(taskId, userId, updateData);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result!.title).toBe(updateData.title);
      expect(result!.status).toBe(updateData.status);
    });

    it('should throw error if task not found', async () => {
      const userId = 'user-123';
      const taskId = 'non-existent';
      const updateData = { title: 'Updated' };

      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.updateTask(taskId, userId, updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should successfully delete a task', async () => {
      const userId = 'user-123';
      const taskId = 'task-123';

      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await taskService.deleteTask(taskId, userId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith({ id: taskId, userId });
      expect(result).toBe(true);
    });

    it('should throw error if task not found', async () => {
      const userId = 'user-123';
      const taskId = 'non-existent';

      mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await taskService.deleteTask(taskId, userId);

      expect(result).toBe(false);
    });
  });
});