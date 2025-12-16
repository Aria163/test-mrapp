# Setup Guide

This guide will walk you through setting up the REST API project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional, for containerized deployment) - [Download here](https://www.docker.com/)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/Aria163/test-mrapp.git
cd test-mrapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
# For local development with SQLite (easiest)
DATABASE_URL="file:./dev.db"

# IMPORTANT: Change this to a secure secret (minimum 32 characters)
JWT_SECRET="your-very-secure-secret-key-at-least-32-characters-long"

JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
LOG_LEVEL="info"
```

⚠️ **Security Note**: Never use the example JWT_SECRET in production. Generate a secure random string:

```bash
# Generate a secure secret (Linux/Mac)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Setup the Database

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will create a SQLite database file (`dev.db`) in your project root.

### 5. Start the Development Server

```bash
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:3000
📚 API Documentation available at http://localhost:3000/docs
```

### 6. Test the API

Open your browser and navigate to:
- API Documentation: http://localhost:3000/docs
- Health Check: http://localhost:3000/health

Or test with curl:

```bash
# Health check
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Setup with PostgreSQL

### 1. Install PostgreSQL

#### Using Docker (Recommended)

```bash
docker run --name postgres-db \
  -e POSTGRES_USER=restapi \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=restapi \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Using Docker Compose

```bash
# Start just PostgreSQL
docker-compose up -d postgres
```

#### Manual Installation

Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/) and create a database:

```sql
CREATE DATABASE restapi;
CREATE USER restapi WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE restapi TO restapi;
```

### 2. Update Environment Variables

Update `.env` for PostgreSQL:

```env
DATABASE_URL="postgresql://restapi:secure_password@localhost:5432/restapi"
JWT_SECRET="your-production-secret-minimum-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="production"
LOG_LEVEL="info"
```

### 3. Update Prisma Schema

Edit `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 4. Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Build and Start

```bash
npm run build
npm start
```

## Docker Deployment

### Full Stack with Docker Compose

The easiest way to deploy the entire application:

```bash
# Start everything (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

The API will be available at http://localhost:3000

### Custom Docker Build

Build and run just the application:

```bash
# Build the image
docker build -t rest-api .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  --name rest-api \
  rest-api
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

### Database Management

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database (if you create a seed file)
npx prisma db seed
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

1. Change the `PORT` in `.env` to a different port (e.g., 3001)
2. Or kill the process using port 3000:

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Issues

**SQLite**:
- Ensure the directory is writable
- Check that `dev.db` was created
- Try deleting `dev.db` and running migrations again

**PostgreSQL**:
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Ensure database exists
- Check firewall/network settings

### JWT Token Issues

If you get "Invalid token" errors:
- Ensure `JWT_SECRET` is at least 32 characters
- Check that `JWT_SECRET` matches between server restarts
- Verify token hasn't expired (check `JWT_EXPIRES_IN`)

### Prisma Client Issues

If you get "Prisma Client not found":

```bash
npm run prisma:generate
```

If migrations fail:

```bash
# Reset and start fresh (WARNING: deletes data)
npx prisma migrate reset
npm run prisma:migrate
```

## Environment-Specific Configuration

### Development

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
LOG_LEVEL="debug"  # More verbose logging
```

### Testing

Tests use their own configuration in `.env.test`:

```env
DATABASE_URL="file:./test.db"
NODE_ENV="test"
LOG_LEVEL="silent"  # No logs during tests
```

### Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NODE_ENV="production"
LOG_LEVEL="warn"  # Only warnings and errors
```

## Next Steps

1. ✅ Read the [API_EXAMPLES.md](./API_EXAMPLES.md) for detailed API usage
2. ✅ Explore the API documentation at http://localhost:3000/docs
3. ✅ Check out the test files in `tests/` for examples
4. ✅ Review the [README.md](./README.md) for architecture details

## Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [API_EXAMPLES.md](./API_EXAMPLES.md) for usage examples
- Look at test files for implementation examples
- Check logs for error messages

## Security Checklist for Production

- [ ] Change `JWT_SECRET` to a secure random string (min 32 characters)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS (use a reverse proxy like Nginx)
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting for authentication endpoints
- [ ] Configure CORS properly for your domain
- [ ] Set up proper logging and monitoring
- [ ] Use environment variable management (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Enable database backups
- [ ] Set up CI/CD pipeline
- [ ] Review and update dependencies regularly
- [ ] Add helmet for security headers
