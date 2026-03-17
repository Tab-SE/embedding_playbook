"use client";

import { useChat } from "ai/react";
import { useMemo } from "react";
import { insertDataIntoMessages } from "./transform";
import { ChatInput, ChatMessages } from "./ui/chat";

const MAX_QUESTIONS = 3;

export const Chat = () => {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    data,
    setMessages,
    setInput,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json", // using JSON because of vercel/ai 2.2.26
    },
  });

  const transformedMessages = useMemo(() => {
    return insertDataIntoMessages(messages, data);
  }, [messages, data]);

  // Count user questions
  const questionCount = useMemo(() => {
    return messages.filter((m) => m.role === "user").length;
  }, [messages]);

  const hasReachedLimit = questionCount >= MAX_QUESTIONS;

  // Only disable input if limit reached AND last message is from assistant (answer complete)
  const lastMessage = messages[messages.length - 1];
  const shouldDisable = hasReachedLimit && lastMessage?.role === "assistant";

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="space-y-4 max-w-5xl w-full">
      <ChatMessages
        messages={transformedMessages}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
        questionCount={questionCount}
        maxQuestions={MAX_QUESTIONS}
        onNewChat={handleNewChat}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        multiModal={process.env.AGENT_MODEL === "gpt-4-vision-preview"}
        disabled={shouldDisable}
        hasReachedLimit={shouldDisable}
      />
    </div>
  );
}
