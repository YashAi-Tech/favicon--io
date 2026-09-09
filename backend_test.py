#!/usr/bin/env python3
"""
Comprehensive backend API test for Lovable-clone FastAPI backend.
Tests AUTH flows, Google session rejection, and AI generation + Projects.
"""

import requests
import time
import uuid
import sys
import json

# Backend URL from frontend/.env
BASE_URL = "https://lovable-clone-64.preview.emergentagent.com/api"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_test(name, passed, details=""):
    """Log test result"""
    if passed:
        test_results["passed"].append(name)
        print(f"✅ PASS: {name}")
        if details:
            print(f"   {details}")
    else:
        test_results["failed"].append(name)
        print(f"❌ FAIL: {name}")
        if details:
            print(f"   {details}")

def log_warning(name, details=""):
    """Log warning"""
    test_results["warnings"].append(name)
    print(f"⚠️  WARNING: {name}")
    if details:
        print(f"   {details}")

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"✅ Passed: {len(test_results['passed'])}")
    print(f"❌ Failed: {len(test_results['failed'])}")
    print(f"⚠️  Warnings: {len(test_results['warnings'])}")
    
    if test_results['failed']:
        print("\nFailed Tests:")
        for test in test_results['failed']:
            print(f"  - {test}")
    
    if test_results['warnings']:
        print("\nWarnings:")
        for warning in test_results['warnings']:
            print(f"  - {warning}")
    
    print("="*80)
    return len(test_results['failed']) == 0

# ============================================================================
# 1. AUTH TESTS (JWT email/password)
# ============================================================================

def test_auth_flows():
    """Test all authentication flows"""
    print("\n" + "="*80)
    print("TESTING AUTH FLOWS")
    print("="*80)
    
    # Generate unique email for this test run
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePass123!"
    test_name = "Test User"
    
    # Test 1: Register new user
    print(f"\n1. Testing POST /auth/register with unique email: {unique_email}")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={"name": test_name, "email": unique_email, "password": test_password},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                user = data["user"]
                if "user_id" in user and "email" in user and "name" in user:
                    token = data["token"]
                    user_id = user["user_id"]
                    log_test(
                        "POST /auth/register - New user registration",
                        True,
                        f"Token: {token[:20]}..., User ID: {user_id}, Email: {user['email']}"
                    )
                else:
                    log_test(
                        "POST /auth/register - New user registration",
                        False,
                        f"Missing user fields. Got: {user}"
                    )
                    return None, None
            else:
                log_test(
                    "POST /auth/register - New user registration",
                    False,
                    f"Missing token or user in response. Got: {data}"
                )
                return None, None
        else:
            log_test(
                "POST /auth/register - New user registration",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return None, None
    except Exception as e:
        log_test("POST /auth/register - New user registration", False, f"Exception: {str(e)}")
        return None, None
    
    # Test 2: Register with same email (should fail)
    print(f"\n2. Testing POST /auth/register with SAME email (should fail)")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={"name": test_name, "email": unique_email, "password": test_password},
            timeout=30
        )
        
        if response.status_code == 400:
            log_test(
                "POST /auth/register - Duplicate email rejection",
                True,
                f"Correctly rejected with 400: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "POST /auth/register - Duplicate email rejection",
                False,
                f"Expected 400, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /auth/register - Duplicate email rejection", False, f"Exception: {str(e)}")
    
    # Test 3: Login with correct credentials
    print(f"\n3. Testing POST /auth/login with correct credentials")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": unique_email, "password": test_password},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                login_token = data["token"]
                log_test(
                    "POST /auth/login - Correct credentials",
                    True,
                    f"Token: {login_token[:20]}..."
                )
            else:
                log_test(
                    "POST /auth/login - Correct credentials",
                    False,
                    f"Missing token or user. Got: {data}"
                )
                return None, None
        else:
            log_test(
                "POST /auth/login - Correct credentials",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return None, None
    except Exception as e:
        log_test("POST /auth/login - Correct credentials", False, f"Exception: {str(e)}")
        return None, None
    
    # Test 4: Login with wrong password
    print(f"\n4. Testing POST /auth/login with wrong password")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": unique_email, "password": "WrongPassword123!"},
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "POST /auth/login - Wrong password rejection",
                True,
                f"Correctly rejected with 401: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "POST /auth/login - Wrong password rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /auth/login - Wrong password rejection", False, f"Exception: {str(e)}")
    
    # Test 5: GET /auth/me with valid token
    print(f"\n5. Testing GET /auth/me with valid Bearer token")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 200:
            user_data = response.json()
            if user_data.get("email") == unique_email.lower():
                log_test(
                    "GET /auth/me - Valid token",
                    True,
                    f"User: {user_data.get('name')} ({user_data.get('email')})"
                )
            else:
                log_test(
                    "GET /auth/me - Valid token",
                    False,
                    f"Email mismatch. Expected {unique_email.lower()}, got {user_data.get('email')}"
                )
        else:
            log_test(
                "GET /auth/me - Valid token",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /auth/me - Valid token", False, f"Exception: {str(e)}")
    
    # Test 6: GET /auth/me without token
    print(f"\n6. Testing GET /auth/me without token (should fail)")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "GET /auth/me - No token rejection",
                True,
                f"Correctly rejected with 401: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "GET /auth/me - No token rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /auth/me - No token rejection", False, f"Exception: {str(e)}")
    
    # Test 7: POST /auth/logout
    print(f"\n7. Testing POST /auth/logout with Bearer token")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 200:
            log_test(
                "POST /auth/logout - Logout",
                True,
                f"Response: {response.json()}"
            )
        else:
            log_test(
                "POST /auth/logout - Logout",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /auth/logout - Logout", False, f"Exception: {str(e)}")
    
    # Test 8: GET /auth/me with logged out token (should fail)
    print(f"\n8. Testing GET /auth/me with logged out token (should fail)")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "GET /auth/me - Logged out token rejection",
                True,
                f"Correctly rejected with 401: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "GET /auth/me - Logged out token rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /auth/me - Logged out token rejection", False, f"Exception: {str(e)}")
    
    # Return login_token for use in project tests (we need a fresh session)
    return login_token, unique_email


# ============================================================================
# 2. GOOGLE SESSION TEST
# ============================================================================

def test_google_session():
    """Test Google session endpoint with invalid session_id"""
    print("\n" + "="*80)
    print("TESTING GOOGLE SESSION")
    print("="*80)
    
    print(f"\n1. Testing POST /auth/session with invalid session_id")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/session",
            json={"session_id": "invalid_session_id_12345"},
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "POST /auth/session - Invalid session rejection",
                True,
                f"Correctly rejected with 401: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "POST /auth/session - Invalid session rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /auth/session - Invalid session rejection", False, f"Exception: {str(e)}")


# ============================================================================
# 3. AI GENERATION + PROJECTS TESTS
# ============================================================================

def test_projects_and_generation(auth_token):
    """Test AI generation and project management flows"""
    print("\n" + "="*80)
    print("TESTING AI GENERATION + PROJECTS")
    print("="*80)
    
    if not auth_token:
        log_test("Projects tests", False, "No auth token available, skipping project tests")
        return
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    project_id = None
    
    # Test 1: Generate new project
    print(f"\n1. Testing POST /projects/generate with new prompt (may take 15-90s)")
    try:
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/projects/generate",
            json={"prompt": "a simple landing page for a coffee shop"},
            headers=headers,
            timeout=90
        )
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "name" in data and "prompt" in data and "code" in data:
                project_id = data["id"]
                code = data["code"]
                
                # Verify code contains HTML
                if "<html" in code.lower():
                    log_test(
                        "POST /projects/generate - New project generation",
                        True,
                        f"Project ID: {project_id}, Code length: {len(code)} chars, Time: {elapsed:.1f}s"
                    )
                    
                    # Show snippet of generated code
                    print(f"   Code snippet: {code[:200]}...")
                else:
                    log_test(
                        "POST /projects/generate - New project generation",
                        False,
                        f"Code does not contain '<html'. Code: {code[:500]}"
                    )
            else:
                log_test(
                    "POST /projects/generate - New project generation",
                    False,
                    f"Missing required fields. Got: {list(data.keys())}"
                )
        else:
            log_test(
                "POST /projects/generate - New project generation",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except requests.exceptions.Timeout:
        log_test(
            "POST /projects/generate - New project generation",
            False,
            "Request timed out after 90s"
        )
    except Exception as e:
        log_test("POST /projects/generate - New project generation", False, f"Exception: {str(e)}")
    
    if not project_id:
        log_test("Remaining project tests", False, "No project created, skipping remaining tests")
        return
    
    # Test 2: List projects
    print(f"\n2. Testing GET /projects")
    try:
        response = requests.get(
            f"{BASE_URL}/projects",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            projects = response.json()
            if isinstance(projects, list):
                # Check if our project is in the list
                found = any(p.get("id") == project_id for p in projects)
                if found:
                    log_test(
                        "GET /projects - List projects",
                        True,
                        f"Found {len(projects)} project(s), including our test project"
                    )
                else:
                    log_test(
                        "GET /projects - List projects",
                        False,
                        f"Project {project_id} not found in list of {len(projects)} projects"
                    )
            else:
                log_test(
                    "GET /projects - List projects",
                    False,
                    f"Expected list, got {type(projects)}"
                )
        else:
            log_test(
                "GET /projects - List projects",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /projects - List projects", False, f"Exception: {str(e)}")
    
    # Test 3: Get specific project
    print(f"\n3. Testing GET /projects/{project_id}")
    try:
        response = requests.get(
            f"{BASE_URL}/projects/{project_id}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            project = response.json()
            if "id" in project and "code" in project and project["id"] == project_id:
                log_test(
                    "GET /projects/{id} - Get specific project",
                    True,
                    f"Retrieved project with {len(project.get('code', ''))} chars of code"
                )
            else:
                log_test(
                    "GET /projects/{id} - Get specific project",
                    False,
                    f"Missing fields or ID mismatch. Got: {list(project.keys())}"
                )
        else:
            log_test(
                "GET /projects/{id} - Get specific project",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /projects/{id} - Get specific project", False, f"Exception: {str(e)}")
    
    # Test 4: Iterate on project (update with new prompt)
    print(f"\n4. Testing POST /projects/generate with project_id (iteration, may take 15-90s)")
    try:
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/projects/generate",
            json={"prompt": "change the background to dark", "project_id": project_id},
            headers=headers,
            timeout=90
        )
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if "code" in data and "messages" in data:
                messages = data["messages"]
                if len(messages) >= 2:  # Should have at least 2 messages now
                    log_test(
                        "POST /projects/generate - Project iteration",
                        True,
                        f"Updated project, Messages: {len(messages)}, Time: {elapsed:.1f}s"
                    )
                else:
                    log_test(
                        "POST /projects/generate - Project iteration",
                        False,
                        f"Expected at least 2 messages, got {len(messages)}"
                    )
            else:
                log_test(
                    "POST /projects/generate - Project iteration",
                    False,
                    f"Missing code or messages. Got: {list(data.keys())}"
                )
        else:
            log_test(
                "POST /projects/generate - Project iteration",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except requests.exceptions.Timeout:
        log_test(
            "POST /projects/generate - Project iteration",
            False,
            "Request timed out after 90s"
        )
    except Exception as e:
        log_test("POST /projects/generate - Project iteration", False, f"Exception: {str(e)}")
    
    # Test 5: Push to GitHub (simulated)
    print(f"\n5. Testing POST /projects/{project_id}/github")
    try:
        response = requests.post(
            f"{BASE_URL}/projects/{project_id}/github",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if "github_url" in data and "simulated" in data and data["simulated"] is True:
                log_test(
                    "POST /projects/{id}/github - GitHub push",
                    True,
                    f"GitHub URL: {data['github_url']} (simulated)"
                )
            else:
                log_test(
                    "POST /projects/{id}/github - GitHub push",
                    False,
                    f"Missing github_url or simulated flag. Got: {data}"
                )
        else:
            log_test(
                "POST /projects/{id}/github - GitHub push",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /projects/{id}/github - GitHub push", False, f"Exception: {str(e)}")
    
    # Test 6: Publish project (simulated)
    print(f"\n6. Testing POST /projects/{project_id}/publish")
    try:
        response = requests.post(
            f"{BASE_URL}/projects/{project_id}/publish",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if "published_url" in data and "simulated" in data and data["simulated"] is True:
                log_test(
                    "POST /projects/{id}/publish - Publish project",
                    True,
                    f"Published URL: {data['published_url']} (simulated)"
                )
            else:
                log_test(
                    "POST /projects/{id}/publish - Publish project",
                    False,
                    f"Missing published_url or simulated flag. Got: {data}"
                )
        else:
            log_test(
                "POST /projects/{id}/publish - Publish project",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /projects/{id}/publish - Publish project", False, f"Exception: {str(e)}")
    
    # Test 7: Delete project
    print(f"\n7. Testing DELETE /projects/{project_id}")
    try:
        response = requests.delete(
            f"{BASE_URL}/projects/{project_id}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            log_test(
                "DELETE /projects/{id} - Delete project",
                True,
                f"Project deleted successfully"
            )
        else:
            log_test(
                "DELETE /projects/{id} - Delete project",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("DELETE /projects/{id} - Delete project", False, f"Exception: {str(e)}")
    
    # Test 8: Verify project is deleted (should get 404)
    print(f"\n8. Testing GET /projects/{project_id} after deletion (should fail)")
    try:
        response = requests.get(
            f"{BASE_URL}/projects/{project_id}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 404:
            log_test(
                "GET /projects/{id} - Deleted project 404",
                True,
                f"Correctly returned 404: {response.json().get('detail', '')}"
            )
        else:
            log_test(
                "GET /projects/{id} - Deleted project 404",
                False,
                f"Expected 404, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /projects/{id} - Deleted project 404", False, f"Exception: {str(e)}")
    
    # Test 9: Verify auth isolation - generation without token
    print(f"\n9. Testing POST /projects/generate without token (should fail)")
    try:
        response = requests.post(
            f"{BASE_URL}/projects/generate",
            json={"prompt": "test"},
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "POST /projects/generate - No token rejection",
                True,
                f"Correctly rejected with 401"
            )
        else:
            log_test(
                "POST /projects/generate - No token rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("POST /projects/generate - No token rejection", False, f"Exception: {str(e)}")
    
    # Test 10: Verify auth isolation - list without token
    print(f"\n10. Testing GET /projects without token (should fail)")
    try:
        response = requests.get(
            f"{BASE_URL}/projects",
            timeout=30
        )
        
        if response.status_code == 401:
            log_test(
                "GET /projects - No token rejection",
                True,
                f"Correctly rejected with 401"
            )
        else:
            log_test(
                "GET /projects - No token rejection",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
    except Exception as e:
        log_test("GET /projects - No token rejection", False, f"Exception: {str(e)}")


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all tests"""
    print("="*80)
    print("LOVABLE-CLONE BACKEND API TEST SUITE")
    print(f"Backend URL: {BASE_URL}")
    print("="*80)
    
    # Run auth tests and get token
    login_token, test_email = test_auth_flows()
    
    # Run Google session test
    test_google_session()
    
    # Run projects and generation tests
    test_projects_and_generation(login_token)
    
    # Print summary
    success = print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
