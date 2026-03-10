# Repository Structure

This document explains the organization and purpose of each directory and file.

## Directory Structure

```
project-root/
├── .github/              # GitHub-specific configurations
│   └── workflows/        # GitHub Actions CI/CD pipelines
│       └── deploy.yml    # Automated deployment workflow
│
├── docs/                 # All project documentation
│   ├── architecture.md   # System design and component overview
│   ├── deployment.md     # Deployment procedures and guides
│   ├── operations.md     # Maintenance and troubleshooting
│   └── usage.md          # API reference and code examples
│
├── src/                  # All production source code
│   ├── api/              # API layer (routes, middleware)
│   │   └── routes.js     # API route definitions
│   ├── services/         # Business logic layer
│   │   └── user.service.js
│   ├── data/             # Data access layer
│   │   └── firestore.js  # Firestore client
│   └── index.js          # Application entry point
│
├── infrastructure/       # Deployment and infrastructure configs
│   └── (Add Terraform, k8s configs, etc.)
│
├── scripts/              # Operational scripts
│   ├── deploy.sh         # Deployment automation
│   └── health-check.sh   # Health verification script
│
├── tests/                # All test files
│   └── api.test.js       # API endpoint tests
│
├── config/               # Configuration templates
│   └── (Add config files as needed)
│
├── .env.template         # Environment variable template
├── .gitignore            # Git ignore rules
├── Dockerfile            # Container image definition
├── package.json          # Node.js dependencies and scripts
├── requirements.txt      # Python dependencies
├── README.md             # Project overview and quick start
├── SETUP.md              # Detailed setup instructions
├── CONTRIBUTING.md       # Contribution guidelines
├── CHANGELOG.md          # Version history
└── LICENSE               # License file
```

## Key Directories Explained

### `/docs` - Documentation
**Purpose**: Single source of truth for all project documentation.

**Contents**:
- `architecture.md` - System design, components, data flow
- `deployment.md` - How to deploy to various environments
- `operations.md` - Day-to-day operations and troubleshooting
- `usage.md` - API reference and usage examples

**When to add**: Create new docs for significant features or processes.

### `/src` - Source Code
**Purpose**: All production code organized by architectural layer.

**Structure**:
```
src/
├── api/         # HTTP layer (Express routes, middleware)
├── services/    # Business logic (orchestration, validation)
├── data/        # Data access (Firestore, external APIs)
└── index.js     # Application bootstrap
```

**Principles**:
- Separation of concerns
- Each layer has clear responsibilities
- No circular dependencies

### `/infrastructure` - Deployment Configs
**Purpose**: Infrastructure-as-code and deployment configurations.

**Typical contents**:
- Terraform files
- Kubernetes manifests
- Docker Compose files
- Cloud-specific configs

### `/scripts` - Operational Scripts
**Purpose**: Automation and maintenance scripts.

**Examples**:
- `deploy.sh` - Automated deployment
- `health-check.sh` - Service verification
- `backup.sh` - Data backup automation
- `cleanup.sh` - Maintenance tasks

**Characteristics**:
- Executable (`chmod +x`)
- Well-documented
- Idempotent when possible

### `/tests` - Test Suite
**Purpose**: Automated testing for all code.

**Organization**:
```
tests/
├── unit/           # Unit tests for individual functions
├── integration/    # Integration tests for components
└── e2e/            # End-to-end API tests
```

**Best practices**:
- Mirror src/ structure
- Test files named `*.test.js` or `*_test.py`
- 80%+ coverage goal

### `/.github` - GitHub Configurations
**Purpose**: GitHub-specific automation and templates.

**Contents**:
- `workflows/` - GitHub Actions CI/CD
- `ISSUE_TEMPLATE/` - Issue templates
- `PULL_REQUEST_TEMPLATE.md` - PR template

## Key Files Explained

### Root-Level Files

**`README.md`**
- First thing people see
- Project overview, quick start, basic usage
- Links to detailed documentation

**`SETUP.md`**
- Detailed first-time setup instructions
- Google Cloud configuration
- GitHub setup
- Local development setup

**`CONTRIBUTING.md`**
- How to contribute
- Code style guidelines
- Commit message format
- PR process

**`CHANGELOG.md`**
- Version history
- Notable changes per release
- Follows Keep a Changelog format

**`.env.template`**
- Template for environment variables
- Copy to `.env` and fill in values
- Never commit actual `.env` file

**`Dockerfile`**
- Container image definition
- Multi-stage builds for optimization
- Optimized for Cloud Run

**`package.json` / `requirements.txt`**
- Dependency management
- Scripts/commands
- Project metadata

## Organizational Principles

### 1. Separation of Concerns
Each directory has a single, clear purpose:
- Code in `src/`
- Documentation in `docs/`
- Infrastructure in `infrastructure/`
- Operations in `scripts/`

### 2. Predictable Navigation
Common patterns:
- Configuration files at root
- Source code organized by layer
- Documentation centralized
- Scripts for automation

### 3. Solo Operator Friendly
Optimized for:
- Low maintenance burden
- Clear troubleshooting paths
- Automated operations
- Self-documenting structure

### 4. Production Ready
Includes:
- CI/CD pipelines
- Deployment automation
- Health checks
- Monitoring hooks
- Backup strategies

## Extending the Structure

### Adding New Features

**New API endpoint**:
1. Add route in `src/api/routes.js`
2. Create service in `src/services/`
3. Add tests in `tests/`
4. Update `docs/usage.md`

**New infrastructure component**:
1. Add config to `infrastructure/`
2. Update `docs/deployment.md`
3. Update deployment scripts if needed

**New operational script**:
1. Add to `scripts/`
2. Make executable
3. Document in `docs/operations.md`

### When to Create New Directories

**Good reasons**:
- Clear, distinct responsibility
- Multiple related files
- Logically separate from existing dirs

**Bad reasons**:
- Single file (put it in existing dir)
- Temporary organization
- Overly specific categorization

## Anti-Patterns to Avoid

❌ **Mixed responsibilities**: Don't put business logic in routes
❌ **Flat structure**: Don't dump everything in root
❌ **Deep nesting**: Keep hierarchy shallow (2-3 levels max)
❌ **Vague names**: No `utils/`, `helpers/`, `misc/`
❌ **Scattered docs**: Keep docs in `docs/`, not throughout codebase

## Maintenance

### Regular Tasks

**Weekly**:
- Review unused files
- Check for TODOs
- Update documentation

**Monthly**:
- Review directory structure
- Consolidate duplicates
- Update dependencies

**Per Feature**:
- Add tests
- Update docs
- Refactor if needed

---

**Last Updated**: 2026-03-08  
**Follows**: [Git Architect Skill Principles](/mnt/skills/user/git-architect/SKILL.md)
