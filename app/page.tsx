'use client';

import { useState, useEffect, useRef } from 'react';

interface FormData {
  apiKey: string;
  model: 'gpt-4.1' | 'gpt-4.1-mini' | 'gpt-4.1-nano' | 'claude-opus-4-1-20250805' | 'claude-opus-4-20250514' | 'claude-sonnet-4-20250514' | 'claude-3-7-sonnet-latest' | 'deepseek-chat' | 'deepseek-reasoner';
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  responseFormat: 'text' | 'json_object';
  maxTokens: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface ClaudeResponse {
  content: {
    text: string;
  }[];
}

type ApiResponse = OpenAIResponse | ClaudeResponse;

interface StoredApiKey {
  id: string;
  key: string;
  createdAt: number;
}

// Model provider structure for cascader
const modelProviders = {
  'OpenAI': ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'],
  'Anthropic': ['claude-opus-4-1-20250805', 'claude-opus-4-20250514', 'claude-sonnet-4-20250514', 'claude-3-7-sonnet-latest'],
  'Deepseek': ['deepseek-chat', 'deepseek-reasoner']
} as const;

const defaultValues: FormData = {
  apiKey: '',
  model: 'gpt-4.1',
  systemPrompt: 'You are a helpful assistant.',
  userPrompt: 'Hello!',
  temperature: 1,
  responseFormat: 'text',
  maxTokens: 2048,
};

const isClaudeModel = (model: string): boolean => {
  return model.startsWith('claude-');
};

// Helper functions for API key management
const getStoredApiKeys = (): StoredApiKey[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('llm-playground-api-keys');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredApiKeys = (keys: StoredApiKey[]): void => {
  localStorage.setItem('llm-playground-api-keys', JSON.stringify(keys));
};

const addApiKey = (key: string): void => {
  const existing = getStoredApiKeys();
  // Check if key already exists
  if (existing.some(stored => stored.key === key)) return;
  
  const newKey: StoredApiKey = {
    id: Date.now().toString(),
    key,
    createdAt: Date.now()
  };
  
  const updated = [newKey, ...existing];
  saveStoredApiKeys(updated);
};

const deleteApiKey = (id: string): void => {
  const existing = getStoredApiKeys();
  const updated = existing.filter(key => key.id !== id);
  saveStoredApiKeys(updated);
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [storedApiKeys, setStoredApiKeys] = useState<StoredApiKey[]>([]);
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [showModelCascader, setShowModelCascader] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const apiKeyInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cascaderRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  // Load stored API keys and migrate old API key if exists (only on mount)
  useEffect(() => {
    const keys = getStoredApiKeys();
    setStoredApiKeys(keys);
    
    // Migrate old single API key to new system
    const oldApiKey = localStorage.getItem('llm-playground-api-key');
    if (oldApiKey && !keys.some(k => k.key === oldApiKey)) {
      addApiKey(oldApiKey);
      const updatedKeys = getStoredApiKeys();
      setStoredApiKeys(updatedKeys);
      localStorage.removeItem('llm-playground-api-key');
      // Set the migrated key as current if no key is set
      if (!formData.apiKey) {
        setFormData(prev => ({ ...prev, apiKey: oldApiKey }));
      }
    }
    // No longer auto-set first stored key - keep field empty by default
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Intentionally empty dependency array - we only want this to run once on mount

  // Handle click outside dropdown, cascader, and tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          apiKeyInputRef.current && !apiKeyInputRef.current.contains(event.target as Node)) {
        setShowApiKeyDropdown(false);
      }
      
      if (cascaderRef.current && !cascaderRef.current.contains(event.target as Node)) {
        setShowModelCascader(false);
        setSelectedProvider(null);
      }

      // Tooltip is now hover-only, so no need to handle click outside
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to get provider for a model
  const getProviderForModel = (model: string): string | null => {
    for (const [provider, models] of Object.entries(modelProviders)) {
      if ((models as readonly string[]).includes(model)) {
        return provider;
      }
    }
    return null;
  };



  // Handle model cascader interactions
  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleModelSelect = (model: string) => {
    handleInputChange('model', model);
    setShowModelCascader(false);
    setSelectedProvider(null);
  };

  const handleApiKeySelect = (apiKey: StoredApiKey) => {
    setFormData(prev => ({ ...prev, apiKey: apiKey.key }));
    setShowApiKeyDropdown(false);
  };

  const handleDeleteApiKey = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteApiKey(id);
    const updatedKeys = getStoredApiKeys();
    setStoredApiKeys(updatedKeys);
    
    // If we deleted the currently selected key, clear it
    const currentKey = formData.apiKey;
    if (!updatedKeys.some(key => key.key === currentKey)) {
      setFormData(prev => ({ ...prev, apiKey: '' }));
    }
  };

  const handleApiKeyInputFocus = () => {
    const keys = getStoredApiKeys();
    setStoredApiKeys(keys);
    if (keys.length > 0) {
      setShowApiKeyDropdown(true);
    }
  };

  const handleApiKeyInputChange = (value: string) => {
    handleInputChange('apiKey', value);
    setShowApiKeyDropdown(false);
  };

  const handleTooltipShow = () => {
    if (tooltipButtonRef.current) {
      const rect = tooltipButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the text
        left: rect.left + rect.width + 8, // Position to the right of the text
      });
    }
    setShowTooltip(true);
  };

