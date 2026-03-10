# Operations Guide

## Daily Operations

### Monitoring Dashboard

Access your monitoring dashboard:
- Cloud Console: https://console.cloud.google.com/run
- Logs: https://console.cloud.google.com/logs
- Monitoring: https://console.cloud.google.com/monitoring

### Health Checks

```bash
# Check service status
curl https://your-service-url.run.app/health

# Check Firestore connectivity
curl https://your-service-url.run.app/health/db

# View service metrics
gcloud run services describe SERVICE_NAME --region us-central1
```

## Maintenance Tasks

### Weekly Tasks

**Review Logs**
```bash
# Check error logs from past week
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
  --limit 100 \
  --format json \
  --freshness=7d
```

**Check Performance**
```bash
# View latency metrics
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_latencies"'
```

### Monthly Tasks

**Update Dependencies**
```bash
# Check for outdated packages
npm outdated
# or
pip list --outdated

# Update and test
npm update
npm test
```

**Review Costs**
```bash
# Check monthly costs
gcloud billing accounts list
# Then view in console: https://console.cloud.google.com/billing
```

**Firestore Maintenance**
```bash
# Check database size
gcloud firestore databases describe --database=default

# Review indexes
gcloud firestore indexes list
```

## Backup and Recovery

### Automated Backups

Firestore automatically backs up data. To create manual backups:

```bash
# Export Firestore data
gcloud firestore export gs://PROJECT_ID-backups/$(date +%Y%m%d)
```

### Recovery Procedures

**Restore from Backup**
```bash
# Import Firestore backup
gcloud firestore import gs://PROJECT_ID-backups/20260308
```

**Rollback Code Deployment**
```bash
# List revisions
gcloud run revisions list --service SERVICE_NAME --region us-central1

# Route traffic to previous revision
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```

## Troubleshooting

### Service Not Responding

**Symptom**: Service returns 502/503 errors

**Diagnosis**:
```bash
# Check service status
gcloud run services describe SERVICE_NAME --region us-central1

# Check recent logs
gcloud run services logs read SERVICE_NAME --limit 50
```

**Resolution**:
1. Check for container startup errors in logs
2. Verify environment variables and secrets are set
3. Ensure Firestore and external APIs are accessible
4. If needed, redeploy: `./scripts/deploy.sh production`

### High Error Rate

**Symptom**: Increased errors in logs

**Diagnosis**:
```bash
# Count errors by type
gcloud logging read "resource.type=cloud_run_revision AND severity=ERROR" \
  --format json \
  --freshness=1h | jq '.[] | .jsonPayload.message' | sort | uniq -c
```

**Resolution**:
1. Identify error pattern
2. Check for recent code changes
3. Verify external API availability
4. If widespread, consider rollback

### Slow Response Times

**Symptom**: Requests taking longer than normal

**Diagnosis**:
```bash
# Check latency percentiles
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_latencies"' \
  --interval-start $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ) \
  --interval-end $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

**Resolution**:
1. Check Firestore query performance
2. Review recent code changes for inefficiencies
3. Consider increasing instance resources
4. Add caching if applicable

### Firestore Connection Issues

**Symptom**: "Permission denied" or connection timeout

**Diagnosis**:
```bash
# Verify service account permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:PROJECT_NUMBER-compute@developer.gserviceaccount.com"
```

**Resolution**:
```bash
# Grant Firestore access
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/datastore.user"
```

### Secret Access Issues

**Symptom**: "Secret not found" or "Permission denied"

**Diagnosis**:
```bash
# Check secret exists
gcloud secrets versions access latest --secret=SECRET_NAME

# Check permissions
gcloud secrets get-iam-policy SECRET_NAME
```

**Resolution**:
```bash
# Grant access to service account
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Scaling

### Manual Scaling

```bash
# Increase max instances during high traffic
gcloud run services update SERVICE_NAME \
  --max-instances 50 \
  --region us-central1

# Set minimum instances to reduce cold starts
gcloud run services update SERVICE_NAME \
  --min-instances 1 \
  --region us-central1
```

### Resource Adjustment

```bash
# Increase memory if needed
gcloud run services update SERVICE_NAME \
  --memory 1Gi \
  --region us-central1

# Increase CPU
gcloud run services update SERVICE_NAME \
  --cpu 2 \
  --region us-central1
```

## Alerts and Notifications

### Setting Up Alerts

Create alerts for critical metrics:

```bash
# Error rate alert (via Console recommended)
# Go to: https://console.cloud.google.com/monitoring/alerting
# Create alert for:
# - Metric: Cloud Run request count (filtered by response code 5xx)
# - Condition: Rate > 5% for 5 minutes
# - Notification: Email/SMS
```

### Key Metrics to Monitor

- **Error Rate**: Should stay below 1%
- **Latency P95**: Should stay below 2 seconds
- **Instance Count**: Unexpected scaling may indicate issues
- **Memory Usage**: Approaching limit may cause OOM errors
- **Request Count**: Track usage patterns

## Routine Maintenance Scripts

### Check System Health

```bash
# Run comprehensive health check
./scripts/health-check.sh
```

### Cleanup Old Data

```bash
# Clean up old logs (if you store custom logs in Firestore)
./scripts/cleanup-logs.sh --older-than 90
```

### Generate Reports

```bash
# Generate weekly usage report
./scripts/generate-report.sh --period weekly
```

## Security Maintenance

### Regular Security Tasks

**Update Dependencies**
```bash
# Check for security vulnerabilities
npm audit
# or
pip check

# Fix vulnerabilities
npm audit fix
```

**Rotate Secrets**
```bash
# Create new secret version
echo -n "new-secret-value" | gcloud secrets versions add SECRET_NAME --data-file=-

# Update Cloud Run to use latest
gcloud run services update SERVICE_NAME --update-secrets=SECRET_NAME=SECRET_NAME:latest
```

**Review Access Logs**
```bash
# Check for suspicious access patterns
gcloud logging read "resource.type=cloud_run_revision AND httpRequest.status>=400" \
  --limit 100 \
  --format json
```

## Common Commands Reference

```bash
# View service details
gcloud run services describe SERVICE_NAME --region REGION

# Stream logs in real-time
gcloud run services logs tail SERVICE_NAME --region REGION

# List all revisions
gcloud run revisions list --service SERVICE_NAME --region REGION

# Delete old revisions
gcloud run revisions delete REVISION_NAME --region REGION

# Update environment variables
gcloud run services update SERVICE_NAME \
  --update-env-vars KEY=VALUE \
  --region REGION

# View current traffic split
gcloud run services describe SERVICE_NAME --format='value(status.traffic)'
```

## Emergency Contacts

- **On-Call Engineer**: [Contact info]
- **Google Cloud Support**: [Support plan details]
- **Critical Dependencies**: [Third-party service contacts]

## Incident Response

1. **Detect**: Alert triggers or manual detection
2. **Assess**: Check logs, metrics, recent changes
3. **Contain**: Rollback if needed, scale resources
4. **Resolve**: Fix root cause
5. **Document**: Update runbook with findings

---

**Last Updated**: 2026-03-08  
**Owner**: [Your Name]
