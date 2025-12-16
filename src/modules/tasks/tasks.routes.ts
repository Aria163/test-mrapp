import { FastifyInstance } from 'fastify';
import { TasksController } from './tasks.controller';
import { authenticateRequest } from '../../middleware/auth.middleware';

export async function tasksRoutes(fastify: FastifyInstance) {
  const controller = new TasksController();

  // All task routes require authentication
  fastify.addHook('onRequest', authenticateRequest);

  fastify.post(
    '/',
    {
      schema: {
        description: 'Create a new task',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Task created successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  completed: { type: 'boolean' },
                  userId: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.createTask.bind(controller)
  );

  fastify.get(
    '/',
    {
      schema: {
        description: 'Get all tasks for authenticated user',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            completed: { type: 'string', enum: ['true', 'false'] },
          },
        },
        response: {
          200: {
            description: 'List of tasks',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    completed: { type: 'boolean' },
                    userId: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    controller.getTasks.bind(controller)
  );

  fastify.get(
    '/:id',
    {
      schema: {
        description: 'Get a task by ID',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Task details',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  completed: { type: 'boolean' },
                  userId: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.getTaskById.bind(controller)
  );

  fastify.put(
    '/:id',
    {
      schema: {
        description: 'Update a task',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
        },
        response: {
          200: {
            description: 'Task updated successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  completed: { type: 'boolean' },
                  userId: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.updateTask.bind(controller)
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        description: 'Delete a task',
        tags: ['tasks'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Task deleted successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.deleteTask.bind(controller)
  );
}
