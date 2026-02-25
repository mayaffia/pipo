import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { User } from '../../src/entities/User';

describe('Task API Integration Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Initialize database connection for tests
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    // Clean up database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Clean up database before each test
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.query('TRUNCATE TABLE tasks CASCADE');
    await userRepository.query('TRUNCATE TABLE users CASCADE');

    // Create a test user and get auth token
    const response = await request(app).post('/api/auth/register').send({
      email: 'tasktest@example.com',
      password: 'Password123',
      firstName: 'Task',
      lastName: 'Test',
    });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.status).toBe(taskData.status);
      expect(response.body.priority).toBe(taskData.priority);
      expect(response.body.userId).toBe(userId);
    });

    it('should return 401 without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
      };

      await request(app).post('/api/tasks').send(taskData).expect(401);
    });

    it('should return 400 for missing required fields', async () => {
      const taskData = {
        // missing title
        description: 'Test Description',
      };

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task 1',
          description: 'Description 1',
          status: 'todo',
          priority: 'high',
        });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task 2',
          description: 'Description 2',
          status: 'in_progress',
          priority: 'low',
        });
    });

    it('should return all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should return 401 without authentication', async () => {
      await request(app).get('/api/tasks').expect(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a test task
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Single Task',
          description: 'Single Description',
          status: 'todo',
          priority: 'medium',
        });

      taskId = response.body.id;
    });

    it('should return a specific task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Single Task');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app).get(`/api/tasks/${taskId}`).expect(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a test task
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          description: 'Original Description',
          status: 'todo',
          priority: 'low',
        });

      taskId = response.body.id;
    });

    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'in_progress',
        priority: 'high',
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
      expect(response.body.priority).toBe(updateData.priority);
      expect(response.body.description).toBe('Original Description');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated' })
        .expect(401);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a test task
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Delete',
          description: 'Will be deleted',
          status: 'todo',
          priority: 'low',
        });

      taskId = response.body.id;
    });

    it('should delete a task successfully', async () => {
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify task is deleted
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app).delete(`/api/tasks/${taskId}`).expect(401);
    });
  });

  describe('Task isolation between users', () => {
    let user2Token: string;
    let user1TaskId: string;

    beforeEach(async () => {
      // Create second user
      const user2Response = await request(app).post('/api/auth/register').send({
        email: 'user2@example.com',
        password: 'Password123',
        firstName: 'User',
        lastName: 'Two',
      });

      user2Token = user2Response.body.token;

      // Create task for user 1
      const taskResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'User 1 Task',
          description: 'Private task',
          status: 'todo',
          priority: 'medium',
        });

      user1TaskId = taskResponse.body.id;
    });

    it('should not allow user 2 to access user 1 tasks', async () => {
      await request(app)
        .get(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(404);
    });

    it('should not allow user 2 to update user 1 tasks', async () => {
      await request(app)
        .put(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Hacked' })
        .expect(404);
    });

    it('should not allow user 2 to delete user 1 tasks', async () => {
      await request(app)
        .delete(`/api/tasks/${user1TaskId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(404);
    });
  });
});