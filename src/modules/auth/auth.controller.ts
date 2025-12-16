import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, registerSchema, loginSchema } from './auth.schemas';
import { env } from '../../config/env';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    // Validate input
    const data = registerSchema.parse(request.body);

    // Register user
    const user = await this.authService.register(data);

    // Generate JWT token
    const token = request.server.jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: env.JWT_EXPIRES_IN,
      }
    );

    return reply.status(201).send({
      success: true,
      data: {
        user,
        token,
      },
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    // Validate input
    const data = loginSchema.parse(request.body);

    // Login user
    const user = await this.authService.login(data);

    // Generate JWT token
    const token = request.server.jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: env.JWT_EXPIRES_IN,
      }
    );

    return reply.send({
      success: true,
      data: {
        user,
        token,
      },
    });
  }
}
