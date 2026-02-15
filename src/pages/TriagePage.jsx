import { useState, useRef, useEffect, useCallback } from 'react';
import RecommendedTestsCard from '../components/RecommendedTestsCard';
import { useApp } from '../context/AppContext';

function TriagePage() {
  const { state, loading, loadRecommendations } = useApp();
  const [symptoms, setSymptoms] = useState(state.patientSymptoms || '');
  const [error, setError] = useState('');

  // ─── Voice Recognition State ───
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      if (final) {
        setSymptoms((prev) => (prev ? prev + ' ' + final.trim() : final.trim()));
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permission.');
      } else if (event.error === 'network') {
        setError('Voice recognition requires an internet connection. Please type your symptoms.');
      } else if (event.error === 'no-speech') {
        // Ignore no-speech, just stop listening
      } else {
        setError(`Voice recognition error: ${event.error}. Please type your symptoms.`);
      }
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError('');
      setInterimText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleAnalyze = async () => {
    if (isListening) recognitionRef.current?.stop();
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
          Enter your symptoms or <strong>tap the mic</strong> to speak them aloud.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Symptoms / Concerns
          <div className="relative mt-2">
            <textarea
              className="input min-h-[110px] pr-14"
              placeholder="Example: chest discomfort for 2 days, dizziness, high BP readings..."
              value={symptoms + (interimText ? ' ' + interimText : '')}
              onChange={(e) => { setSymptoms(e.target.value); setInterimText(''); }}
            />
            {/* ── Mic button inside textarea ── */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                    : 'bg-med-100 text-med-700 hover:bg-med-200'
                  }`}
              >
                {isListening ? (
                  /* stop icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="5" y="5" width="10" height="10" rx="1" />
                  </svg>
                ) : (
                  /* mic icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </label>

        {/* Listening indicator */}
        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 font-medium animate-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Listening… speak your symptoms
          </div>
        )}

        {!voiceSupported && (
          <p className="mt-2 text-xs text-amber-600">
            ⚠️ Voice input is not supported in this browser. Please type your symptoms instead.
          </p>
        )}

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <div className="mt-3 flex items-center gap-3">
          <button type="button" className="btn-primary" onClick={handleAnalyze} disabled={loading.recommendations}>
            {loading.recommendations ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
          </button>

          {voiceSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${isListening
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-med-50 text-med-700 border border-med-300 hover:bg-med-100'
                }`}
            >
              {isListening ? '⏹ Stop Recording' : '🎙️ Voice Input'}
            </button>
          )}
        </div>
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
