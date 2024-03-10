import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : undefined,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req: NextRequest) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const { messages } = await req.json();
    
    if (openai.apiKey !== undefined || (openai.apiKey as string).length > 0) {
      // Ask OpenAI for a streaming chat completion given the prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages,
      });
    
      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);
      // Respond with the stream if session token and OpenAI key are available
      return new StreamingTextResponse(stream);
    } else {
      // unauthorized on account of lack of OpenAI key
      return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
    }
  } else {
    // unauthorized on account of lack of session token (prevents scripted attacks)
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}
