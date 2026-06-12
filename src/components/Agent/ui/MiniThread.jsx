"use client";;
import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useMessage,
  useThreadMessages,
} from "@assistant-ui/react";
import { SendHorizontalIcon } from "lucide-react";
import { useRef, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Button } from "@/components/ui";
import { TooltipIconButton, MarkdownText } from ".";
import { MarkdownWithChart } from "./MarkdownWithChart";
import { ProgressIndicator } from "./ProgressIndicator";
import { useChatActions } from "@/components/Providers/LanggraphAgentRuntimeProvider";

const MAX_QUESTIONS = 3;

// Drop a suggested question into the composer input. Uses the native value
// setter so React's controlled <textarea> registers the change, then focuses so
// the user can just hit Enter. Shared by the welcome panel and the persistent
// "Try next" chips.
const fillComposer = (inputRef, question) => {
  const inputElement =
    inputRef?.current || document.querySelector('textarea[placeholder="Write a message..."]');
  if (!inputElement) return;

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  ).set;
  nativeInputValueSetter.call(inputElement, question);
  inputElement.dispatchEvent(new Event('input', { bubbles: true }));
  inputElement.focus();
};

// Plain text of a thread message (assistant-ui stores content as typed parts).
const messageText = (m) =>
  (m?.content ?? [])
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
    .trim()
    .toLowerCase();

export const MiniThread = (props) => {
  const { ai_avatar, user_avatar, sample_questions = [] } = props;
  const inputRef = useRef(null);

  return (
    (<ThreadPrimitive.Root className="bg-white h-full dark:bg-stone-950">
      <ThreadPrimitive.Viewport
        className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <WelcomeMessage
          ai_avatar={ai_avatar}
          sample_questions={sample_questions}
          inputRef={inputRef}
        />

        {/* <ThreadPrimitive.Messages
          components={{
            UserMessage: DemoUserMessage,
            AssistantMessage: AgentMessage,
          }}
        /> */}

        <ThreadPrimitive.Messages
          components={{
            UserMessage: (props) => <DemoUserMessage {...props} user_avatar={user_avatar} />,
            AssistantMessage: (props) => <AgentMessage {...props} ai_avatar={ai_avatar} />
          }}
        />

        <div className="min-h-8 flex-grow" />

        <div
          className="sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ErrorBanner />
          <QuestionLimitBanner />
          <QuestionCounter />
          <NextQuestions sample_questions={sample_questions} inputRef={inputRef} />
          <MyComposer inputRef={inputRef} />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>)
  );
};

