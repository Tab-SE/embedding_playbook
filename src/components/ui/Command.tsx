"use client";
import * as React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "utils";
import { Dialog } from "./Dialog";

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  className?: string;
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

const CommandDialog: React.FC<CommandDialogProps> = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-stone-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 dark:[&_[cmdk-group-heading]]:text-stone-400">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

interface CommandInputProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  className?: string;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-stone-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-stone-400",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

interface CommandListProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  className?: string;
}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

interface CommandEmptyProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

interface CommandGroupProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {
  className?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-stone-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-stone-500 dark:text-stone-50 dark:[&_[cmdk-group-heading]]:text-stone-400",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

interface CommandSeparatorProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> {
  className?: string;
}

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-stone-200 dark:bg-stone-800", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

interface CommandItemProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  className?: string;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-stone-100 aria-selected:text-stone-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-stone-800 dark:aria-selected:text-stone-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const CommandShortcut: React.FC<CommandShortcutProps> = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-stone-500 dark:text-stone-400",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
