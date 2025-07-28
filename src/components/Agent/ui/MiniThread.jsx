"use client";;
import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useMessage
} from "@assistant-ui/react";
import { SendHorizontalIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { TooltipIconButton, MarkdownText } from ".";


export const MiniThread = (props) => {
  const { ai_avatar, user_avatar } = props;

  return (
    (<ThreadPrimitive.Root className="bg-white h-full dark:bg-stone-950">
      <ThreadPrimitive.Viewport
        className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <WelcomeMessage
          ai_avatar={ai_avatar}
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
          <MyComposer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>)
  );
};

const WelcomeMessage = (props) => {
  const { ai_avatar } = props;

  return (
    (<ThreadPrimitive.Empty>
      <div className="flex flex-grow flex-col items-center justify-center">
        <MessageAvatar
          src={ai_avatar}
          alt='AI Avatar'
          fallback='AI'
        />
        <p className="mt-4 font-medium">How can I help you with your analytics?</p>
      </div>
    </ThreadPrimitive.Empty>)
  );
};

const MyComposer = () => {
  return (
    (<ComposerPrimitive.Root
      className="focus-within:border-aui-ring/20 flex w-full flex-wrap items-end rounded-lg border border-stone-200 bg-inherit px-2.5 shadow-sm transition-colors ease-in dark:border-stone-800">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-stone-500 size-full max-h-40 resize-none border-none bg-transparent p-4 pr-12 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-stone-400" />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
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

  // 2. If the message is not complete, show the "thinking" indicator
  if (originalMessage.status?.type !== 'complete') {
    return (
      <div className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4">
        <MessageAvatar src={ai_avatar} alt="AI Avatar" fallback="AI" />
        <div className="text-stone-950 col-start-2 row-start-1 my-1.5 flex max-w-xl items-center dark:text-stone-50">
          <ThinkingIndicator />
        </div>
      </div>
    );
  }

  // DEBUG: Log what messages are coming through (Corrected to use `originalMessage`)
  console.log('MiniThread-AgentMessage received:', {
    role: originalMessage.role,
    content: typeof originalMessage.content === 'string'
      ? originalMessage.content.substring(0, 200) + '...'
      : originalMessage.content,
    contentType: typeof originalMessage.content,
    isArray: Array.isArray(originalMessage.content),
    fullMessage: originalMessage
  });

  // Check the role: Only render if it's an assistant message
  if (originalMessage.role !== 'assistant') {
    return null;
  }

  // 1. Find the last content part that is of type 'text'.
  const lastTextPart = Array.isArray(originalMessage.content)
    ? originalMessage.content.findLast((part) => part.type === 'text')
    : null;
  console.log("Minithread-lasttextpart", lastTextPart)
  // 2. If we didn't find a valid text part, don't render anything.
  if (!lastTextPart) {
    return null;
  }

  // 3. Create a new message object containing only the final text part.
  const displayMessage = {
    ...originalMessage,
    content: [lastTextPart],
  };

  return (
    // 4. Pass the modified `displayMessage` to the primitive root.
    <MessagePrimitive.Root
      message={displayMessage}
      className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-4"
    >
      <MessageAvatar src={ai_avatar} alt="AI Avatar" fallback="AI" />
      <div className="text-stone-950 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7 dark:text-stone-50">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
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
