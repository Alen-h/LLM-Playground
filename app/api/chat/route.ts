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

const isClaudeModel = (model: string): boolean => {
    return model.startsWith('claude-');
};

const isDeepseekModel = (model: string): boolean => {
    return model.startsWith('deepseek-');
};

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

        let response: Response;

        if (isClaudeModel(body.model)) {
            // Handle Claude API call
            const claudeRequestBody = {
                model: body.model,
                max_tokens: body.max_completion_tokens,
                temperature: body.temperature,
                messages: body.messages.filter(msg => msg.role === 'user'), // Only user messages for Claude
                system: body.messages.find(msg => msg.role === 'system')?.content || 'You are a helpful assistant.',
            };

            response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': body.apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify(claudeRequestBody),
            });
        } else if (isDeepseekModel(body.model)) {
            // Handle Deepseek API call
            const deepseekRequestBody = {
                model: body.model,
                messages: body.messages,
                temperature: body.temperature,
                max_tokens: body.max_completion_tokens,
                ...(body.response_format && { response_format: body.response_format }),
            };

            response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${body.apiKey}`,
                },
                body: JSON.stringify(deepseekRequestBody),
            });
        } else {
            // Handle OpenAI API call
            const openAIRequestBody = {
                model: body.model,
                messages: body.messages,
                temperature: body.temperature,
                max_completion_tokens: body.max_completion_tokens,
                ...(body.response_format && { response_format: body.response_format }),
            };

            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${body.apiKey}`,
                },
                body: JSON.stringify(openAIRequestBody),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error || { message: `HTTP ${response.status}: ${response.statusText}` } },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}
