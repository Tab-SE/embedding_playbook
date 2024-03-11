'use client';
 
import { useChat } from 'ai/react';
import { useSession, signIn } from "next-auth/react";
 
export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
  const { status, data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      const { error, status, ok } = await signIn('demo-user', { redirect: false, ID: 'a' });
    }
  });

  if (status === 'authenticated') {
    return (
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
  
        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    );
  }

  // show nothing unless authenticated
  return null;
}
