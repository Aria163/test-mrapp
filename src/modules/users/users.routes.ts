import { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { authenticateRequest } from '../../middleware/auth.middleware';

export async function usersRoutes(fastify: FastifyInstance) {
  const controller = new UsersController();

  fastify.get(
    '/me',
    {
      onRequest: [authenticateRequest],
      schema: {
        description: 'Get authenticated user profile',
        tags: ['users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'User profile with tasks',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  tasks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        completed: { type: 'boolean' },
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
      },
    },
    controller.getProfile.bind(controller)
  );
}
