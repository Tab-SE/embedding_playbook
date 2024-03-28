import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "./codeblock";

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode | null | undefined;
}

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className,
);

export default function Markdown({ content }: { content: string }) {
  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }: { children: React.ReactNode }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        code({ node, inline, className, children, ...props }: CodeProps & { children: React.ReactNode }) {
          children = children || ''; // Ensure children is treated as a string
          if (typeof children === 'string') {
            if (children.length > 0) { // Check length only if children is a string
              if (children[0] == "▍") {
                return (
                  <span className="mt-1 animate-pulse cursor-default">▍</span>
                );
              }

              children = children.replace("`▍`", "▍");
            }
          }

          const match = /language-(\w+)/.exec(className || "");

          // remove leading and trailing newline characters
          const codeValue = String(children).replace(/^\n+|\n+$/g, "");

          if (inline) {
            return (
              <div className="block">
                <code className={className} {...props}>
                  {codeValue}
                </code>
              </div>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={codeValue}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
}
