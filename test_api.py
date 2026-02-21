import requests
import json

url = "http://localhost:8000/generate-plan"
payload = {
    "age": 25,
    "gender": "male",
    "height": 175.0,
    "weight": 70.0,
    "fitnessLevel": "intermediate",
    "goal": "muscle gain",
    "location": "gym",
    "equipment": "full gym",
    "conditions": "None",
    "availableTime": 60
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
