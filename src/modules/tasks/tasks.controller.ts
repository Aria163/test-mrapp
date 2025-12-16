import { FastifyReply } from 'fastify';
import { TasksService } from './tasks.service';
import { AuthenticatedRequest } from '../../utils/jwt';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema,
} from './tasks.schemas';

export class TasksController {
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();
  }

  async createTask(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const data = createTaskSchema.parse(request.body);

    const task = await this.tasksService.createTask(userId, data);

    return reply.status(201).send({
      success: true,
      data: task,
    });
  }

  async getTasks(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const { completed } = taskQuerySchema.parse(request.query);

    const tasks = await this.tasksService.getTasks(userId, completed);

    return reply.send({
      success: true,
      data: tasks,
    });
  }

  async getTaskById(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const { id } = taskIdSchema.parse(request.params);

    const task = await this.tasksService.getTaskById(userId, id);

    return reply.send({
      success: true,
      data: task,
    });
  }

  async updateTask(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const { id } = taskIdSchema.parse(request.params);
    const data = updateTaskSchema.parse(request.body);

    const task = await this.tasksService.updateTask(userId, id, data);

    return reply.send({
      success: true,
      data: task,
    });
  }

  async deleteTask(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user.userId;
    const { id } = taskIdSchema.parse(request.params);

    const result = await this.tasksService.deleteTask(userId, id);

    return reply.send({
      success: true,
      data: result,
    });
  }
}
