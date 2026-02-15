import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

function AIHealthInsightCard({ insight }) {
  if (!insight?.recentSymptoms?.trim()) return null;

  return (
    <section className="card">
      <h2 className="text-lg font-semibold">Your AI Health Summary</h2>
      <p className="mt-2 text-sm text-slate-600">{insight.recentSymptoms}</p>

      <div className="mt-4 rounded-xl border border-slate-100 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Risk Score</span>
          <span className="font-semibold text-med-700">{insight.riskScore}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-100">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
            style={{ width: `${insight.riskScore}%` }}
          />
        </div>
      </div>

      <div className="mt-4 h-20 w-full rounded-xl bg-slate-50 p-2">
        <ResponsiveContainer>
          <LineChart data={insight.trend}>
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#1468d6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-sm flex items-center justify-between">
        <span className="font-semibold">Risk Assessment:</span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${insight.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
            insight.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}>
          {insight.riskLevel} Risk
        </span>
      </p>

      <p className="mt-2 text-sm"><span className="font-semibold">Recommended Department:</span> {insight.recommendedDepartment}</p>

      {insight.reasoning && insight.reasoning.length > 0 && (
        <div className="mt-3 rounded-lg bg-indigo-50 p-3 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-700 mb-1">AI Reasoning (Explainable Insights)</p>
          <ul className="list-disc pl-4 text-xs text-indigo-900 space-y-1">
            {insight.reasoning.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Pending Test Suggestions</p>
      {insight.pendingTests.length ? (
        <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
          {insight.pendingTests.map((test) => (
            <li key={test}>{test}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-slate-600">No pending test suggestions.</p>
      )}

      <Link to="/triage" className="btn-primary mt-4 w-full">
        View Detailed Analysis
      </Link>
    </section>
  );
}

export default AIHealthInsightCard;
