import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from './error.middleware';

export async function authenticateRequest(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing authentication token');
  }
}
