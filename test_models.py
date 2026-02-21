import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro']

for m in models:
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("test")
        print(f"SUCCESS: {m}")
    except Exception as e:
        print(f"FAILED: {m} - {e}")
