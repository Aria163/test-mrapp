// Load test environment variables BEFORE any imports
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long';
process.env.JWT_EXPIRES_IN = '1d';
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';

import { execSync } from 'child_process';
import prisma from '../src/config/database';

// Setup test database before all tests
beforeAll(async () => {
  // Run migrations for test database
  try {
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'ignore',
    });
  } catch (error) {
    // First time, need to create migration
    try {
      execSync('npx prisma migrate dev --name init', {
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        stdio: 'ignore',
      });
    } catch (e) {
      console.error('Failed to run migrations:', e);
    }
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
