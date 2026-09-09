#!/usr/bin/env python3
"""
Test backend locally (bypassing ingress) to see if the issue is with ingress timeout
"""

import requests
import time

# Test locally
LOCAL_URL = "http://localhost:8001/api"

# First, create a user and get token
print("Creating test user...")
email = f"localtest_{int(time.time())}@example.com"
response = requests.post(
    f"{LOCAL_URL}/auth/register",
    json={"name": "Local Test", "email": email, "password": "TestPass123!"},
    timeout=30
)
print(f"Register response: {response.status_code}")

if response.status_code == 200:
    token = response.json()["token"]
    print(f"Got token: {token[:20]}...")
    
    # Now test generation
    print("\nTesting project generation locally (may take 15-90s)...")
    start = time.time()
    try:
        response = requests.post(
            f"{LOCAL_URL}/projects/generate",
            json={"prompt": "a simple landing page for a coffee shop"},
            headers={"Authorization": f"Bearer {token}"},
            timeout=120
        )
        elapsed = time.time() - start
        print(f"Generation response: {response.status_code} (took {elapsed:.1f}s)")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Project ID: {data.get('id')}")
            print(f"Code length: {len(data.get('code', ''))} chars")
            print(f"Code contains HTML: {'<html' in data.get('code', '').lower()}")
        else:
            print(f"Error: {response.text[:500]}")
    except requests.exceptions.Timeout:
        print(f"Request timed out after 120s")
    except Exception as e:
        print(f"Exception: {e}")
else:
    print(f"Failed to register: {response.text}")
