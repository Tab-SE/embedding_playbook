"use client";;
import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useMessage
} from "@assistant-ui/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  ArrowDownIcon,
  AudioLinesIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  StopCircleIcon,
} from "lucide-react";
import { MarkdownText, TooltipIconButton } from "./ui";
import { cn } from "utils";


export const Thread = (props) => {
  const { ai_avatar, user_avatar, sample_questions = [] } = props;

  return (
    (<ThreadPrimitive.Root className="bg-white h-full dark:bg-stone-950">
      <ThreadPrimitive.Viewport
        className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-3">
        <MyThreadWelcome
          ai_avatar={ai_avatar}
          sample_questions={sample_questions}
        />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: (messageProps) => <DemoUserMessage {...messageProps} user_avatar={user_avatar} />,
            EditComposer: MyEditComposer,
            AssistantMessage: (messageProps) => <AgentMessage {...messageProps} ai_avatar={ai_avatar} />
            // Note: If you had a specific component for 'ToolMessage', it would be called for role='tool'.
            // Since you don't, the primitive might try AssistantMessage or UserMessage depending on its internal logic,
            // but our added checks inside them will prevent rendering.
          }}
        />

        <div className="min-h-8 flex-grow" />

        <div
          className="sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <MyThreadScrollToBottom />
          <MyComposer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>)
  );
};

const MyThreadScrollToBottom = () => {
  return (
    (<ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible">
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>)
  );
};

const MyThreadWelcome = (props) => {
  const { ai_avatar, sample_questions = [] } = props;

  const handleQuestionClick = (question) => {
    // Find the input field and set its value
    const inputElement = document.querySelector('textarea[placeholder="Write a message..."]');
    if (inputElement) {
      // Set the value
      inputElement.value = question;
      
      // Trigger input event to update the state
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
      
      // Find and click the send button
      const sendButton = document.querySelector('button[aria-label="Send"], button[title="Send"]');
      if (sendButton) {
        sendButton.click();
      }
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

const MyComposer = () => {
  return (
    (<ComposerPrimitive.Root
      className="focus-within:border-aui-ring/20 flex w-full flex-wrap items-end rounded-lg border border-stone-200 bg-inherit px-2.5 shadow-sm transition-colors ease-in dark:border-stone-800">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-stone-500 max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-stone-400" />
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in">
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in">
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>)
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

const DemoUserMessage = (props) => {
  const { user_avatar } = props;

  // Access the specific message data for this instance
  const message  = useMessage();

  // Check the role: Only render if it's a user message
  if (message.role !== 'user') {
    return null; // Render nothing if it's not a user message
  }

  return (
    (<MessagePrimitive.Root
      className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <MyUserActionBar />
      <MessageAvatar
        src={user_avatar}
        alt='Demo User Avatar'
        fallback='USER'
      />
      <div
        className="bg-stone-100 text-stone-950 col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5 dark:bg-stone-800 dark:text-stone-50">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
      <MyBranchPicker className="col-span-full col-start-1 row-start-2 -mr-1 justify-end" />
    </MessagePrimitive.Root>)
  );
};

const MyUserActionBar = () => {
  return (
    (<ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 mr-3 mt-2.5 flex flex-col items-end">
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>)
  );
};

const MyEditComposer = () => {
  return (
    (<ComposerPrimitive.Root
      className="bg-stone-100 my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl dark:bg-stone-800">
      <ComposerPrimitive.Input
        className="text-stone-950 flex h-8 w-full resize-none border-none bg-transparent p-4 pb-0 outline-none focus:ring-0 dark:text-stone-50" />
      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>)
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
        part.text.length > 100 // Only substantial responses
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
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
};

const MyAssistantActionBar = () => {
  return (
    (<ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-stone-500 data-[floating]:bg-white col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm dark:text-stone-400 dark:data-[floating]:bg-stone-950">
      <MessagePrimitive.If speaking={false}>
        <ActionBarPrimitive.Speak asChild>
          <TooltipIconButton tooltip="Read aloud">
            <AudioLinesIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.Speak>
      </MessagePrimitive.If>
      <MessagePrimitive.If speaking>
        <ActionBarPrimitive.StopSpeaking asChild>
          <TooltipIconButton tooltip="Stop">
            <StopCircleIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.StopSpeaking>
      </MessagePrimitive.If>
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>)
  );
};

const MyBranchPicker = ({
  className,
  ...rest
}) => {
  return (
    (<BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-stone-500 inline-flex items-center text-xs dark:text-stone-400",
        className
      )}
      {...rest}>
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>)
  );
};

const CircleStopIcon = () => {
  return (
    (<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 16"
      fill="currentColor"
      width="16"
      height="16">
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>)
  );
};
