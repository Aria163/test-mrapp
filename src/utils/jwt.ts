import { FastifyRequest } from 'fastify';

export interface JwtPayload {
  userId: number;
  email: string;
}

// Extend @fastify/jwt types
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtPayload;
  }
}

export type AuthenticatedRequest = FastifyRequest;