  const handleTooltipHide = () => {
    setShowTooltip(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    // Save API key to stored keys if it's not already stored
    if (formData.apiKey.trim()) {
      addApiKey(formData.apiKey.trim());
      setStoredApiKeys(getStoredApiKeys());
    }

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
            ...(isClaudeModel(formData.model) ? {} : { response_format: { type: formData.responseFormat } }),
            temperature: formData.temperature,
            max_completion_tokens: formData.maxTokens,
          }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      // Handle different response formats
      if ('choices' in data) {
        // OpenAI response
        setOutput(data.choices[0].message.content);
      } else {
        // Claude response
        setOutput(data.content[0].text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...defaultValues, apiKey: '' });
    setOutput('');
    setError('');
    setShowApiKeyDropdown(false);
    setShowModelCascader(false);
    setSelectedProvider(null);
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
              <div className="relative">
                <div className="flex items-center mb-2">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                    API Key *
                  </label>
                  <span
                    ref={tooltipButtonRef}
                    onMouseEnter={handleTooltipShow}
                    onMouseLeave={handleTooltipHide}
                    className="ml-2 text-xs text-green-600 cursor-help"
                  >
                    🔒 Your API key is secure!
                  </span>
                </div>
                <div className="relative">
                  <input
                    ref={apiKeyInputRef}
                    id="apiKey"
                    name="apiKey"
                    type="text"
                    maxLength={200}
                    value={formData.apiKey}
                    onChange={(e) => handleApiKeyInputChange(e.target.value)}
                    onFocus={handleApiKeyInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter your API key (OpenAI, Anthropic, or Deepseek)"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  {storedApiKeys.length > 0 && (
                    <button
                      type="button"
                      onClick={handleApiKeyInputFocus}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Dropdown for stored API keys */}
                {showApiKeyDropdown && storedApiKeys.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {storedApiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer group"
                        onClick={() => handleApiKeySelect(apiKey)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 truncate font-mono">{apiKey.key}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteApiKey(e, apiKey.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Model Cascader */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between"
                  onClick={() => setShowModelCascader(!showModelCascader)}
                >
                  <span className="text-sm text-gray-700">
                    {getProviderForModel(formData.model)} {'>'}  {formData.model}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${showModelCascader ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Cascader Dropdown */}
                {showModelCascader && (
                  <div
                    ref={cascaderRef}
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                  >
                    <div className="flex">
                      {/* Provider Column */}
                      <div className="w-1/2 border-r border-gray-200">
                        {Object.keys(modelProviders).map((provider) => (
                          <div
                            key={provider}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                              selectedProvider === provider ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                            onClick={() => handleProviderSelect(provider)}
                          >
                            <span className="text-sm font-medium">{provider}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        ))}
                      </div>

                      {/* Model Column */}
                      <div className="w-1/2 max-h-60 overflow-y-auto">
                        {selectedProvider ? (
                          modelProviders[selectedProvider as keyof typeof modelProviders].map((model) => (
                            <div
                              key={model}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                                formData.model === model ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                              onClick={() => handleModelSelect(model)}
                            >
                              <span className="text-sm">{model}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 italic">
                            Select a provider
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                  style={{ height: '96px' }}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                  style={{ height: '96px' }}
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
              </div>

              {/* Response Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Format * 
                  {isClaudeModel(formData.model) && (
                    <span className="text-xs text-gray-500 ml-2">(Not supported for Claude models)</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-4">
                  {(['text', 'json_object'] as const).map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="responseFormat"
                        value={format}
                        checked={formData.responseFormat === format}
                        onChange={(e) => handleInputChange('responseFormat', e.target.value)}
                        disabled={isClaudeModel(formData.model)}
                        className="mr-2 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className={`text-sm ${isClaudeModel(formData.model) ? 'text-gray-400' : 'text-gray-700'}`}>
                        {format}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens * ({formData.maxTokens})
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    id="maxTokens"
                    type="range"
                    min="1"
                    max="4096"
                    step="1"
                    value={formData.maxTokens}
                    onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-500">4096</span>
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

      {/* Tooltip Portal - renders outside main content to avoid z-index issues */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-md shadow-xl"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="relative">
            <p className="font-medium">🔒 Your API key is secure!</p>
            <p className="mt-2">
              We do not store your API key on our servers or database. 
              It is only saved locally in your browser&apos;s storage and never transmitted to us.
            </p>
            <p className="mt-2 text-gray-300">
              This ensures your API key remains private and under your control.
            </p>
            {/* Tooltip arrow pointing left */}
            <div className="absolute top-3 -left-1">
              <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}