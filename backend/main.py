import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="FitBuddy AI API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    # Use a supported Gemini model ID from the current account
    model = genai.GenerativeModel("models/gemini-flash-latest")
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

class UserProfile(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    fitnessLevel: str
    goal: str
    location: str
    equipment: str
    conditions: Optional[str] = "None"
    availableTime: int

@app.get("/")
async def root():
    return {"message": "FitBuddy AI API is running"}

@app.post("/generate-plan")
async def generate_plan(profile: UserProfile):
    # Re-check API key in case it was added to .env after startup
    current_api_key = os.getenv("GEMINI_API_KEY")
    if not current_api_key:
        print("ERROR: GEMINI_API_KEY is missing!")
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    genai.configure(api_key=current_api_key)
    active_model = genai.GenerativeModel("models/gemini-flash-latest")

    prompt = f"""
    You are a certified AI fitness coach.
    Generate a personalized 7-day workout and nutrition plan.

    User Details:
    - Age: {profile.age}
    - Gender: {profile.gender}
    - Height: {profile.height} cm
    - Weight: {profile.weight} kg
    - Fitness Level: {profile.fitnessLevel}
    - Goal: {profile.goal}
    - Workout Location: {profile.location}
    - Equipment: {profile.equipment}
    - Medical Conditions: {profile.conditions}
    - Available time: {profile.availableTime} mins/day

    Requirements:
    1. Return a JSON object with two main keys: "weekly_plan" and "daily_diet_plan".
    2. "weekly_plan" MUST be a list of 7 objects, each containing:
       - "day": (int, 1-7)
       - "workout_focus": (string)
       - "exercises": List of objects with "name", "sets", "reps"
       - "estimated_duration": (string)
       - "calories_burned": (int)
       - "nutrition_suggestion": (string)
       - "recovery_tip": (string)
    3. "daily_diet_plan" MUST be an object with:
       - "meals": {{"breakfast": "", "lunch": "", "snack": "", "dinner": "", "protein_estimate": ""}}
    4. Safety: Ensure all exercises are safe for {profile.fitnessLevel} level.
    5. Length: Stay under 600 words total.
    6. Format: Return ONLY valid JSON.
    """


    try:
        print(f"Generating plan for {profile.goal}...")
        response = active_model.generate_content(prompt)
        text = response.text.strip()
        
        print("Response received from AI.")
        
        # Handle potential markdown formatting from AI
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
