import time, uuid, os, json, requests
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from gradient import Gradient
from gradient_adk import entrypoint, add_llm_span

# 1. Initialize & Environment
load_dotenv(override=True)
app = FastAPI()

print("--- [LUVIRA OPS BACKEND] Initializing Demo Environment ---")

# --- THE DATA CONTRACT ---
class LogIngest(BaseModel):
    service_name: str
    error_rate: float
    message: str

# --- 1. THE DETERMINISTIC GATE ---
def policy_gate(error_rate: float):
    # Logic: AI ONLY runs if threshold is 0.85+ (Saving cost/compute)
    THRESHOLD = 0.85
    return {
        "risk_score": round(error_rate, 2),
        "threshold": THRESHOLD,
        "triggered": error_rate >= THRESHOLD
    }

# --- 2. THE AI ORCHESTRATOR ---
@entrypoint
def get_ai_remediation(service: str, issue: str):
    inference_client = Gradient(model_access_key=os.getenv("GRADIENT_MODEL_ACCESS_KEY"))
    model_slug = os.getenv("GRADIENT_MODEL_SLUG")

    # --- STAGE: RETRIEVE (Using DigitalOcean Knowledge Base API) ---
    # Fallback context if search fails
    sop_context = "[FALLBACK] Standard triage protocols: Monitor and alert on-call."
    try:
        kb_id = os.getenv("KNOWLEDGE_BASE_ID").strip('"')
        token = os.getenv("DIGITALOCEAN_TOKEN")

        # Tightened search: target Redis/Restart SOP with specific keywords
        # Matches "Auth API", "error rate exceeds 85%", "restart", "Redis cache"
        search_query = f"{service} error rate restart Redis cache clear"

        print(f"[DEBUG] KB ID: {kb_id}")
        print(f"[DEBUG] Search Query: {search_query}")

        # Use DigitalOcean Knowledge Base API (correct endpoint from docs)
        kb_url = f"https://kbaas.do-ai.run/v1/{kb_id}/retrieve"

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

        if kb_resp.status_code == 200:
            results = kb_resp.json().get("results", [])
            if results and len(results) > 0:
                # Extract text_content from first result
                retrieved_content = results[0].get("text_content", "")
                if retrieved_content and len(retrieved_content.strip()) > 0:
                    sop_context = retrieved_content
                    print(f"[DEBUG] ✅ KB Retrieved SOP: {sop_context}")
                else:
                    print("[DEBUG] ❌ KB returned empty content, using fallback")
            else:
                print("[DEBUG] ❌ KB search returned no results, using fallback")
        else:
            print(f"[DEBUG] ❌ KB Search failed with status {kb_resp.status_code}: {kb_resp.text}")

    except Exception as e:
        print(f"[DEBUG] ❌ KB Search failed: {e}")

    # --- STAGE: PLAN (Serverless Inference) ---
    user_prompt = f"Service: {service}. Issue: {issue}. SOP: {sop_context}."
    messages = [
        {"role": "system", "content": "You are a Luvira Ops Engineer. Return ONLY valid JSON. If the SOP mentions Redis or Restart, prioritize those steps."},
        {"role": "user", "content": f"{user_prompt} Generate a structured JSON remediation plan."}
    ]

    response = inference_client.chat.completions.create(
        model=model_slug,
        messages=messages,
        temperature=0.1
    )
    ai_output = response.choices[0].message.content

    # Trace for DigitalOcean Dashboard visibility
    try:
        add_llm_span(name="remediation_run", model=model_slug, input=user_prompt, output=ai_output)
    except:
        pass

    # Extract JSON from markdown if needed
    if "```json" in ai_output:
        ai_output = ai_output.split("```json")[1].split("```")[0].strip()

    # Return both the AI plan and the context for the "Proof of Retrieval" display
    return json.loads(ai_output), sop_context


# --- 3. THE ENDPOINT ---
@app.post("/ingest")
async def ingest(data: LogIngest):
    start_time = time.time()
    print(f"--- [INGEST] {data.service_name} | Error Rate: {data.error_rate} ---")

    # 1. ANALYZE & DECIDE (The Deterministic Gate)
    gate = policy_gate(data.error_rate)

    plan = None
    sop_used = "N/A"
    trace_id = f"UVIRA-{uuid.uuid4().hex[:6].upper()}" # Enterprise-style Trace ID

    # 2. RETRIEVE & PLAN (The Agentic Workflow)
    if gate["triggered"]:
        print(f" [GATE TRIGGERED] Analyzing Incident...")
        try:
            plan, sop_used = get_ai_remediation(data.service_name, data.message)
        except Exception as e:
            plan = {"error": "AI_GENERATION_FAILED", "detail": str(e)}
    else:
        print(" [GATE CLEARED] Baseline traffic. No AI required.")

    latency = int((time.time() - start_time) * 1000)

    # 3. Final Unified Response (Matches Frontend Scope Lock)
    return {
        "status": "success",
        "pipeline_stages": ["Ingest", "Analyze", "Decide", "Retrieve", "Plan"],
        "risk_score": gate["risk_score"],
        "threshold": gate["threshold"],
        "triggered": gate["triggered"],
        "sop_retrieved": sop_used,  # Use this to prove KB retrieval works!
        "remediation_plan": plan,
        "trace_id": trace_id,
        "latency_ms": latency
    }

# --- THE STARTUP BLOCK ---
if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Luvira Mission Control Backend: STARTING...")
    print(f"📍 API URL: http://localhost:8080")
    print("-------------------------------------------\n")
    uvicorn.run(app, host="0.0.0.0", port=8080)