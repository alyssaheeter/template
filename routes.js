# Deployment Guide

## Overview

This project is designed for deployment to Google Cloud Run with Firestore backend.

## Prerequisites

### Required Tools
- Google Cloud SDK (`gcloud` CLI)
- Docker (for local testing)
- Node.js 18+ or Python 3.11+
- Git

### Required Access
- Google Cloud Project with billing enabled
- Permissions: Cloud Run Admin, Firestore Admin, Secret Manager Admin

## Environment Configuration

### Environment Variables

Create a `.env` file based on `.env.template`:

```bash
# Application
NODE_ENV=production
PORT=8080

# Google Cloud
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1

# Database
FIRESTORE_DATABASE=default

# Authentication
JWT_SECRET=your-secret-key

# External APIs (if applicable)
API_KEY_1=your-api-key
API_KEY_2=your-api-key
```

### Secret Manager Setup

Store sensitive values in Secret Manager:

```bash
# Create secrets
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-api-key" | gcloud secrets create api-key-1 --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Deployment Environments

### Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Access at http://localhost:8080
```

### Staging Environment

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Service URL will be: https://PROJECT-NAME-staging-HASH-uc.a.run.app
```

### Production Environment

```bash
# Deploy to production
./scripts/deploy.sh production

# Service URL will be: https://PROJECT-NAME-HASH-uc.a.run.app
```

## Manual Deployment Steps

### 1. Build Container

```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/SERVICE_NAME:VERSION .

# Test locally
docker run -p 8080:8080 --env-file .env gcr.io/PROJECT_ID/SERVICE_NAME:VERSION
```

### 2. Push to Container Registry

```bash
# Configure Docker for GCP
gcloud auth configure-docker

# Push image
docker push gcr.io/PROJECT_ID/SERVICE_NAME:VERSION
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy SERVICE_NAME \
  --image gcr.io/PROJECT_ID/SERVICE_NAME:VERSION \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=PROJECT_ID" \
  --set-secrets "JWT_SECRET=jwt-secret:latest,API_KEY_1=api-key-1:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60
```

### 4. Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service SERVICE_NAME \
  --domain api.yourdomain.com \
  --region us-central1

# Add DNS records as instructed by gcloud output
```

## Firestore Setup

### Initialize Firestore

```bash
# Create Firestore database
gcloud firestore databases create --region=us-central1

# Or use Firebase Console: https://console.firebase.google.com/
```

### Indexes

If your app requires composite indexes, create `firestore.indexes.json`:

```bash
# Deploy indexes
gcloud firestore indexes create firestore.indexes.json
```

## CI/CD with GitHub Actions

### Setup GitHub Secrets

Add these secrets to your GitHub repository:

- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_SA_KEY` - Service account JSON key (base64 encoded)
- `PRODUCTION_SECRETS` - Environment variables for production

### Automatic Deployment

The `.github/workflows/deploy.yml` will automatically:
- Run tests on every PR
- Deploy to staging on merge to `develop`
- Deploy to production on merge to `main`

## Rollback Procedures

### Quick Rollback

```bash
# List recent revisions
gcloud run revisions list --service SERVICE_NAME --region us-central1

# Rollback to previous revision
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

### Emergency Rollback

```bash
# Redeploy last known good version
./scripts/deploy.sh production --version PREVIOUS_VERSION
```

## Health Checks

### Service Health Endpoint

```bash
# Check service health
curl https://your-service-url.run.app/health

# Expected response:
# {"status":"healthy","timestamp":"2026-03-08T12:00:00Z"}
```

### Cloud Monitoring

Set up alerts in Cloud Monitoring:
- Error rate > 5%
- Response time > 2 seconds
- Instance count > 8

## Troubleshooting

### Common Issues

**Issue**: Container fails to start
```bash
# Check logs
gcloud run services logs read SERVICE_NAME --region us-central1 --limit 50
```

**Issue**: Environment variables not loading
```bash
# Verify secrets are accessible
gcloud secrets versions access latest --secret="jwt-secret"

# Check service configuration
gcloud run services describe SERVICE_NAME --region us-central1
```

**Issue**: Firestore permission denied
```bash
# Grant Firestore access to Cloud Run service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/datastore.user"
```

## Cost Optimization

### Cloud Run Pricing Tips
- Use min-instances=0 for development
- Set appropriate memory limits (512Mi default)
- Configure CPU allocation: CPU is only allocated during request

### Monitoring Costs
```bash
# View current costs
gcloud billing accounts list
gcloud billing projects describe PROJECT_ID
```

## Security Checklist

- [ ] Secrets stored in Secret Manager (not environment variables)
- [ ] Service account follows principle of least privilege
- [ ] HTTPS enforced (automatic with Cloud Run)
- [ ] Authentication enabled for protected endpoints
- [ ] Rate limiting configured
- [ ] CORS policy configured appropriately

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Secrets created in Secret Manager
- [ ] Firestore indexes deployed
- [ ] Health check endpoint working
- [ ] Monitoring/alerting configured
- [ ] Backup strategy verified
- [ ] Rollback procedure tested

---

**Last Updated**: 2026-03-08  
**Owner**: [Your Name]
