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
          <QuestionLimitBanner />
          <QuestionCounter />
          <MyComposer inputRef={inputRef} />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>)
  );
};

const WelcomeMessage = (props) => {
  const { ai_avatar, sample_questions = [], inputRef } = props;

  const handleQuestionClick = (question) => {
    const inputElement = inputRef.current || document.querySelector('textarea[placeholder="Write a message..."]');

    if (inputElement) {
      // Use the native setter to ensure React detects the change
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(inputElement, question);

      // Dispatch an input event to trigger React's onChange
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);

      // Focus the input
      inputElement.focus();

      // Now the input should recognize the text and allow Enter to send
    }
  };

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
