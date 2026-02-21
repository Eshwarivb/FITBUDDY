import os
import json
import google.generativeai as genai

# Configuration
API_KEY = "YOUR_GEMINI_API_KEY"  # User should replace this
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Prompt Templates
WORKOUT_PLAN_PROMPT = """
You are a certified AI fitness coach.

Generate a personalized 7-day workout and nutrition plan based on the following user details:

User Details:
- Age: {age}
- Gender: {gender}
- Height: {height} cm
- Weight: {weight} kg
- Fitness Level: {level}
- Goal: {goal}
- Workout Location: {location}
- Available Equipment: {equipment}
- Medical Conditions (if any): {conditions}
- Available workout time per day: {time} minutes

Requirements:
1. Provide a structured 7-day plan.
2. Each day must include:
   - Workout Focus
   - Exercises (sets & reps)
   - Estimated duration
   - Calories burned (approx)
3. Include a daily nutrition suggestion.
4. Add 1 recovery tip per day.
5. Ensure exercises are safe for the given fitness level.
6. Keep response under 600 words.
7. Format the output in clean JSON format.
"""

DIET_PLAN_PROMPT = """
Generate a one-day diet plan for a {goal} individual:
- Weight: {weight}
- Vegetarian or Non-Vegetarian: {type}
- Calorie target: {calories}

Include:
- Breakfast
- Lunch
- Snack
- Dinner
- Protein estimate
Return in JSON format.
"""

def generate_fitness_plan(user_data):
    prompt = WORKOUT_PLAN_PROMPT.format(**user_data)
    response = model.generate_content(prompt)
    try:
        # Clean the response to ensure it's valid JSON
        json_content = response.text.strip('`').strip('json').strip()
        return json.loads(json_content)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return response.text

def generate_diet_plan(diet_data):
    prompt = DIET_PLAN_PROMPT.format(**diet_data)
    response = model.generate_content(prompt)
    try:
        json_content = response.text.strip('`').strip('json').strip()
        return json.loads(json_content)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return response.text

if __name__ == "__main__":
    # Example usage
    sample_user = {
        "age": 25,
        "gender": "Male",
        "height": 175,
        "weight": 70,
        "level": "beginner",
        "goal": "muscle gain",
        "location": "gym",
        "equipment": "full gym",
        "conditions": "none",
        "time": 45
    }
    
    # print(generate_fitness_plan(sample_user))
    print("Script ready. Please provide your Gemini API key to run.")
