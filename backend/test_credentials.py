#!/usr/bin/env python3
"""Test DigitalOcean credentials and list available models"""
import os
from dotenv import load_dotenv

# Force reload of environment
load_dotenv(override=True)

print("Environment variables loaded:")
print(f"  GRADIENT_MODEL_SLUG: {os.getenv('GRADIENT_MODEL_SLUG')}")
print(f"  GRADIENT_MODEL_ACCESS_KEY: {os.getenv('GRADIENT_MODEL_ACCESS_KEY')[:20]}...")
print(f"  DIGITALOCEAN_TOKEN: {os.getenv('DIGITALOCEAN_TOKEN')[:20]}...")
print()

# Test with Gradient SDK
print("Testing Gradient SDK authentication...")
try:
    from gradient import Gradient

    client = Gradient(model_access_key=os.getenv("GRADIENT_MODEL_ACCESS_KEY"))
    print("  ✓ Client initialized")

    # Try to list models
    print("  Attempting to list models...")
    models = client.models.list()
    print(f"  ✓ Successfully listed {len(models.data)} models:")
    for model in models.data:
        print(f"    - {model.id}")

except Exception as e:
    print(f"  ✗ Error: {e}")

print()

# Test with direct API call
print("Testing direct DigitalOcean API...")
try:
    import requests

    token = os.getenv("DIGITALOCEAN_TOKEN")
    headers = {"Authorization": f"Bearer {token}"}

    # Try account endpoint first
    response = requests.get("https://api.digitalocean.com/v2/account", headers=headers)
    if response.status_code == 200:
        print("  ✓ DigitalOcean token is valid")
    else:
        print(f"  ✗ Token validation failed: {response.status_code} - {response.text}")

except Exception as e:
    print(f"  ✗ Error: {e}")
