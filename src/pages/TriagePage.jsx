import { useEffect } from 'react';
import RecommendedTestsCard from '../components/RecommendedTestsCard';
import { useApp } from '../context/AppContext';

function TriagePage() {
  const { state, loading, loadRecommendations } = useApp();

  useEffect(() => {
    if (!state.recommendedTests.length) {
      loadRecommendations();
    }
  }, [state.recommendedTests.length, loadRecommendations]);

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">AI Symptom Analysis</p>
        <h2 className="mt-1 text-2xl font-bold">Medical Assistant Recommendation Engine</h2>
        <p className="mt-2 text-sm text-slate-600">
          Patient reported chest pain and elevated blood pressure. Risk profile indicates cardiovascular screening.
        </p>
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
