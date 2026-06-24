import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

function App() {
  const [step, setStep] = useState('landing'); // landing, form, dashboard
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'male',
    height: 175,
    weight: 70,
    fitnessLevel: 'beginner',
    goal: 'muscle gain',
    location: 'gym',
    equipment: 'full gym',
    conditions: '',
    availableTime: 45
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep('loading');

    try {
      const response = await fetch('https://fitbuddyy.onrender.com/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate plan');

      const data = await response.json();
      console.log("Plan generated:", data);
      setPlan(data);
      setStep('dashboard');
    } catch (error) {
      console.error("Generation error:", error);
      alert('Error generating plan. Please ensure the backend is running with a valid Gemini API Key.');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('landing');
    setPlan(null);
  };

  const downloadPDF = () => {
    if (!plan) return;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 255, 136); // Primary Green
    doc.text('FITBUDDY Transformation Plan', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${formData.age}yr old ${formData.gender} | Goal: ${formData.goal}`, 105, 30, { align: 'center' });

    // Weekly Plan Table
    const tableData = plan.weekly_plan.map(day => [
      `Day ${day.day}`,
      day.workout_focus,
      day.exercises.map(ex => `${ex.name} (${ex.sets}x${ex.reps})`).join('\n'),
      day.estimated_duration,
      `${day.calories_burned} kcal`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Day', 'Focus', 'Exercises', 'Duration', 'Cals']],
      body: tableData,
      headStyles: { fillColor: [0, 255, 136], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40 },
    });

    // Diet Plan Section
    if (plan.daily_diet_plan) {
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(0, 221, 235); // Secondary Blue
      doc.text('Daily Optimal Diet Plan', 14, finalY);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const meals = plan.daily_diet_plan.meals;
      const dietText = [
        `Breakfast: ${meals.breakfast}`,
        `Lunch: ${meals.lunch}`,
        `Snack: ${meals.snack}`,
        `Dinner: ${meals.dinner}`,
        `Protein Target: ${meals.protein_estimate || 'N/A'}`
      ];

      doc.text(dietText, 14, finalY + 10);
    }

    // Footnote
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Built with FitBuddy AI Coach', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save('FitBuddy_Transformation_Plan.pdf');
  };

  return (
    <div className="app">
      <div className="background-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="app-container">
        <header className="header">
          <div className="logo" onClick={reset} style={{ cursor: 'pointer' }}>
            FIT<span>BUDDY</span>
          </div>
          {step !== 'landing' && (
            <button className="btn-generate" style={{ marginTop: 0, padding: '0.6rem 1.5rem' }} onClick={() => setStep('form')}>
              New Plan
            </button>
          )}
        </header>

        {step === 'landing' && (
          <section className="hero">
            <h1>Your Journey to <span>Peak Fitness</span> Starts Here.</h1>
            <p>
              Experience the power of a personalized AI fitness coach.
              Get custom 7-day workout and nutrition plans tailored exactly to your body.
            </p>
            <button className="btn-generate" onClick={() => setStep('form')}>
              Get Started Now
            </button>
          </section>
        )}

        {step === 'form' && (
          <section className="form-container glass">
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Personalize Your Plan</h2>
            <form onSubmit={generatePlan} className="form-grid">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Fitness Level</label>
                <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleInputChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Goal</label>
                <select name="goal" value={formData.goal} onChange={handleInputChange}>
                  <option value="weight loss">Weight Loss</option>
                  <option value="muscle gain">Muscle Gain</option>
                  <option value="fat loss">Fat Loss</option>
                  <option value="general fitness">General Fitness</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <select name="location" value={formData.location} onChange={handleInputChange}>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div className="form-group">
                <label>Available Time (mins)</label>
                <input type="number" name="availableTime" value={formData.availableTime} onChange={handleInputChange} required />
              </div>
              <div className="form-group full-width">
                <label>Equipment Available</label>
                <input type="text" name="equipment" placeholder="Dumbbells, Bench, None, etc." value={formData.equipment} onChange={handleInputChange} required />
              </div>
              <div className="form-group full-width">
                <label>Medical Conditions (Optional)</label>
                <textarea name="conditions" value={formData.conditions} onChange={handleInputChange} rows="2" placeholder="e.g. Knee pain, Asthma"></textarea>
              </div>
              <button type="submit" className="btn-generate full-width" disabled={loading}>
                {loading ? 'Generating...' : 'Generate My 7-Day Plan'}
              </button>
            </form>
          </section>
        )}

        {step === 'loading' && (
          <div className="loader-container">
            <div className="spinner"></div>
            <h3>Generating your unique fitness plan...</h3>
            <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Our AI is calculating the optimal path for your goals.</p>
          </div>
        )}

        {step === 'dashboard' && plan && (
          <div className="plan-dashboard">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Your 7-Day <span>Transformation Strategy</span></h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <button className="btn-generate" style={{ background: 'var(--accent)', color: '#fff' }} onClick={downloadPDF}>
                Download Plan as PDF
              </button>
            </div>

            <div className="plan-grid">
              {plan.weekly_plan && Array.isArray(plan.weekly_plan) ? plan.weekly_plan.map((day, idx) => (
                <div key={idx} className="day-card glass">
                  <div className="day-header">
                    <span className="day-number">Day {day.day}</span>
                    <span className="focus-tag">{day.workout_focus}</span>
                  </div>

                  <ul className="exercise-list">
                    {day.exercises && Array.isArray(day.exercises) ? day.exercises.map((ex, i) => (
                      <li key={i} className="exercise-item">
                        <span className="exc-name">{ex.name}</span>
                        <span className="exc-sets">{ex.sets} x {ex.reps}</span>
                      </li>
                    )) : <li>No exercises found</li>}
                  </ul>

                  <div className="nutrition-box">
                    <strong style={{ color: 'var(--secondary)' }}>Nutrition:</strong> {day.nutrition_suggestion}
                  </div>

                  <div className="recovery-box">
                    <strong style={{ color: 'var(--accent)' }}>Recovery:</strong> {day.recovery_tip}
                  </div>

                  <div className="day-footer">
                    <span>⏱ {day.estimated_duration}</span>
                    <span>🔥 {day.calories_burned} kcal</span>
                  </div>
                </div>
              )) : <p>No plan data available.</p>}
            </div>

            {plan.daily_diet_plan && (
              <div className="day-card glass full-width" style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Daily Optimal Diet Plan</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  {plan.daily_diet_plan.meals ? (
                    <>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Breakfast</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{plan.daily_diet_plan.meals.breakfast}</p>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Lunch</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{plan.daily_diet_plan.meals.lunch}</p>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Snack</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{plan.daily_diet_plan.meals.snack}</p>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Dinner</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{plan.daily_diet_plan.meals.dinner}</p>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)' }}>Protein Target</strong>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{plan.daily_diet_plan.meals.protein_estimate || plan.daily_diet_plan.protein_estimate || 'N/A'}</p>
                      </div>
                    </>
                  ) : (
                    <p>Diet plan details not available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
