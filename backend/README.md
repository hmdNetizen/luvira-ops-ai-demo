# Luvira Ops Demo Backend - SOP Retrieval System

## Overview

This backend demonstrates an AI-powered incident response system that retrieves Standard Operating Procedures (SOPs) from a DigitalOcean Knowledge Base and generates remediation plans using the Gradient AI Platform.

## Architecture

```
Log Ingestion → Policy Gate → Knowledge Base Retrieval → AI Planning → JSON Response
```

### Pipeline Stages

1. **Ingest**: Receive service logs with error rates
2. **Analyze**: Calculate risk scores
3. **Decide**: Trigger AI only if error_rate >= 0.85
4. **Retrieve**: Search Knowledge Base for relevant SOPs
5. **Plan**: Generate remediation plan using LLM

## What We Implemented

### 1. Tightened Knowledge Base Search Logic

**Location:** `main.py:36-71`

**Changes:**
- Updated to use correct DigitalOcean KB API endpoint
- Dynamic search query construction based on service name and keywords
- Proper error handling with fallback mechanism

**Code:**
```python
# Correct endpoint format
kb_url = f"https://kbaas.do-ai.run/v1/{kb_id}/retrieve"

# Tightened search query
search_query = f"{service} error rate restart Redis cache clear"

# API call with proper parameters
kb_resp = requests.post(
    kb_url,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    json={
        "query": search_query,
        "num_results": 1,
        "alpha": 0.5  # Balance between lexical and semantic search
    },
    timeout=5
)
```

### 2. Proof Fields in JSON Response

**Location:** `main.py:113-123`

Every API response includes three proof fields for Mission Control UI:

```json
{
  "sop_retrieved": "If the Auth API error rate exceeds 85%, the operator should trigger a container restart and clear the Redis cache. Priority: High.",
  "trace_id": "UVIRA-C67DC4",
  "latency_ms": 6951
}
```

**Field Descriptions:**
- `sop_retrieved`: The exact SOP text retrieved from KB (or fallback message)
- `trace_id`: Enterprise-style trace ID (format: UVIRA-XXXXXX) for debugging
- `latency_ms`: Total response time in milliseconds

### 3. Enhanced Debug Logging

**Location:** `main.py:50-58`

Added comprehensive logging to track KB retrieval:

```
[DEBUG] KB ID: 4f5fc17e-1796-11f1-b074-4e013e2ddde4
[DEBUG] Search Query: auth-api error rate restart Redis cache clear
[DEBUG] ✅ KB Retrieved SOP: If the Auth API error rate exceeds 85%...
```

## Before vs After Results

### OLD Output (Before Implementation)
```json
{
  "sop_retrieved": "Standard triage protocols",
  "remediation_plan": {
    "step1": {
      "action": "Monitor",
      "description": "Closely monitor the auth-api service"
    },
    "step2": {
      "action": "Alert on-call",
      "description": "Notify the on-call engineer"
    }
  }
}
```

### NEW Output (After Implementation)
```json
{
  "sop_retrieved": "If the Auth API error rate exceeds 85%, the operator should trigger a container restart and clear the Redis cache. Priority: High.",
  "remediation_plan": [
    {
      "step": 1,
      "action": "Restart Container",
      "description": "Trigger a container restart for the auth-api service"
    },
    {
      "step": 2,
      "action": "Clear Redis Cache",
      "description": "Clear the Redis cache to remove any stale or corrupted data"
    }
  ],
  "expected_outcome": "Auth API error rate should decrease below 85% after restart and cache clearance"
}
```

## Setup Instructions

### Prerequisites

1. DigitalOcean Account with:
   - API Token with `GenAI:read` scope
   - Gradient AI Platform access
   - Knowledge Base Enhancements enabled (Feature Preview)

2. Python 3.11+

### Installation

