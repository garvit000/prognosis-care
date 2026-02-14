import { useState } from 'react';
import RecommendedTestsCard from '../components/RecommendedTestsCard';
import { useApp } from '../context/AppContext';

function TriagePage() {
  const { state, loading, loadRecommendations } = useApp();
  const [symptoms, setSymptoms] = useState(state.patientSymptoms || '');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Please enter symptoms before running AI analysis.');
      return;
    }
    setError('');
    await loadRecommendations(symptoms);
  };

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">AI Symptom Analysis</p>
        <h2 className="mt-1 text-2xl font-bold">Medical Assistant Recommendation Engine</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your symptoms to generate a personalized triage summary and recommendations.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Symptoms / Concerns
          <textarea
            className="input mt-2 min-h-[110px]"
            placeholder="Example: chest discomfort for 2 days, dizziness, high BP readings..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </label>

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <button type="button" className="btn-primary mt-3" onClick={handleAnalyze} disabled={loading.recommendations}>
          {loading.recommendations ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
        </button>
      </section>

      {loading.recommendations ? (
        <section className="card text-center">
          <p className="text-sm text-slate-600">Analyzing symptoms and building test recommendations...</p>
        </section>
      ) : (
        <RecommendedTestsCard tests={state.recommendedTests} summary={state.recommendationSummary} />
      )}
    </div>
  );
}

export default TriagePage;
