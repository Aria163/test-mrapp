import { FastifyRequest } from 'fastify';

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: JwtPayload;
}
