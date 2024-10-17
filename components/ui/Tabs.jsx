import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-stone-100 p-1 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  borderRadius: "0.375rem", // rounded-md
  padding: "0.25rem 0.75rem", // px-3 py-1
  fontSize: "0.875rem", // text-sm
  fontWeight: 500, // font-medium
  backgroundColor: "#0F8500", // initial background color
  color: "white", // text color
  margin: "2px",
  transition: "all 0.2s", // transition-all
  outline: "none",
  ring: "2px solid transparent", // focus-visible:ring-2
  boxShadow: "none", // focus-visible:ring-offset-2
  pointerEvents: "auto", // disabled:pointer-events-none
  opacity: 1, // disabled:opacity-50
};

// Function to get button styles based on focus state
const getButtonStyles = (isFocused) => ({
  ...buttonStyle,
  backgroundColor: isFocused ? "white" : buttonStyle.backgroundColor, // change background on focus
  color: isFocused ? "#0F8500" : buttonStyle.color, // change text color on focus
  boxShadow: isFocused ? "0 0 0 1px #ECECEC" : buttonStyle.boxShadow, // add focus ring
});

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      style={getButtonStyles(isFocused)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };