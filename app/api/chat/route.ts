import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
    apiKey: string;
    model: string;
    messages: {
        role: 'system' | 'user';
        content: string;
    }[];
    response_format?: {
        type: 'text' | 'json_object';
    };
    temperature: number;
    max_completion_tokens: number;
}

// Strategy Pattern: LLM Provider Interface
abstract class LLMProvider {
    abstract canHandle(model: string): boolean;
    abstract makeRequest(request: ChatRequest): Promise<Response>;
}

// Concrete Strategy: Claude Provider
class ClaudeProvider extends LLMProvider {
    canHandle(model: string): boolean {
        return model.startsWith('claude-');
    }

    async makeRequest(request: ChatRequest): Promise<Response> {
        const requestBody = {
            model: request.model,
            max_tokens: request.max_completion_tokens,
            temperature: request.temperature,
            messages: request.messages.filter(msg => msg.role === 'user'),
            system: request.messages.find(msg => msg.role === 'system')?.content || 'You are a helpful assistant.',
        };

        return fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': request.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(requestBody),
        });
    }
}

// Concrete Strategy: Deepseek Provider
class DeepseekProvider extends LLMProvider {
    canHandle(model: string): boolean {
        return model.startsWith('deepseek-');
    }

    async makeRequest(request: ChatRequest): Promise<Response> {
        const requestBody = {
            model: request.model,
            messages: request.messages,
            temperature: request.temperature,
            max_tokens: request.max_completion_tokens,
            ...(request.response_format && { response_format: request.response_format }),
        };

        return fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${request.apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });
    }
}

// Concrete Strategy: OpenAI Provider (default fallback)
class OpenAIProvider extends LLMProvider {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canHandle(_model: string): boolean {
        // This is the fallback provider, so it handles all models not handled by others
        return true;
    }

    async makeRequest(request: ChatRequest): Promise<Response> {
        const requestBody = {
            model: request.model,
            messages: request.messages,
            temperature: request.temperature,
            max_completion_tokens: request.max_completion_tokens,
            ...(request.response_format && { response_format: request.response_format }),
        };

        return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${request.apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });
    }
}

// Provider Factory/Registry
class LLMProviderFactory {
    private static providers: LLMProvider[] = [
        new ClaudeProvider(),
        new DeepseekProvider(),
        new OpenAIProvider(), // Keep as last (fallback)
    ];

    static getProvider(model: string): LLMProvider {
        const provider = this.providers.find(p => p.canHandle(model));
        if (!provider) {
            throw new Error(`No provider found for model: ${model}`);
        }
        return provider;
    }

    // Method to register new providers dynamically
    static registerProvider(provider: LLMProvider): void {
        // Insert before the fallback OpenAI provider
        this.providers.splice(-1, 0, provider);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();

        // Validate required fields
        if (!body.apiKey || !body.model || !body.messages || body.temperature === undefined || body.max_completion_tokens === undefined) {
            return NextResponse.json(
                { error: { message: 'Missing required fields' } },
                { status: 400 }
            );
        }

        // Use Strategy Pattern to get the appropriate provider
        const provider = LLMProviderFactory.getProvider(body.model);
        const response = await provider.makeRequest(body);

        if (!response.ok) {
            let errorData;
            try {
                const responseText = await response.text();
                // Try to parse as JSON first
                try {
                    errorData = JSON.parse(responseText);
                } catch {
                    // If it's not JSON, it might be an HTML error page
                    console.error('Non-JSON error response:', responseText);
                    errorData = { 
                        error: { 
                            message: `HTTP ${response.status}: ${response.statusText}`,
                            details: responseText.includes('<!DOCTYPE') ? 'Received HTML error page instead of JSON' : responseText.substring(0, 200)
                        } 
                    };
                }
            } catch (textError) {
                console.error('Failed to read error response:', textError);
                errorData = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
            }
            
            return NextResponse.json(
                { error: errorData.error || { message: `HTTP ${response.status}: ${response.statusText}` } },
                { status: response.status }
            );
        }

        let data;
        try {
            const responseText = await response.text();
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse successful response as JSON:', parseError);
            return NextResponse.json(
                { error: { message: 'Invalid JSON response from LLM provider' } },
                { status: 502 }
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
