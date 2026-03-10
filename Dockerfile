# Contributing Guide

Thank you for considering contributing to this project!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/project-name.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes (see commit guidelines below)
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.template .env
# Edit .env with your local settings

# Run in development mode
npm run dev

# Run tests
npm test
```

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(api): add user authentication endpoint

Implement JWT-based authentication for API routes.
Includes login, logout, and token refresh endpoints.

Closes #123
```

```
fix(db): resolve connection timeout issue

Increase connection pool timeout from 10s to 30s
to handle slow network conditions.
```

## Code Style

- **JavaScript**: ESLint + Prettier
- **Python**: Black + Flake8
- Run formatter before committing: `npm run format`
- Run linter: `npm run lint`

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage
- Test files should be in `tests/` directory

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Request review from maintainers
6. Address review feedback
7. Squash commits if requested

## Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts
- [ ] Branch is up to date with main

## Questions?

Open an issue or reach out to maintainers.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.
