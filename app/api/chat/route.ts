import { StreamingTextResponse } from 'ai';
import { ChatMessage, MessageContent, OpenAI } from 'llamaindex';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { createChatEngine } from './engine';
import { LlamaIndexStream } from './llamaindex-stream';
  
// vercel AI SDK sets the runtime to edge but llamaindex requires nodejs
// https://ts.llamaindex.ai/getting_started/environments#nextjs-app-router
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// helper handles formatting for text and optional image URL
const convertMessageContent = (
  textMessage: string,
  imageUrl: string | undefined,
): MessageContent => {
  if (!imageUrl) return textMessage;
  return [
    {
      type: "text",
      text: textMessage,
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
  ];
};
 
export async function POST(req: NextRequest) {
  // session token specific to each user
  const token = await getToken({ req });
  
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  try {
    // Check for session token & OpenAI key
    if (token?.tableau) {
      const body = await req.json();
      const { messages, data }: { messages: ChatMessage[]; data: any } = body;
      const userMessage = messages.pop();
      if (!messages || !userMessage || userMessage.role !== "user") {
        return NextResponse.json(
          {
            error:
              "messages are required in the request body and the last message must be from the user",
          },
          { status: 400 },
        );
      }

      const llm = new OpenAI({
        model: (process.env.MODEL as any) ?? "gpt-3.5-turbo",
        maxTokens: 512,
      });

      const chatEngine = await createChatEngine(llm);

      // Convert message content from Vercel/AI format to LlamaIndex/OpenAI format
      const userMessageContent = convertMessageContent(
        userMessage.content,
        data?.imageUrl,
      );

      // Calling LlamaIndex's ChatEngine to get a streamed response
      const response = await chatEngine.chat({
        message: userMessageContent,
        chatHistory: messages,
        stream: true,
      });

      // Transform LlamaIndex stream to Vercel/AI format
      const { stream, data: streamData } = LlamaIndexStream(response, {
        parserOptions: {
          image_url: data?.imageUrl,
        },
      });

      // Return a StreamingTextResponse, which can be consumed by the Vercel/AI client
      return new StreamingTextResponse(stream, {}, streamData);
    } else {
      // unauthorized on account of lack of session token (prevents scripted attacks)
      return NextResponse.json({ error: '401: Unauthorized Session Token' }, { status: 401 });
    }
  } catch (error) {
    console.error("[LlamaIndex]", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
