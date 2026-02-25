# Backend Tests

This directory contains unit and integration tests for the Task Management API.

## Test Structure

```
tests/
├── unit/                    # Unit tests for services
│   ├── auth.service.test.ts
│   └── task.service.test.ts
└── integration/             # Integration tests for API endpoints
    ├── auth.api.test.ts
    └── task.api.test.ts
```

## Running Tests

### All tests

```bash
npm test
```

### Unit tests only

```bash
npm run test:unit
```

### Integration tests only

```bash
npm run test:integration
```

### With coverage report

```bash
npm run test:coverage
```

## Test Coverage

The tests cover:

### Unit Tests

- **AuthService**: Registration, login, password hashing, JWT token generation
- **TaskService**: CRUD operations, task filtering, user isolation

### Integration Tests

- **Auth API**: User registration, login, authentication middleware
- **Task API**: Task CRUD operations, authorization, data validation
- **Security**: User data isolation, unauthorized access prevention

## Test Database

Integration tests use the same database configuration as development but clean up data before each test to ensure test isolation.

## Writing New Tests

### Unit Test Example

```typescript
describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    // Setup
    service = new ServiceName();
  });

  it('should do something', async () => {
    // Test implementation
    const result = await service.method();
    expect(result).toBeDefined();
  });
});
```

### Integration Test Example

```typescript
describe('API Endpoint', () => {
  let authToken: string;

  beforeEach(async () => {
    // Setup auth
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = response.body.token;
  });

  it('should return data', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Always clean up test data in `beforeEach` or `afterEach`
3. **Mocking**: Use mocks for external dependencies in unit tests
4. **Assertions**: Use clear and specific assertions
5. **Naming**: Use descriptive test names that explain what is being tested
