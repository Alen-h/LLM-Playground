import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
    apiKey: string;
    model: string;
    messages: {
        role: 'system' | 'user';
        content: string;
    }[];
    response_format: {
        type: 'text' | 'json_object';
    };
    temperature: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();

        // Validate required fields
        if (!body.apiKey || !body.model || !body.messages || body.temperature === undefined) {
            return NextResponse.json(
                { error: { message: 'Missing required fields' } },
                { status: 400 }
            );
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${body.apiKey}`,
            },
            body: JSON.stringify({
                model: body.model,
                messages: body.messages,
                response_format: body.response_format,
                temperature: body.temperature,
            }),
        });

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
