"use client";
import { useState, forwardRef } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { useTableauSession } from '@/hooks';
import { MiniThread, TooltipIconButton } from "./ui";

export const FloatingAssistant = (props) => {
  const { ai_avatar, demo } = props;
  const [isOpen, setIsOpen] = useState(false);

  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  return (
    (<AssistantModalPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <AssistantModalPrimitive.Anchor className="fixed bottom-4 right-4 size-11">
        <AssistantModalPrimitive.Trigger asChild>
          <FloatingAssistantButton ai_avatar={ai_avatar} />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>
      <AssistantModalPrimitive.Content
        sideOffset={16}
        className="bg-white text-stone-950 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out data-[state=open]:zoom-in data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 z-50 h-[500px] 2xl:h-[570px] w-screen sm:w-[600px] xl:w-[750px] 2xl:w-[840px] overflow-clip rounded-xl border border-stone-200 p-0 shadow-md outline-none [&>div]:bg-inherit dark:bg-stone-950 dark:text-stone-50 dark:border-stone-800"
      >
        { isSessionError ? <p>Authentication Error!</p> : null }
        { isSessionLoading ? <p>Authenticating the User...</p> : null }
        { isSessionSuccess ?
          <MiniThread
            ai_avatar={ai_avatar}
            user_avatar={user.picture}
          /> : null
        }
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>)
  );
};

const FloatingAssistantButton = forwardRef(({ ai_avatar, "data-state": state, ...rest }, ref) => {
  const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";

  return (
    (<TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      className="size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90 text-stone-900 bg-stone-50 hover:bg-stone-200"
      ref={ref}
      >
      <Image
        src={ai_avatar}
        alt="Assistant"
        width={24}
        height={24}
        data-state={state}
        className="absolute inset-0 m-auto transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
      />
      <ChevronDownIcon
        data-state={state}
        className="absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
      />
      <span className="sr-only">{tooltip}</span>
    </TooltipIconButton>)
  );
});

FloatingAssistantButton.displayName = "FloatingAssistantButton";
