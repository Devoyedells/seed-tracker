import requests
import sys
import json
import uuid
from datetime import datetime

class SierraSeeds_API_Tester:
    def __init__(self, base_url="https://sierra-seeds.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_seed_id = None

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED: {details}")
        
        self.test_results.append({
            "test": test_name,
            "status": "PASSED" if success else "FAILED",
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, use_auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if use_auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_detail = response.json()
                    details += f", Response: {error_detail}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_result(name, success, details)
            
            if success:
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                return success, {}

        except Exception as e:
            self.log_result(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@sierraseeds.sl"
        registration_data = {
            "email": unique_email,
            "password": "TestPass123!",
            "full_name": "Test User Sierra",
            "role": "farmer",
            "phone": "+232 76 123 456",
            "organization": "Test Farm",
            "region": "Eastern Province"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=registration_data
        )
        
        if success:
            self.token = response.get('access_token')
            self.user = response.get('user')
        
        return success

    def test_user_login(self):
        """Test user login with existing user"""
        if not self.user:
            return False
            
        login_data = {
            "email": self.user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success:
            self.token = response.get('access_token')
        
        return success

    def test_get_current_user(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            use_auth=True
        )
        return success

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        success, _ = self.run_test(
            "Invalid Login (should fail)",
            "POST",
            "auth/login",
            401,
            data=login_data
        )
        return success

    def test_get_seeds(self):
        """Test getting all seeds"""
        success, response = self.run_test(
            "Get All Seeds",
            "GET",
            "seeds",
            200
        )
        
        if success and isinstance(response, list):
            self.log_result("Seeds Response Format", True, f"Returned {len(response)} seeds")
        else:
            self.log_result("Seeds Response Format", False, "Invalid response format")
        
        return success

    def test_get_seeds_with_filters(self):
        """Test getting seeds with filters"""
        # Test region filter
        success, response = self.run_test(
            "Get Seeds by Region Filter",
            "GET",
            "seeds?region=Eastern Province",
            200
        )
        
        # Test crop type filter
        success2, response2 = self.run_test(
            "Get Seeds by Crop Type Filter",
            "GET",
            "seeds?crop_type=rice",
            200
        )
        
        # Test search
        success3, response3 = self.run_test(
            "Get Seeds by Search Query",
            "GET",
            "seeds?search=NERICA",
            200
        )
        
        return success and success2 and success3

    def test_create_seed(self):
        """Test creating a new seed"""
        seed_data = {
            "name": f"Test Seed {uuid.uuid4().hex[:8]}",
            "variety": "Test Variety",
            "crop_type": "rice",
            "region": "Western Area",
            "distributor": "Test Distributor",
            "distributor_contact": "+232 76 987 654",
            "stock_quantity": 100,
            "unit": "kg",
            "price_per_unit": 15000,
            "quality_grade": "Grade A",
            "planting_season": "April-June",
            "maturity_days": 90,
            "description": "Test seed for API testing"
        }
        
        success, response = self.run_test(
            "Create New Seed",
            "POST",
            "seeds",
            200,
            data=seed_data,
            use_auth=True
        )
        
        if success:
            self.created_seed_id = response.get('seed_id')
            
        return success

    def test_get_single_seed(self):
        """Test getting a single seed by ID"""
        if not self.created_seed_id:
            self.log_result("Get Single Seed", False, "No seed ID available from create test")
            return False
            
        success, response = self.run_test(
            "Get Single Seed",
            "GET",
            f"seeds/{self.created_seed_id}",
            200
        )
        
        return success

    def test_update_seed(self):
        """Test updating a seed"""
        if not self.created_seed_id:
            self.log_result("Update Seed", False, "No seed ID available from create test")
            return False
            
        update_data = {
            "stock_quantity": 200,
            "price_per_unit": 16000
        }
        
        success, response = self.run_test(
            "Update Seed",
            "PUT",
            f"seeds/{self.created_seed_id}",
            200,
            data=update_data,
            use_auth=True
        )
        
        return success

    def test_analytics(self):
        """Test analytics endpoint"""
        success, response = self.run_test(
            "Get Analytics",
            "GET",
            "analytics",
            200
        )
        
        if success:
            expected_fields = ['total_seeds', 'total_distributors', 'total_regions', 'total_registrations']
            has_all_fields = all(field in response for field in expected_fields)
            self.log_result("Analytics Response Fields", has_all_fields, 
                          f"Missing fields: {[f for f in expected_fields if f not in response]}")
        
        return success

    def test_regions(self):
        """Test regions endpoint"""
        success, response = self.run_test(
            "Get Regions",
            "GET",
            "regions",
            200
        )
        
        if success and 'regions' in response:
            regions = response['regions']
            expected_regions = ['Eastern Province', 'Northern Province', 'Western Area']
            has_expected = all(region in regions for region in expected_regions)
            self.log_result("Regions Response Content", has_expected, 
                          f"Found regions: {regions}")
        
        return success

    def test_create_registration(self):
        """Test creating a new registration"""
        registration_data = {
            "applicant_name": "Test Applicant",
            "applicant_email": f"applicant_{uuid.uuid4().hex[:8]}@test.sl",
            "applicant_type": "producer",
            "organization": "Test Organization",
            "phone": "+232 76 111 222",
            "region": "Western Area",
            "seed_variety": "Test Variety",
            "documents_submitted": ["Business License", "Tax Certificate"]
        }
        
        success, response = self.run_test(
            "Create Registration",
            "POST",
            "registrations",
            200,
            data=registration_data
        )
        
        return success

    def test_get_registrations(self):
        """Test getting registrations (requires auth)"""
        success, response = self.run_test(
            "Get Registrations",
            "GET",
            "registrations",
            200,
            use_auth=True
        )
        
        return success

    def test_unauthorized_access(self):
        """Test accessing protected endpoints without auth"""
        success, response = self.run_test(
            "Unauthorized Access (should fail)",
            "GET",
            "registrations",
            401,
            use_auth=False
        )
        
        return success

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🔍 Starting Sierra Leone Seed Tracker API Tests...")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 60)

        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        print("-" * 30)
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        self.test_invalid_login()
        self.test_unauthorized_access()

        # Seeds API Tests
        print("\n🌱 SEEDS API TESTS")
        print("-" * 30)
        self.test_get_seeds()
        self.test_get_seeds_with_filters()
        self.test_create_seed()
        self.test_get_single_seed()
        self.test_update_seed()

        # Analytics Tests
        print("\n📊 ANALYTICS TESTS")
        print("-" * 30)
        self.test_analytics()
        self.test_regions()

        # Registration Tests
        print("\n📝 REGISTRATION TESTS")
        print("-" * 30)
        self.test_create_registration()
        self.test_get_registrations()

        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}/{self.tests_run}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")

        # Failed tests detail
        failed_tests = [t for t in self.test_results if t['status'] == 'FAILED']
        if failed_tests:
            print("\n❌ FAILED TESTS DETAILS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")

        return self.tests_passed == self.tests_run

def main():
    tester = SierraSeeds_API_Tester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())