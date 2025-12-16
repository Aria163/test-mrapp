import { config } from 'dotenv';
import { execSync } from 'child_process';
import prisma from '../src/config/database';

// Load test environment variables
config({ path: '.env.test' });

// Setup test database before all tests
beforeAll(async () => {
  // Run migrations for test database
  try {
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'ignore',
    });
  } catch (error) {
    console.error('Failed to run migrations:', error);
  }
});

// Clean up database before each test
beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

// Disconnect from database after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
