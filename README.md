# REST API - Users & Tasks Management

A complete, production-ready REST API for user and task management built with Node.js, TypeScript, Fastify, and Prisma.

## 📋 Description

This project implements a comprehensive REST API that allows users to register, authenticate, and manage their personal task lists (to-do). It demonstrates modern backend development practices with a focus on type safety, performance, and maintainability.

## 🎯 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Complete CRUD operations for tasks
- **User Isolation**: Tasks are isolated per user - users can only access their own tasks
- **Input Validation**: Runtime validation with Zod schemas
- **Type Safety**: Full TypeScript support with strict mode enabled
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: Password hashing with bcrypt, JWT authentication
- **Testing**: Comprehensive test suite with >70% coverage
- **Docker Support**: Containerized deployment with Docker Compose
- **Database Migrations**: Managed with Prisma

## 🛠 Technical Stack & Architecture Decisions

### Why Fastify?
- **Performance**: One of the fastest Node.js web frameworks
- **TypeScript-First**: Excellent TypeScript support out of the box
- **Plugin Architecture**: Extensible and modular design
- **JSON Schema**: Built-in validation and serialization
- **Logging**: Integrated Pino logger for performance

### Why Prisma?
- **Type Safety**: Auto-generated TypeScript types from schema
- **Developer Experience**: Intuitive API and excellent tooling
- **Migrations**: Robust database migration system
- **Multi-Database**: Supports PostgreSQL, MySQL, SQLite, and more
- **Query Builder**: Type-safe query builder with IntelliSense

### Why PostgreSQL?
- **Robustness**: Battle-tested, reliable database
- **ACID Compliance**: Ensures data integrity
- **Advanced Features**: JSON support, full-text search, and more
- **Scalability**: Handles large datasets efficiently
- **Community**: Large ecosystem and community support

### Why Zod?
- **Runtime Validation**: Validates data at runtime, not just compile time
- **TypeScript Integration**: Infers TypeScript types from schemas
- **Composability**: Easy to create complex validation schemas
- **Error Messages**: Clear, customizable validation errors

## 📁 Project Structure

```
.
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schemas.ts
│   │   │   └── auth.routes.ts
│   │   ├── users/         # Users module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.routes.ts
│   │   └── tasks/         # Tasks module
│   │       ├── tasks.controller.ts
│   │       ├── tasks.service.ts
│   │       ├── tasks.schemas.ts
│   │       └── tasks.routes.ts
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── config/            # Configuration files
│   │   ├── database.ts
│   │   └── env.ts
│   ├── utils/             # Utility functions
│   │   └── jwt.ts
│   ├── app.ts             # Fastify app setup
│   └── server.ts          # Server entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── tests/                 # Test files
│   ├── setup.ts
│   ├── auth.test.ts
│   └── tasks.test.ts
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker image definition
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Prerequisites

- **Node.js**: Version 18 or higher
- **Docker**: For containerized deployment (optional)
- **PostgreSQL**: Version 14 or higher (or use Docker)
- **npm**: Version 8 or higher

## 📦 Quick Start

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aria163/test-mrapp.git
cd test-mrapp

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env and set JWT_SECRET (min 32 characters)

# 4. Setup database
npm run prisma:generate
npm run prisma:migrate

# 5. Start development server
npm run dev
```

The API will be available at http://localhost:3000

📚 **API Documentation**: http://localhost:3000/docs

## 🏃 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`
API Documentation will be available at `http://localhost:3000/docs`

### Production Mode

Build and start the application:

```bash
npm run build
npm start
```

### Using Docker Compose

Run the entire stack (app + database) with Docker:

```bash
npm run docker:up
```

Stop the containers:

```bash
npm run docker:down
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/docs
```

### API Endpoints

#### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

#### Users

- **GET** `/api/users/me` - Get authenticated user profile (requires authentication)

#### Tasks

All task endpoints require authentication (JWT token in Authorization header).

- **POST** `/api/tasks` - Create a new task
- **GET** `/api/tasks` - Get all tasks for authenticated user
- **GET** `/api/tasks/:id` - Get a specific task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

### Authentication

After registration or login, you'll receive a JWT token. Include it in the Authorization header:

```
Authorization: Bearer <your-token-here>
```

## 🔍 API Examples

For complete API examples with all endpoints, see [API_EXAMPLES.md](./API_EXAMPLES.md).

### Quick Examples

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Buy groceries","description":"Milk, bread, eggs"}'
```

**Get All Tasks:**
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [API_EXAMPLES.md](./API_EXAMPLES.md) for all endpoints and detailed examples.

## 🛡 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with token expiration
- **Input Validation**: Runtime validation with Zod to prevent invalid data
- **SQL Injection Protection**: Prisma ORM with prepared statements
- **Error Sanitization**: Sensitive information not exposed in error messages
- **CORS Configuration**: Configurable CORS for API security

### Security Considerations for Production

While this implementation includes many security best practices, consider adding the following for production use:

- **Rate Limiting**: Add `@fastify/rate-limit` to prevent brute-force attacks on authentication endpoints
- **HTTPS**: Always use HTTPS in production
- **Helmet**: Add security headers with `@fastify/helmet`
- **Environment Variables**: Never commit secrets; use proper secret management
- **Regular Updates**: Keep dependencies updated to patch security vulnerabilities

## 🔧 Development

### Linting

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Formatting

```bash
npm run format
```

### Database Management

Open Prisma Studio (GUI for database):

```bash
npm run prisma:studio
```

Create a new migration:

```bash
npm run prisma:migrate
```

## 🐳 Docker Deployment

The project includes a production-ready Docker setup:

### Build and Run

```bash
docker-compose up --build
```

### Environment Variables in Docker

Edit `docker-compose.yml` to configure environment variables for production deployment.

### Scaling

To run multiple instances:

```bash
docker-compose up --scale app=3
```

## 📊 Database Schema

### User Model

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}
```

### Task Model

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Fastify team for the excellent framework
- Prisma team for the amazing ORM
- The Node.js and TypeScript communities

---

**Happy Coding! 🚀**