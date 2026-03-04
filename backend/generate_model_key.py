#!/usr/bin/env python3
"""Generate a new Gradient Model Access Key"""
import os
from dotenv import load_dotenv
from gradient import Gradient

load_dotenv(override=True)

try:
    # Use DigitalOcean API token
    client = Gradient(access_token=os.getenv("DIGITALOCEAN_TOKEN"))

    # First, list available models
    print("Listing available models...")
    try:
        models = client.models.list()
        print("\nAvailable models:")
        print("="*60)
        if hasattr(models, 'models'):
            for model in models.models:
                print(f"  - {model.id}")
        else:
            print(f"Models structure: {dir(models)}")
        print("="*60)
    except Exception as e:
        print(f"Could not list models: {e}")

    # Try to create a new model access key
    print("\nAttempting to create new model access key...")
    try:
        api_key = client.inference.api_keys.create()
        print("\n" + "="*60)
        print("SUCCESS! New Model Access Key created:")
        print("="*60)
        print(f"\nKey: {api_key.api_key}")
        print("\nUpdate your .env file with:")
        print(f'GRADIENT_MODEL_ACCESS_KEY={api_key.api_key}')
        print("\n" + "="*60)
    except Exception as e:
        print(f"Could not create API key: {e}")
        print("\nYou can create a key manually in the DigitalOcean Control Panel:")
        print("1. Go to https://cloud.digitalocean.com/gradient-ai/inference")
        print("2. Scroll to 'Model Access Keys' section")
        print("3. Click 'Create Access Key'")
        print("4. Copy the key and update your .env file")

except Exception as e:
    print(f"Error: {e}")
    print("\nMake sure your DIGITALOCEAN_TOKEN in .env is valid.")