const WelcomeMessage = (props) => {
  const { ai_avatar, sample_questions = [], inputRef } = props;

  const handleQuestionClick = (question) => fillComposer(inputRef, question);

  return (
    (<ThreadPrimitive.Empty>
      <div className="flex flex-grow flex-col items-center justify-center">
        <MessageAvatar
          src={ai_avatar}
          alt='AI Avatar'
          fallback='AI'
        />
        <p className="mt-4 font-medium">How can I help you with your analytics?</p>

        {sample_questions.length > 0 && (
          <div className="mt-6 w-full max-w-md">
            <p className="text-sm text-gray-600 mb-3 text-center">Try asking:</p>
            <div className="space-y-2">
              {sample_questions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ThreadPrimitive.Empty>)
  );
};

const QuestionCounter = () => {
  const messages = useThreadMessages();
  const { clearMessages } = useChatActions();

  const questionCount = messages.filter(m => m.role === 'user').length;
  const hasReachedLimit = questionCount >= MAX_QUESTIONS;
  const hasMessages = messages.length > 0;

  const handleNewChat = () => {
    // Clear all messages to start a fresh conversation without closing the modal
    clearMessages();
  };

  if (!hasMessages) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between mb-2 px-2">
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600 dark:text-stone-400">
          Questions: {questionCount}/{MAX_QUESTIONS}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="h-8 text-xs"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

// Surfaces /api/chat errors inside the chat window so users see *something* when
// the agent fails (instead of the spinner just stopping). Maps a few common
// shapes to friendly messages; falls back to error.message for anything else.
const friendlyError = (err) => {
  const raw = err?.message ?? "Something went wrong.";
  // Order matters — check MCP-specific patterns before the generic 401 case,
  // since an MCP 401 isn't the user's NextAuth session expiring.
  if (/tableau-mcp|MCPClientError|streamable HTTP server/i.test(raw)) {
    return "Couldn't authenticate to the Tableau analytics service. Try signing out and back in to refresh your data session.";
  }
  if (/Recursion limit|GRAPH_RECURSION_LIMIT/i.test(raw)) {
    return "I got stuck working on that question. Try rephrasing it or asking something more specific.";
  }
  if (/Failed to fetch|NetworkError|ECONNREFUSED/i.test(raw)) {
    return "Couldn't reach the chat service. Check your connection and try again.";
  }
  if (/401|Unauthorized/i.test(raw)) {
    return "Your session expired. Please refresh the page or sign in again.";
  }
  return raw;
};

const ErrorBanner = () => {
  const { error, dismissError } = useChatActions();
  if (!error) return null;
  return (
    <div className="w-full mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900 dark:text-red-100">
          Something went wrong
        </p>
        <p className="text-sm text-red-800 dark:text-red-200 mt-1">
          {friendlyError(error)}
        </p>
      </div>
      <button
        type="button"
        onClick={dismissError}
        className="text-xs text-red-700 dark:text-red-300 hover:underline shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
};

const QuestionLimitBanner = () => {
  const messages = useThreadMessages();
  const questionCount = messages.filter(m => m.role === 'user').length;
  const hasReachedLimit = questionCount >= MAX_QUESTIONS;

  // Only show the banner if we've reached the limit AND the last message is from assistant AND it's complete
  const lastMessage = messages[messages.length - 1];
  const lastAnswerComplete = lastMessage?.role === 'assistant' && lastMessage?.status?.type === 'complete';

  if (!hasReachedLimit || !lastAnswerComplete) {
    return null;
  }

  return (
    <div className="w-full mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
      <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
        You've reached the maximum of {MAX_QUESTIONS} questions per conversation. Start a new chat to continue.
      </p>
    </div>
  );
};

// Keeps the suggested questions reachable after the first one is asked. The
// welcome panel (with all suggestions) only renders on an empty thread, so once
// a conversation starts these chips surface the remaining not-yet-asked prompts
// just above the composer — naturally pointing to the next one in the scripted
// order. Hidden on an empty thread (welcome panel covers that) and at the limit.
const NextQuestions = (props) => {
  const { sample_questions = [], inputRef } = props;
  const messages = useThreadMessages();

  const questionCount = messages.filter((m) => m.role === 'user').length;
  if (questionCount === 0 || questionCount >= MAX_QUESTIONS) return null;

  // Drop questions already asked (match on the user message text).
  const askedText = messages.filter((m) => m.role === 'user').map(messageText);
  const remaining = sample_questions
    .slice(0, MAX_QUESTIONS)
    .filter((q) => !askedText.includes(q.trim().toLowerCase()));

  if (remaining.length === 0) return null;

  return (
    <div className="w-full mb-2">
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1.5 px-1">Try next:</p>
      <div className="flex flex-wrap gap-2">
        {remaining.map((question, index) => (
          <button
            key={index}
            type="button"
            onClick={() => fillComposer(inputRef, question)}
            className="text-left px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 dark:bg-stone-900 dark:hover:bg-stone-800 rounded-full border border-gray-200 dark:border-stone-700 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

const MyComposer = (props) => {
  const { inputRef } = props;
  const messages = useThreadMessages();

  const questionCount = messages.filter(m => m.role === 'user').length;
  const hasReachedLimit = questionCount >= MAX_QUESTIONS;

  // Only disable input if limit reached AND last message is from assistant AND it's complete
  const lastMessage = messages[messages.length - 1];
  const shouldDisable = hasReachedLimit && lastMessage?.role === 'assistant' && lastMessage?.status?.type === 'complete';

  const placeholder = shouldDisable
    ? "Question limit reached. Start a new chat to continue."
    : "Write a message...";

  return (
    (<ComposerPrimitive.Root
      className="focus-within:border-aui-ring/20 flex w-full flex-wrap items-end rounded-lg border border-stone-200 bg-inherit px-2.5 shadow-sm transition-colors ease-in dark:border-stone-800">
      <ComposerPrimitive.Input
        ref={inputRef}
        autoFocus
        placeholder={placeholder}
        rows={1}
        disabled={shouldDisable}
        className="placeholder:text-stone-500 size-full max-h-40 resize-none border-none bg-transparent p-4 pr-12 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-stone-400" />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          disabled={shouldDisable}
          className="my-2.5 size-8 p-2 transition-opacity ease-in">
          <SendHorizontalIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>)
  );
};

const DemoUserMessage = (props) => {
  const { user_avatar } = props;

  return (
    (<MessagePrimitive.Root
      className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4"
      >
      <MessageAvatar
        src={user_avatar}
        alt='Demo User Avatar'
        fallback='USER'
      />
      <div
        className="bg-stone-100 text-stone-950 col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5 dark:bg-stone-800 dark:text-stone-50">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>)
  );
};
// A simple component for the "thinking" animation (three pulsing dots)
const ThinkingIndicator = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400 delay-0" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400 delay-150" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400 delay-300" />
  </div>
);

const AgentMessage = (props) => {
  const { ai_avatar } = props;
  const { message: originalMessage } = useMessage();

  // If the message is not complete, show the progress indicator
  if (originalMessage.status?.type !== 'complete') {
    return (
      <div className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4">
        <MessageAvatar src={ai_avatar} alt="AI Avatar" fallback="AI" />
        <div className="text-stone-950 col-start-2 row-start-1 my-1.5 w-full dark:text-stone-50">
          <ProgressIndicator />
        </div>
      </div>
    );
  }

  // DEBUG: Log ALL content parts to understand the structure
  console.log('FULL MESSAGE CONTENT ANALYSIS:');
  if (Array.isArray(originalMessage.content)) {
    originalMessage.content.forEach((part, index) => {
      console.log(`Part ${index}:`, {
        type: part.type,
        text: part.type === 'text' ? part.text?.substring(0, 100) + '...' : 'N/A',
        startsWithJSON: part.type === 'text' && part.text?.startsWith('{'),
        length: part.type === 'text' ? part.text?.length : 'N/A',
        fullPart: part
      });
    });
  }

  // Check the role: Only render if it's an assistant message
  if (originalMessage.role !== 'assistant') {
    return null;
  }

  // IMPROVED FILTERING: Get only the final substantial text response
  const filteredTextParts = Array.isArray(originalMessage.content)
    ? originalMessage.content.filter(part =>
        part.type === 'text' &&
        !part.text?.startsWith('{') && // Skip JSON
        part.text &&
        part.text.trim().length > 10 // Minimum 10 characters
      )
    : [];

  console.log('FILTERED PARTS:', filteredTextParts);

  // Get the last substantial text part
  const finalTextPart = filteredTextParts[filteredTextParts.length - 1];

  console.log('FINAL PART TO DISPLAY:', finalTextPart);

  // If no valid text part, don't render
  if (!finalTextPart) {
    console.log('NO VALID TEXT PART FOUND - NOT RENDERING');
    return null;
  }

  // Create display message with only the final part
  const displayMessage = {
    ...originalMessage,
    content: [finalTextPart],
  };

  return (
    <MessagePrimitive.Root
      message={displayMessage}
      className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4"
    >
      <MessageAvatar src={ai_avatar} alt="AI Avatar" fallback="AI" />
      <div className="text-stone-950 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7 dark:text-stone-50">
        <MessagePrimitive.Content components={{ Text: MarkdownWithChart }} />
      </div>
    </MessagePrimitive.Root>
  );
};

const MessageAvatar = (props) => {
  const { src, alt, fallback } = props;

  return (
    <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
