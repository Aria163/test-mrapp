"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
describe('Auth Module', () => {
    let app;
    beforeAll(async () => {
        app = await (0, app_1.buildApp)();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(true);
            expect(body.data.user).toHaveProperty('id');
            expect(body.data.user.email).toBe('test@example.com');
            expect(body.data.user).not.toHaveProperty('password');
            expect(body.data).toHaveProperty('token');
        });
        it('should fail with invalid email', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'invalid-email',
                    password: 'password123',
                },
            });
            expect(response.statusCode).toBe(400);
        });
        it('should fail with short password', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'test2@example.com',
                    password: 'short',
                },
            });
            expect(response.statusCode).toBe(400);
        });
        it('should fail with duplicate email', async () => {
            // First registration
            await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'duplicate@example.com',
                    password: 'password123',
                },
            });
            // Second registration with same email
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'duplicate@example.com',
                    password: 'password456',
                },
            });
            expect(response.statusCode).toBe(409);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(false);
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Register a test user
            await app.inject({
                method: 'POST',
                url: '/api/auth/register',
                payload: {
                    email: 'login@example.com',
                    password: 'password123',
                },
            });
        });
        it('should login with valid credentials', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'login@example.com',
                    password: 'password123',
                },
            });
            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(true);
            expect(body.data.user.email).toBe('login@example.com');
            expect(body.data).toHaveProperty('token');
        });
        it('should fail with invalid email', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'nonexistent@example.com',
                    password: 'password123',
                },
            });
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(false);
        });
        it('should fail with invalid password', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/auth/login',
                payload: {
                    email: 'login@example.com',
                    password: 'wrongpassword',
                },
            });
            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.success).toBe(false);
        });
    });
});
//# sourceMappingURL=auth.test.js.map