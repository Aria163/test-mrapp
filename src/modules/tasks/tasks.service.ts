import prisma from '../../config/database';
import { CreateTaskInput, UpdateTaskInput } from './tasks.schemas';
import { NotFoundError, ForbiddenError } from '../../middleware/error.middleware';

export class TasksService {
  async createTask(userId: number, data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
    });

    return task;
  }

  async getTasks(userId: number, completed?: boolean) {
    const where: { userId: number; completed?: boolean } = { userId };

    if (completed !== undefined) {
      where.completed = completed;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  async getTaskById(userId: number, taskId: number) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this task');
    }

    return task;
  }

  async updateTask(userId: number, taskId: number, data: UpdateTaskInput) {
    // First verify the task exists and belongs to the user
    await this.getTaskById(userId, taskId);

    // Update the task
    const task = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return task;
  }

  async deleteTask(userId: number, taskId: number) {
    // First verify the task exists and belongs to the user
    await this.getTaskById(userId, taskId);

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
}
