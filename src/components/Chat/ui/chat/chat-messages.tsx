"use client";
import { IconLoader } from '@tabler/icons-react';
import { useEffect, useRef } from "react";

import { Button } from "../button";
import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";

export default function ChatMessages(
  props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop"> & {
    questionCount?: number;
    maxQuestions?: number;
    onNewChat?: () => void;
  },
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  const showQuestionCounter = props.questionCount !== undefined && props.maxQuestions !== undefined;
  const hasReachedLimit = showQuestionCounter && props.questionCount! >= props.maxQuestions!;

  // Only show banner if limit reached AND last message is from assistant (answer complete)
  const showLimitBanner = hasReachedLimit && isLastMessageFromAssistant;

  return (
    <div className="w-full rounded-xl bg-white dark:bg-stone-800 p-4 shadow-xl pb-0">
      <div
        className="flex h-[50vh] flex-col gap-5 divide-y overflow-y-auto pb-4"
        ref={scrollableChatContainerRef}
      >
        {props.messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <IconLoader className="h-4 w-4 icon-rotate" />
          </div>
        )}
        {showLimitBanner && (
          <div className="flex flex-col items-center justify-center pt-6 gap-3 text-center">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              You've reached the maximum of {props.maxQuestions} questions per conversation.
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              Start a new chat to continue asking questions.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          {showQuestionCounter && (
            <span className="text-sm text-stone-600 dark:text-stone-400">
              Questions: {props.questionCount}/{props.maxQuestions}
            </span>
          )}
          {props.onNewChat && props.messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onNewChat}
              className="h-8"
            >
              New Chat
            </Button>
          )}
        </div>
        <ChatActions
          reload={props.reload}
          stop={props.stop}
          showReload={showReload}
          showStop={showStop}
        />
      </div>
    </div>
  );
}