```bash
# Clone and navigate to project
cd luvira-ops-demo-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Mac/Linux
# or: venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### Environment Configuration

Create a `.env` file:

```env
DIGITALOCEAN_TOKEN=dop_v1_your_token_here
GRADIENT_WORKSPACE_ID=your_workspace_id
GRADIENT_MODEL_SLUG=llama3.3-70b-instruct
GRADIENT_MODEL_ACCESS_KEY=sk-do-your_key_here
KNOWLEDGE_BASE_ID="your_kb_id_here"
```

### Knowledge Base Setup

1. **Create Knowledge Base** in DigitalOcean Console:
   - Go to Gradient AI Platform → Knowledge Bases
   - Create new knowledge base
   - Copy the KB ID to `.env`

2. **Upload SOP**:
   - Create `auth-api-sop.txt`:
     ```
     If the Auth API error rate exceeds 85%, the operator should trigger a container restart and clear the Redis cache. Priority: High.
     ```
   - Upload to Knowledge Base via console

3. **Enable Feature Preview**:
   - Settings → Feature Preview
   - Enable "Knowledge Base Enhancements"

## Running the Application

### Start Server

```bash
python main.py
```

Output:
```
--- [LUVIRA OPS BACKEND] Initializing Demo Environment ---
🚀 Luvira Mission Control Backend: STARTING...
📍 API URL: http://localhost:8080
-------------------------------------------
```

### Run Tests

```bash
python test_api.py
```

## API Documentation

### Endpoint: POST /ingest

**Request:**
```json
{
  "service_name": "auth-api",
  "error_rate": 0.92,
  "message": "Auth API error rate exceeding 85%"
}
```

**Response:**
```json
{
  "status": "success",
  "pipeline_stages": ["Ingest", "Analyze", "Decide", "Retrieve", "Plan"],
  "risk_score": 0.92,
  "threshold": 0.85,
  "triggered": true,
  "sop_retrieved": "If the Auth API error rate exceeds 85%, the operator should trigger a container restart and clear the Redis cache. Priority: High.",
  "remediation_plan": {
    "service": "auth-api",
    "priority": "High",
    "remediation_plan": [
      {
        "step": 1,
        "action": "Restart Container",
        "description": "Trigger a container restart for the auth-api service"
      },
      {
        "step": 2,
        "action": "Clear Redis Cache",
        "description": "Clear the Redis cache to remove any stale or corrupted data"
      }
    ]
  },
  "trace_id": "UVIRA-C67DC4",
  "latency_ms": 6951
}
```

## Test Scenarios

### Test 1: Normal Traffic (Below Threshold)
```bash
curl -X POST http://localhost:8080/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "auth-api",
    "error_rate": 0.12,
    "message": "System heartbeat normal."
  }'
```

**Result:**
- Risk Score: 0.12
- Triggered: false
- SOP Retrieved: N/A
- Action: No AI action taken

### Test 2: Critical Spike (Above Threshold)
```bash
curl -X POST http://localhost:8080/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "auth-api",
    "error_rate": 0.92,
    "message": "Auth API error rate exceeding 85%"
  }'
```

**Result:**
- Risk Score: 0.92
- Triggered: true ✅
- SOP Retrieved: Redis/Restart SOP ✅
- Trace ID: UVIRA-XXXXXX
- Latency: ~3-7 seconds
- Remediation: Container restart + Redis cache clear ✅

## Files Structure

```
luvira-ops-demo-backend/
├── main.py                  # Main FastAPI application
├── test_api.py             # Test script with proof fields display
├── auth-api-sop.txt        # SOP document for KB upload
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (not in git)
├── .gitignore
└── README.md              # This file
```

## Key Implementation Details

### Policy Gate Logic
```python
def policy_gate(error_rate: float):
    THRESHOLD = 0.85
    return {
        "risk_score": round(error_rate, 2),
        "threshold": THRESHOLD,
        "triggered": error_rate >= THRESHOLD
    }
```

### KB Retrieval Function
- **Endpoint**: `https://kbaas.do-ai.run/v1/{kb_id}/retrieve`
- **Method**: POST
- **Parameters**:
  - `query`: Dynamic search string
  - `num_results`: 1
  - `alpha`: 0.5 (balanced search)
- **Response Field**: `text_content`

### Trace ID Generation
```python
trace_id = f"UVIRA-{uuid.uuid4().hex[:6].upper()}"
```

## Troubleshooting

### Issue: KB returns 404
**Solution**: Check KB ID format - remove extra quotes if present

### Issue: KB returns 403 - "Enable knowledgebase enhancements"
**Solution**: Enable in Feature Preview settings

### Issue: Empty sop_retrieved with [FALLBACK] prefix
**Cause**: KB search failed or returned no results
**Check**:
1. SOP uploaded to KB?
2. Search keywords match SOP content?
3. KB ID correct in `.env`?

### Issue: No results from KB
**Solution**: Adjust search query or upload more detailed SOP content

## Mission Control UI Integration

Frontend teams can use these response fields:

1. **Display SOP**: Show `sop_retrieved` to operators
2. **Trace Incidents**: Use `trace_id` for debugging
3. **Monitor Performance**: Track `latency_ms` for SLA compliance
4. **Show Pipeline**: Display `pipeline_stages` progress

Example UI Component:
```javascript
// Display proof of retrieval
<ProofPanel>
  <TraceId>{response.trace_id}</TraceId>
  <Latency>{response.latency_ms}ms</Latency>
  <SOPUsed>{response.sop_retrieved}</SOPUsed>
</ProofPanel>
```

## Next Steps

- [ ] Deploy to production environment
- [ ] Add more SOPs to Knowledge Base (database, network, storage)
- [ ] Implement SOP versioning
- [ ] Add metrics collection for KB retrieval accuracy
- [ ] Create dashboard for trace_id lookup
- [ ] Add authentication/authorization

## Support

For issues or questions, check:
- DigitalOcean Gradient AI Docs: https://docs.digitalocean.com/products/gradient-ai-platform/
- Knowledge Base Guide: https://docs.digitalocean.com/products/gradient-ai-platform/how-to/create-manage-agent-knowledge-bases/

---

**Built with**: FastAPI, DigitalOcean Gradient AI Platform, Python 3.11
**Last Updated**: 2026-03-04
