# Usage Guide

## Getting Started

This guide covers common use cases and API examples.

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.example.com/endpoint
```

### Obtaining a Token

```bash
# Login endpoint
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## API Reference

### Core Endpoints

#### GET /health
Check service health status.

**Request**:
```bash
curl https://api.example.com/health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-08T12:00:00Z",
  "database": "connected",
  "version": "1.0.0"
}
```

#### POST /api/users
Create a new user (protected).

**Request**:
```bash
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "user"
  }'
```

**Response**:
```json
{
  "id": "user_abc123",
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "role": "user",
  "createdAt": "2026-03-08T12:00:00Z"
}
```

#### GET /api/users/:id
Get user by ID (protected).

**Request**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.example.com/api/users/user_abc123
```

**Response**:
```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "user",
  "createdAt": "2026-03-08T12:00:00Z",
  "lastLogin": "2026-03-08T14:30:00Z"
}
```

#### PUT /api/users/:id
Update user (protected).

**Request**:
```bash
curl -X PUT https://api.example.com/api/users/user_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith"
  }'
```

#### DELETE /api/users/:id
Delete user (protected, admin only).

**Request**:
```bash
curl -X DELETE https://api.example.com/api/users/user_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://api.example.com';
let authToken = null;

// Login
async function login(email, password) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  authToken = response.data.token;
  return authToken;
}

// Create user
async function createUser(userData) {
  const response = await axios.post(
    `${API_BASE_URL}/api/users`,
    userData,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// Get user
async function getUser(userId) {
  const response = await axios.get(
    `${API_BASE_URL}/api/users/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  );
  return response.data;
}

// Usage
(async () => {
  await login('user@example.com', 'password123');
  const user = await createUser({
    email: 'newuser@example.com',
    name: 'Jane Doe'
  });
  console.log('Created user:', user);
})();
```

### Python

```python
import requests
import json

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
    
    def login(self, email, password):
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        self.token = response.json()["token"]
        return self.token
    
    def _headers(self):
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def create_user(self, user_data):
        response = requests.post(
            f"{self.base_url}/api/users",
            json=user_data,
            headers=self._headers()
        )
        response.raise_for_status()
        return response.json()
    
    def get_user(self, user_id):
        response = requests.get(
            f"{self.base_url}/api/users/{user_id}",
            headers=self._headers()
        )
        response.raise_for_status()
        return response.json()

# Usage
client = APIClient("https://api.example.com")
client.login("user@example.com", "password123")

user = client.create_user({
    "email": "newuser@example.com",
    "name": "Jane Doe"
})
print(f"Created user: {user}")
```

### cURL

```bash
# Login and save token
TOKEN=$(curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  | jq -r '.token')

# Create user
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "Jane Doe"
  }'

# Get user
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/users/user_abc123
```

## Common Use Cases

### Use Case 1: Batch User Creation

```javascript
async function createBatchUsers(users) {
  const results = [];
  for (const userData of users) {
    try {
      const user = await createUser(userData);
      results.push({ success: true, user });
    } catch (error) {
      results.push({ success: false, error: error.message, email: userData.email });
    }
  }
  return results;
}

// Usage
const users = [
  { email: 'user1@example.com', name: 'User One' },
  { email: 'user2@example.com', name: 'User Two' },
  { email: 'user3@example.com', name: 'User Three' }
];

const results = await createBatchUsers(users);
console.log(`Created ${results.filter(r => r.success).length} users`);
```

### Use Case 2: Data Export

```python
def export_all_users(client, output_file):
    """Export all users to JSON file"""
    users = client.list_users()  # Assuming this endpoint exists
    
    with open(output_file, 'w') as f:
        json.dump(users, f, indent=2)
    
    print(f"Exported {len(users)} users to {output_file}")

# Usage
export_all_users(client, "users_export.json")
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "field": "email",
    "timestamp": "2026-03-08T12:00:00Z"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Handling Example

```javascript
async function safeAPICall(apiFunction, ...args) {
  try {
    return await apiFunction(...args);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Authentication failed. Please login again.');
          // Trigger re-login
          break;
        case 429:
          console.error('Rate limited. Waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          return safeAPICall(apiFunction, ...args); // Retry
        case 500:
          console.error('Server error:', data.error.message);
          break;
        default:
          console.error('API error:', data.error.message);
      }
    } else {
      console.error('Network error:', error.message);
    }
    throw error;
  }
}
```

## Rate Limiting

- **Authenticated requests**: 1000 requests/hour per user
- **Public endpoints**: 100 requests/hour per IP

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1709906400
```

## Best Practices

1. **Always handle errors**: Use try/catch blocks
2. **Store tokens securely**: Never commit tokens to code
3. **Respect rate limits**: Implement backoff strategies
4. **Use environment variables**: For API URLs and credentials
5. **Validate input**: Before sending to API
6. **Log API calls**: For debugging and monitoring

## SDK/Libraries

### Official SDKs
- [NPM package](#) - JavaScript/TypeScript
- [PyPI package](#) - Python

### Community Libraries
- [Ruby gem](#)
- [Go package](#)

## Support

- **API Status**: https://status.example.com
- **Documentation**: https://docs.example.com
- **Issues**: https://github.com/yourusername/project/issues
- **Email**: support@example.com

---

**Last Updated**: 2026-03-08  
**API Version**: v1
