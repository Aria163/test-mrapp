import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController();

  fastify.post(
    '/register',
    {
      schema: {
        description: 'Register a new user',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        response: {
          201: {
            description: 'User registered successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      email: { type: 'string' },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' },
                    },
                  },
                  token: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.register.bind(controller)
  );

  fastify.post(
    '/login',
    {
      schema: {
        description: 'Login user',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'User logged in successfully',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      email: { type: 'string' },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' },
                    },
                  },
                  token: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    controller.login.bind(controller)
  );
}
