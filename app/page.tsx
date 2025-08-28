'use client';

import { useState, useEffect } from 'react';

interface FormData {
  apiKey: string;
  model: 'gpt-4.1' | 'gpt-4.1-mini' | 'gpt-4.1-nano';
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  responseFormat: 'text' | 'json_object';
}

interface ApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const defaultValues: FormData = {
  apiKey: '',
  model: 'gpt-4.1',
  systemPrompt: 'You are a helpful assistant.',
  userPrompt: 'Hello!',
  temperature: 1,
  responseFormat: 'text',
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('llm-playground-api-key');
    if (savedApiKey) {
      setFormData(prev => ({ ...prev, apiKey: savedApiKey }));
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (formData.apiKey) {
      localStorage.setItem('llm-playground-api-key', formData.apiKey);
    }
  }, [formData.apiKey]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: formData.apiKey,
          model: formData.model,
          messages: [
            {
              role: 'system',
              content: formData.systemPrompt,
            },
            {
              role: 'user',
              content: formData.userPrompt,
            },
          ],
          response_format: { type: formData.responseFormat },
          temperature: formData.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setOutput(data.choices[0].message.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const savedApiKey = localStorage.getItem('llm-playground-api-key') || '';
    setFormData({ ...defaultValues, apiKey: savedApiKey });
    setOutput('');
    setError('');
  };

  const isFormValid = () => {
    return formData.apiKey.trim() !== '' &&
      formData.systemPrompt.trim() !== '' &&
      formData.userPrompt.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">LLM Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-[700px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Input Form</h2>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
              {/* API Key */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  id="apiKey"
                  type="text"
                  maxLength={100}
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your OpenAI API key"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <div className="flex flex-wrap gap-4">
                  {(['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'] as const).map((model) => (
                    <label key={model} className="flex items-center">
                      <input
                        type="radio"
                        name="model"
                        value={model}
                        checked={formData.model === model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{model}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt *
                </label>
                <textarea
                  id="systemPrompt"
                  maxLength={1000}
                  rows={4}
                  value={formData.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Enter system prompt..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.systemPrompt.length}/1000 characters
                </div>
              </div>

              {/* User Prompt */}
              <div>
                <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  User Prompt *
                </label>
                <textarea
                  id="userPrompt"
                  maxLength={1000}
                  rows={4}
                  value={formData.userPrompt}
                  onChange={(e) => handleInputChange('userPrompt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Enter user prompt..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.userPrompt.length}/1000 characters
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature * ({formData.temperature})
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">0</span>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-500">2</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                  className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Response Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Format *</label>
                <div className="flex flex-wrap gap-4">
                  {(['text', 'json_object'] as const).map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="responseFormat"
                        value={format}
                        checked={formData.responseFormat === format}
                        onChange={(e) => handleInputChange('responseFormat', e.target.value)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-[700px] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Output</h2>

            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Calling LLM...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {output && !isLoading && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {output}
                  </pre>
                </div>
              )}

              {!output && !isLoading && !error && (
                <div className="text-center text-gray-500 mt-20">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="mt-2">Submit the form to see LLM response here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}