"use client";

import { MarkdownTextPrimitive, useIsMarkdownCodeBlock } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { TooltipIconButton } from "@/components/ui/assistant-ui/tooltip-icon-button";
import { SyntaxHighlighter } from "@/components/ui/assistant-ui/syntax-highlighter";
import { cn } from "utils";

import "katex/dist/katex.min.css";

const MarkdownTextImpl = () => {
  return (
    (<MarkdownTextPrimitive
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ node, className, ...props }) => (
          <h1
            className={cn(
              "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
              className
            )}
            {...props} />
        ),
        h2: ({ node, className, ...props }) => (
          <h2
            className={cn(
              "mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props} />
        ),
        h3: ({ node, className, ...props }) => (
          <h3
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props} />
        ),
        h4: ({ node, className, ...props }) => (
          <h4
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props} />
        ),
        h5: ({ node, className, ...props }) => (
          <h5
            className={cn("my-4 text-lg font-semibold first:mt-0 last:mb-0", className)}
            {...props} />
        ),
        h6: ({ node, className, ...props }) => (
          <h6
            className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
            {...props} />
        ),
        p: ({ node, className, ...props }) => (
          <p
            className={cn("mb-5 mt-5 leading-7 first:mt-0 last:mb-0", className)}
            {...props} />
        ),
        a: ({ node, className, ...props }) => (
          <a
            target="_blank"
            className={cn(
              "text-stone-900 font-medium underline underline-offset-4 dark:text-stone-50",
              className
            )}
            {...props} />
        ),
        blockquote: ({ node, className, ...props }) => (
          <blockquote className={cn("border-l-2 pl-6 italic", className)} {...props} />
        ),
        ul: ({ node, className, ...props }) => (
          <ul className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
        ),
        ol: ({ node, className, ...props }) => (
          <ol
            className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
            {...props} />
        ),
        hr: ({ node, className, ...props }) => (
          <hr className={cn("my-5 border-b", className)} {...props} />
        ),
        table: ({ node, className, ...props }) => (
          <table
            className={cn("my-5 w-full border-separate border-spacing-0 overflow-y-auto", className)}
            {...props} />
        ),
        th: ({ node, className, ...props }) => (
          <th
            className={cn(
              "bg-stone-100 px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right dark:bg-stone-800",
              className
            )}
            {...props} />
        ),
        td: ({ node, className, ...props }) => (
          <td
            className={cn(
              "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
              className
            )}
            {...props} />
        ),
        tr: ({ node, className, ...props }) => (
          <tr
            className={cn(
              "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
              className
            )}
            {...props} />
        ),
        sup: ({ node, className, ...props }) => (
          <sup className={cn("[&>a]:text-xs [&>a]:no-underline", className)} {...props} />
        ),
        pre: ({ node, className, ...props }) => (
          <pre
            className={cn("overflow-x-auto rounded-b-lg bg-black p-4 text-white", className)}
            {...props} />
        ),
        code: function Code({ node, className, ...props }) {
          const isCodeBlock = useIsMarkdownCodeBlock();
          return (
            (<code
              className={cn(
                !isCodeBlock && "bg-aui-muted rounded border border-stone-200 font-semibold dark:border-stone-800",
                className
              )}
              {...props} />)
          );
        },
        CodeHeader,
        SyntaxHighlighter,
      }} />)
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    (<div
      className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>)
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000
} = {}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};
