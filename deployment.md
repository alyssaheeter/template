name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  GCP_REGION: us-central1
  SERVICE_NAME: project-name

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      # For Python projects, use:
      # - name: Setup Python
      #   uses: actions/setup-python@v5
      #   with:
      #     python-version: '3.11'
      #     cache: 'pip'
      
      - name: Install dependencies
        run: npm ci
      
      # For Python: run: pip install -r requirements.txt
      
      - name: Run linter
        run: npm run lint
      
      # For Python: run: flake8 src/
      
      - name: Run tests
        run: npm test
      
      # For Python: run: pytest
      
      - name: Check build
        run: npm run build --if-present

  deploy-staging:
    name: Deploy to Staging
    needs: test
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build and push Docker image
        run: |
          IMAGE="gcr.io/${{ env.GCP_PROJECT_ID }}/${{ env.SERVICE_NAME }}-staging:${{ github.sha }}"
          docker build -t $IMAGE .
          docker push $IMAGE
      
      - name: Deploy to Cloud Run (Staging)
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }}-staging \
            --image gcr.io/${{ env.GCP_PROJECT_ID }}/${{ env.SERVICE_NAME }}-staging:${{ github.sha }} \
            --platform managed \
            --region ${{ env.GCP_REGION }} \
            --allow-unauthenticated \
            --set-env-vars "NODE_ENV=staging,GCP_PROJECT_ID=${{ env.GCP_PROJECT_ID }}" \
            --set-secrets "JWT_SECRET=jwt-secret:latest" \
            --memory 512Mi \
            --min-instances 0 \
            --max-instances 5

  deploy-production:
    name: Deploy to Production
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build and push Docker image
        run: |
          IMAGE="gcr.io/${{ env.GCP_PROJECT_ID }}/${{ env.SERVICE_NAME }}:${{ github.sha }}"
          docker build -t $IMAGE .
          docker push $IMAGE
      
      - name: Deploy to Cloud Run (Production)
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image gcr.io/${{ env.GCP_PROJECT_ID }}/${{ env.SERVICE_NAME }}:${{ github.sha }} \
            --platform managed \
            --region ${{ env.GCP_REGION }} \
            --allow-unauthenticated \
            --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=${{ env.GCP_PROJECT_ID }}" \
            --set-secrets "JWT_SECRET=jwt-secret:latest" \
            --memory 512Mi \
            --min-instances 1 \
            --max-instances 10
      
      - name: Get service URL
        id: get-url
        run: |
          URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --platform managed \
            --region ${{ env.GCP_REGION }} \
            --format 'value(status.url)')
          echo "service_url=$URL" >> $GITHUB_OUTPUT
      
      - name: Verify deployment
        run: |
          sleep 10
          curl -f ${{ steps.get-url.outputs.service_url }}/health || exit 1
