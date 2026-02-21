# FitBuddy AI Fitness Coach

FitBuddy is a modern web application that uses AI to generate personalized 7-day workout and nutrition plans.

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
1. Navigate to the `backend` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Add your **Gemini API Key** to the `.env` file.
5. Run the server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup (React + Vite)
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack
- **Frontend**: React, Vite, Vanilla CSS (Modern Glassmorphism)
- **Backend**: FastAPI, Pydantic, Python-dotenv
- **AI**: Google Gemini 1.5 Flash

## 💡 Features
- **Dynamic Goals**: Weight Loss, Muscle Gain, Fat Loss, General Fitness.
- **Equipment Awareness**: Tailors exercises based on what you have (Gym vs Home).
- **Nutrition & Recovery**: Daily tips for a holistic approach.
- **Responsive Design**: Works on Desktop and Mobile.
