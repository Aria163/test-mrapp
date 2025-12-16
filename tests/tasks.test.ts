import { buildApp } from '../src/app';
import { FastifyInstance } from 'fastify';

describe('Tasks Module', () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: number;
  let secondUserToken: string;

  beforeAll(async () => {
    app = await buildApp();
  });

  beforeEach(async () => {
    // Register and login first user for each test
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'taskuser@example.com',
        password: 'password123',
      },
    });
    const registerBody = JSON.parse(registerResponse.body);
    authToken = registerBody.data.token;
    userId = registerBody.data.user.id;

    // Register second user for isolation tests
    const secondUserResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'seconduser@example.com',
        password: 'password123',
      },
    });
    const secondUserBody = JSON.parse(secondUserResponse.body);
    secondUserToken = secondUserBody.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          title: 'Test Task',
          description: 'Test Description',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe('Test Task');
      expect(body.data.description).toBe('Test Description');
      expect(body.data.completed).toBe(false);
      expect(body.data.userId).toBe(userId);
    });

    it('should create task without description', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          title: 'Task without description',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.data.description).toBeNull();
    });

    it('should fail without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        payload: {
          title: 'Unauthorized Task',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: {
          authorization: 'Bearer invalid-token',
        },
        payload: {
          title: 'Task',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should fail without title', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          description: 'No title',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Task 1' },
      });
      // Create a completed task by updating it
      const taskResponse = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Task 2' },
      });
      const task2 = JSON.parse(taskResponse.body);
      await app.inject({
        method: 'PUT',
        url: `/api/tasks/${task2.data.id}`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { completed: true },
      });
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tasks',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter tasks by completed status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tasks?completed=false',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.every((task: { completed: boolean }) => task.completed === false)).toBe(
        true
      );
    });

    it('should isolate tasks between users', async () => {
      // Get tasks for second user
      const response = await app.inject({
        method: 'GET',
        url: '/api/tasks',
        headers: {
          authorization: `Bearer ${secondUserToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBe(0); // Second user should have no tasks
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      // Create a test task
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Specific Task' },
      });
      const body = JSON.parse(response.body);
      taskId = body.data.id;
    });

    it('should get task by id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/tasks/${taskId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(taskId);
      expect(body.data.title).toBe('Specific Task');
    });

    it('should fail to get task from different user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/tasks/${taskId}`,
        headers: {
          authorization: `Bearer ${secondUserToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should fail with non-existent task id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tasks/999999',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Update Task', description: 'Original' },
      });
      const body = JSON.parse(response.body);
      taskId = body.data.id;
    });

    it('should update task title', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Updated Title' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.title).toBe('Updated Title');
      expect(body.data.description).toBe('Original');
    });

    it('should update task completed status', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${authToken}` },
        payload: { completed: true },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.completed).toBe(true);
    });

    it('should fail to update task from different user', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${secondUserToken}` },
        payload: { title: 'Hacked' },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Delete Task' },
      });
      const body = JSON.parse(response.body);
      taskId = body.data.id;
    });

    it('should delete task', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${authToken}` },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);

      // Verify task is deleted
      const getResponse = await app.inject({
        method: 'GET',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${authToken}` },
      });
      expect(getResponse.statusCode).toBe(404);
    });

    it('should fail to delete task from different user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/tasks/${taskId}`,
        headers: { authorization: `Bearer ${secondUserToken}` },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /api/users/me', () => {
    it('should get user profile with tasks', async () => {
      // Create a task first
      await app.inject({
        method: 'POST',
        url: '/api/tasks',
        headers: { authorization: `Bearer ${authToken}` },
        payload: { title: 'Profile Task' },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.email).toBe('taskuser@example.com');
      expect(body.data.tasks).toBeInstanceOf(Array);
      expect(body.data).not.toHaveProperty('password');
    });

    it('should fail without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/me',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
