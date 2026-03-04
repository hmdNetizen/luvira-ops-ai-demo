import requests
import json

# The URL where your main.py is running
BASE_URL = "http://localhost:8080/ingest"


def run_test(test_name, service, error_rate, message):
    print(f"\n--- Running Test: {test_name} ---")
    payload = {
        "service_name": service,
        "error_rate": error_rate,
        "message": message
    }

    try:
        response = requests.post(BASE_URL, json=payload)
        data = response.json()

        print(f"Status: {response.status_code}")
        print(f"Risk Score: {data.get('risk_score')}")
        print(f"Triggered AI: {data.get('triggered')}")

        # Display Proof Fields for Mission Control UI
        print(f"\n--- Proof Fields ---")
        print(f"Trace ID: {data.get('trace_id')}")
        print(f"Latency: {data.get('latency_ms')} ms")
        print(f"SOP Retrieved: {data.get('sop_retrieved')}")

        if data.get('triggered'):
            print("\n--- AI Remediation Plan ---")
            print(json.dumps(data.get('remediation_plan'), indent=2))
        else:
            print("\nAction: No AI action taken (Below threshold).")

    except Exception as e:
        print(f"Error: Could not connect to the server. Is main.py running? \n{e}")


if __name__ == "__main__":
    # TEST 1: Normal Traffic (Should NOT trigger AI)
    run_test(
        test_name="Normal Operations",
        service="auth-api",
        error_rate=0.12,
        message="System heartbeat normal."
    )

    # TEST 2: Incident Spike (Should TRIGGER AI & Retrieval)
    run_test(
        test_name="Critical Spike",
        service="auth-api",
        error_rate=0.92,
        message="Auth API error rate exceeding 85%"
    )