# Backend VPS Deployment Guide

This guide explains how to deploy the Luvira Ops AI Demo **backend** to your VPS using GitHub Actions.

**Note:** This is a monorepo setup. The workflow only deploys the `backend/` directory.

## Prerequisites

1. A VPS with Docker installed
2. SSH access to your VPS
3. GitHub repository for this project

## Setup Instructions

### Step 1: Configure GitHub Secrets

You only need to add VPS connection secrets to GitHub. Application secrets will be stored on your VPS.

1. Go to your GitHub repository
2. Click on `Settings` > `Secrets and variables` > `Actions`
3. Click `New repository secret` and add each of the following:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `yourdomain.com` |
| `VPS_USERNAME` | SSH username for your VPS | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Your SSH private key (entire content) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### Step 2: Set Up SSH Key (if you haven't already)

On your VPS:
```bash
# If you don't have an SSH key yet, generate one on your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy the public key to your VPS
ssh-copy-id your-username@your-vps-ip

# Copy the private key content
cat ~/.ssh/id_rsa
# Copy the entire output and paste it into the VPS_SSH_KEY secret
```

### Step 3: Prepare Your VPS

SSH into your VPS and ensure Docker is installed:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, if not using root)
sudo usermod -aG docker $USER

# Verify Docker installation
docker --version

# Open port 8080 in firewall (required for external access)
sudo ufw allow 8080/tcp

# Verify firewall rules
sudo ufw status
```

### Step 3.5: Create .env File on VPS

Create your environment file on the VPS:

```bash
# Create app directory
sudo mkdir -p /opt/luvira-ops

# Create .env file
sudo nano /opt/luvira-ops/.env
```

Add your environment variables:
```env
GRADIENT_MODEL_ACCESS_KEY=your-gradient-key
GRADIENT_MODEL_SLUG=your-model-slug
KNOWLEDGE_BASE_ID=your-kb-id
DIGITALOCEAN_TOKEN=your-do-token
```

Save and exit (Ctrl+X, then Y, then Enter).

Set proper permissions:
```bash
sudo chmod 600 /opt/luvira-ops/.env
```

### Step 4: Using the gh CLI to Set Secrets

Since you have the `gh` CLI installed, you can set secrets directly from the command line:

```bash
# Navigate to your project directory
cd luvira-ops-ai-demo

# Set VPS configuration secrets
gh secret set VPS_HOST -b"your-vps-ip-or-domain"
gh secret set VPS_USERNAME -b"your-ssh-username"
gh secret set VPS_SSH_KEY < ~/.ssh/id_rsa
```

Or set them interactively:
```bash
gh secret set VPS_HOST
gh secret set VPS_USERNAME
gh secret set VPS_SSH_KEY
```

### Step 5: Deploy

Once you've set up the secrets:

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add Docker deployment configuration"
   git push origin main
   ```

2. The GitHub Action will automatically trigger **only when changes are made to the `backend/` directory**

3. You can also manually trigger the deployment:
   ```bash
   gh workflow run deploy.yml
   ```

4. Monitor the deployment:
   ```bash
   gh run watch
   ```

**Note:** The workflow only triggers on changes to `backend/**` to avoid unnecessary deployments when frontend or other files change.

### Step 6: Verify Deployment

After deployment, verify your application is running:

```bash
# From your local machine
curl http://your-vps-ip:8080/docs

# Or visit in browser
http://your-vps-ip:8080/docs

# Test the API endpoint
curl -X POST http://your-vps-ip:8080/ingest \
  -H "Content-Type: application/json" \
  -d '{"service_name":"test","error_rate":0.9,"message":"test error"}'
```

## Local Testing

Before deploying, you can test the backend locally using Docker Compose:

```bash
# Navigate to backend directory
cd backend

# Build and run
docker-compose up --build

# Test the API
curl http://localhost:8080/docs

# Stop
docker-compose down
```

## Monitoring

SSH into your VPS to monitor the application:

```bash
# View container logs
docker logs -f luvira-ops-backend

# Check container status
docker ps | grep luvira-ops-backend

# Restart container
docker restart luvira-ops-backend

# Stop container
docker stop luvira-ops-backend
```

## Troubleshooting

### Deployment fails with SSH error
- Ensure your SSH key is correct and has the right permissions
- Verify VPS_HOST and VPS_USERNAME are correct
- Check if your VPS firewall allows SSH connections

### Container not starting
- Check logs: `docker logs luvira-ops-backend`
- Verify the .env file exists: `cat /opt/luvira-ops/.env`
- Ensure all environment variables are set correctly in the .env file
- Ensure port 8080 is not already in use

### Can't access the application
- Check if the container is running: `docker ps`
- Verify port 8080 is open in firewall: `sudo ufw status | grep 8080`
- If port 8080 is not listed, open it: `sudo ufw allow 8080/tcp`
- Try accessing from VPS locally: `curl localhost:8080/docs`
- Check if Docker is binding to all interfaces: `sudo ss -tulpn | grep 8080`
- Verify the container port mapping: `docker port luvira-ops-backend`

## Updating the Application

### Updating Code

Simply push backend changes to the main branch:

```bash
# Make changes to backend files
cd backend
# ... edit files ...

# Commit and push
git add .
git commit -m "Update backend: your changes"
git push origin main
```

The GitHub Action will automatically rebuild and redeploy **only when backend files change**.

If you only change frontend files, the backend deployment won't trigger.

### Updating Environment Variables

To update environment variables on your VPS:

```bash
# SSH into your VPS
ssh your-username@your-vps-ip

# Edit the .env file
sudo nano /opt/luvira-ops/.env

# Save and restart the container
docker restart luvira-ops-backend

# Verify it's running
docker logs -f luvira-ops-backend
```
