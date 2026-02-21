import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing key: {api_key[:10]}...")

genai.configure(api_key=api_key)
# Use a supported Gemini model from this account
model = genai.GenerativeModel("models/gemini-flash-latest")

try:
    response = model.generate_content("Say hello")
    print("SUCCESS:", response.text)
except Exception as e:
    print("FAILED:", str(e))
