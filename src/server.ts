import { buildApp } from './app';
import { env } from './config/env';
import { disconnectDatabase } from './config/database';

async function start() {
  try {
    const app = await buildApp();

    // Start server
    await app.listen({
      port: parseInt(env.PORT),
      host: '0.0.0.0',
    });

    console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${env.PORT}/docs`);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`\n${signal} received, shutting down gracefully...`);
        await app.close();
        await disconnectDatabase();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

start();
