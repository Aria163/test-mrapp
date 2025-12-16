import { FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../../utils/jwt';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  async getProfile(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const user = await this.usersService.getProfile(userId);

    return reply.send({
      success: true,
      data: user,
    });
  }
}
