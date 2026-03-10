# Architecture

## System Overview

This document describes the high-level architecture, component interactions, and design decisions.

## System Components

### Component Layer Diagram

```
┌─────────────────────────────────────────────────┐
│                  User Interface                 │
│            (Web/CLI/API Consumer)               │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                 API Layer                        │
│         (REST/GraphQL endpoints)                 │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Services Layer                      │
│        (Business logic & orchestration)          │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│               Data Layer                         │
│     (Firestore/Storage/External APIs)            │
└──────────────────────────────────────────────────┘
```

## Component Descriptions

### API Layer
**Location**: `src/api/`

Handles HTTP requests, authentication, and request validation.

**Key Files**:
- `routes.js` - Route definitions
- `middleware.js` - Authentication, logging
- `validators.js` - Request validation

### Services Layer
**Location**: `src/services/`

Contains business logic and orchestrates data operations.

**Key Files**:
- `service-name.service.js` - Core business logic
- `external-api.service.js` - Third-party integrations

### Data Layer
**Location**: `src/data/`

Manages data access and persistence.

**Key Files**:
- `firestore.js` - Firestore operations
- `storage.js` - Cloud Storage operations
- `models/` - Data models and schemas

## Data Flow

### Typical Request Flow

```
1. User Request
   ↓
2. API Layer (authentication, validation)
   ↓
3. Service Layer (business logic)
   ↓
4. Data Layer (persistence)
   ↓
5. Response back through layers
```

### Example: User Creation Flow

```
POST /api/users
   ↓
[api/routes.js] → Validate request
   ↓
[api/middleware.js] → Check authentication
   ↓
[services/user.service.js] → Create user logic
   ↓
[data/firestore.js] → Save to database
   ↓
Return user object
```

## Key Design Decisions

### 1. Modular Monolith Architecture
- Single deployable application
- Clear module boundaries
- Easy to navigate and maintain
- Optimized for solo operator

### 2. Google Cloud Native
- Cloud Run for hosting
- Firestore for database
- Cloud Storage for files
- Secret Manager for credentials
- Vertex AI for AI capabilities

### 3. Configuration-Driven
- Environment variables for all configs
- No hardcoded credentials
- Easy to deploy to multiple environments

### 4. Stateless Design
- No session state on server
- JWT for authentication
- Enables horizontal scaling

## Security Considerations

### Authentication
- JWT tokens with expiration
- Secret Manager for API keys
- Environment-based access control

### Data Protection
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- Rate limiting on public endpoints

## Scalability

### Current Capacity
- Cloud Run auto-scaling: 0-100 instances
- Firestore: handles high read/write throughput
- Expected load: [specify]

### Future Considerations
- Add Redis for caching if needed
- Implement CDN for static assets
- Consider Cloud Tasks for background jobs

## Dependencies

### Core Dependencies
- Express.js (API framework)
- @google-cloud/firestore (database)
- @google-cloud/storage (file storage)
- jsonwebtoken (authentication)

### External Services
- Google Cloud Platform
- [List any third-party APIs]

## Monitoring & Observability

- Cloud Logging for application logs
- Cloud Monitoring for metrics
- Error tracking: [specify tool]

## Disaster Recovery

### Backup Strategy
- Firestore: automatic daily backups
- Code: GitHub repository
- Secrets: backed up in Secret Manager

### Recovery Procedures
See [operations.md](operations.md) for recovery steps.

## Future Roadmap

### Planned Enhancements
- [ ] Feature A
- [ ] Feature B
- [ ] Performance optimization

### Technical Debt
- [ ] Item 1
- [ ] Item 2

---

**Last Updated**: 2026-03-08  
**Owner**: [Your Name]
