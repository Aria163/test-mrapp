import prisma from '../../config/database';
import { NotFoundError } from '../../middleware/error.middleware';

export class UsersService {
  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
