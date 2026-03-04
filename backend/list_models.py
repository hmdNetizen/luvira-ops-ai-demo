#!/usr/bin/env python3
"""
Quick script to list available models in your DigitalOcean Gradient account
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

try:
    # Use DigitalOcean API directly
    token = os.getenv("DIGITALOCEAN_TOKEN")
    headers = {"Authorization": f"Bearer {token}"}

    print("Fetching available models from DigitalOcean...\n")

    # Try the GenAI models endpoint
    response = requests.get("https://api.digitalocean.com/v2/genai/models", headers=headers)

    if response.status_code == 200:
        data = response.json()
        models = data.get("models", [])

        print("Available model IDs:")
        print("-" * 60)
        for model in models:
            model_id = model.get("id", "N/A")
            model_name = model.get("name", "N/A")
            print(f"  - {model_id}")
            if model_name != model_id:
                print(f"    ({model_name})")
        print("-" * 60)
        print(f"\nTotal models: {len(models)}")
        print("\nCopy one of these model IDs to your .env file as GRADIENT_MODEL_SLUG")
    else:
        print(f"API Error: {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"Error: {e}")
