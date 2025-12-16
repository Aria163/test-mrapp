import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const taskIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const taskQuerySchema = z.object({
  completed: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
