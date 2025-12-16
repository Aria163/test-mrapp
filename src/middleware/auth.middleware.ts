import { FastifyRequest, FastifyReply } from 'fastify';

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function authenticateRequest(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing authentication token');
  }
}
