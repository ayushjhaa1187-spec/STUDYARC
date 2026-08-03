# Google Cloud Deployment Guide for SkillBridge Pro

This guide outlines the steps required to deploy the SkillBridge Pro backend API (Node.js) to Google Cloud Run, set up Cloud Scheduler for background tasks, and monitor the application using Cloud Logging.

## Prerequisites

1.  **Google Cloud SDK (gcloud)** installed and authenticated.
    ```bash
    gcloud auth login
    ```
2.  **Billing Enabled** on your Google Cloud Project.
3.  **Project Selected**:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```
4.  **APIs Enabled**: Cloud Run API, Cloud Build API, Cloud Scheduler API.
    ```bash
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com cloudscheduler.googleapis.com
    ```

## 1. Deploying to Cloud Run

We have included a `Dockerfile` at the root of the project. Google Cloud Run can build and deploy this automatically from source.

### Deployment Command

Run the following command from the root directory of your project:

```bash
gcloud run deploy skillbridge-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001
```

### Environment Variables

During deployment (or via the Google Cloud Console), you must set the following environment variables:

- `GEMINI_API_KEY`: Your Google Generative AI API Key
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
- `RAZORPAY_WEBHOOK_SECRET`: The secret you configured in the Razorpay Webhooks dashboard.
- `SUPABASE_URL`: Your Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Keep this secure!)

**To set secrets during deployment:**
```bash
gcloud run deploy skillbridge-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --set-env-vars GEMINI_API_KEY="your-key",RAZORPAY_KEY_ID="your-rzp-id",SUPABASE_URL="your-supabase-url"
```
*(For production, it is highly recommended to use Google Cloud Secret Manager instead of plain environment variables).*

## 2. Setting up Cloud Scheduler (Daily Agent Jobs)

If you have daily agent jobs (like computing daily streaks or sending out batch notifications), you should create an endpoint (e.g., `POST /api/agents/daily-job`) and trigger it using Cloud Scheduler.

### Step 1: Secure the Endpoint
Ensure your endpoint requires a specific Authorization header or a secret token to prevent unauthorized access.

### Step 2: Create the Job
Run the following command to create a cron job that runs every day at midnight (UTC):

```bash
gcloud scheduler jobs create http daily-agent-job \
  --schedule="0 0 * * *" \
  --uri="https://YOUR_CLOUD_RUN_SERVICE_URL/api/agents/daily-job" \
  --http-method=POST \
  --headers="Authorization=Bearer YOUR_SECRET_CRON_TOKEN" \
  --location=us-central1
```

## 3. Monitoring via Cloud Logging

Cloud Run automatically sends all `stdout` and `stderr` streams to Google Cloud Logging. 

### Viewing Logs

1.  Navigate to **Logging > Logs Explorer** in the Google Cloud Console.
2.  To see only errors, use the following filter:
    ```
    resource.type = "cloud_run_revision"
    resource.labels.service_name = "skillbridge-api"
    severity >= ERROR
    ```
3.  To filter for specific agent events (e.g., if you log `Agent Event: ...`), you can use:
    ```
    resource.type = "cloud_run_revision"
    resource.labels.service_name = "skillbridge-api"
    textPayload:"Agent Event"
    ```

**Note**: All occurrences of `console.error` in our webhook and API routes will trigger an error severity log in Cloud Logging automatically.
