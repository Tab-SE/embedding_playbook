"use client";;
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { forwardRef } from "react";
import { AssistantModalPrimitive } from "@assistant-ui/react";

import { MiniThread, TooltipIconButton } from "./ui";

export const FloatingAssistant = () => {
  return (
    (<AssistantModalPrimitive.Root>
      <AssistantModalPrimitive.Anchor className="fixed bottom-4 right-4 size-11">
        <AssistantModalPrimitive.Trigger asChild>
          <FloatingAssistantButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>
      <AssistantModalPrimitive.Content
        sideOffset={16}
        className="bg-white text-stone-950 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out data-[state=open]:zoom-in data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 z-50 h-[500px] w-[400px] overflow-clip rounded-xl border border-stone-200 p-0 shadow-md outline-none [&>div]:bg-inherit dark:bg-stone-950 dark:text-stone-50 dark:border-stone-800"
      >
        <MiniThread />
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>)
  );
};

const FloatingAssistantButton = forwardRef(({ "data-state": state, ...rest }, ref) => {
  const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";

  return (
    (<TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      className="size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90 text-stone-900 bg-stone-50 hover:bg-stone-200"
      ref={ref}>
      <Image
        src="/img/themes/superstore/superstore.png"
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
