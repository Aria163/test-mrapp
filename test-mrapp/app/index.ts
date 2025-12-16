import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Creazione di un utente
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'securepassword123',
    },
  });

  console.log('User created:', user);

  // Creazione di un task
  const task = await prisma.task.create({
    data: {
      title: 'First Task',
      description: 'Complete the REST API project',
      userId: user.id,
    },
  });

  console.log('Task created:', task);

  // Recupero degli utenti con i loro task
  const usersWithTasks = await prisma.user.findMany({
    include: { tasks: true },
  });

  console.log('Users with Tasks:', usersWithTasks);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });