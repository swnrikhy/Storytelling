import React, { useState } from 'react';
import { testOpenRouter } from '../services/openRouterService';

export const OpenRouterTest: React.FC = () => {
  const [prompt, setPrompt] = useState('What is the meaning of life?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const result = await testOpenRouter(prompt);
      setResponse(result || 'No response content');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800">OpenRouter Integration Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
        />
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Sending...' : 'Send to OpenRouter'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Response:</h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-800">
            {response}
          </div>
        </div>
      )}
      
      <p className="mt-4 text-xs text-slate-500">
        Note: This requires <code>VITE_OPENROUTER_API_KEY</code> to be set in your environment variables.
      </p>
    </div>
  );
};
