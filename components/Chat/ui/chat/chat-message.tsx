import { IconCheck, IconCopy } from '@tabler/icons-react';
import { JSONValue, Message } from "ai";
import Image from "next/image";
import { Button } from "../button";
import ChatAvatar from "./chat-avatar";
import Markdown from "./markdown";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

interface ChatMessageImageData {
  type: "image_url";
  image_url: {
    url: string;
  };
}

// This component will parse message data and render the appropriate UI.
function ChatMessageData({ messageData }: { messageData: JSONValue }) {
  const { image_url, type } = messageData as unknown as ChatMessageImageData;
  if (type === "image_url") {
    return (
      <div className="rounded-md max-w-[200px] shadow-md">
        <Image
          src={image_url.url}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt=""
        />
      </div>
    );
  }
  return null;
}

export default function ChatMessage(chatMessage: Message) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  return (
    <div className="flex items-start gap-4 pr-5 pt-5">
      <ChatAvatar role={chatMessage.role} />
      <div className="group flex flex-1 justify-between gap-2">
        <div className="flex-1 space-y-4">
          {chatMessage.data && (
            <ChatMessageData messageData={chatMessage.data} />
          )}
          <Markdown content={chatMessage.content} />
        </div>
        <Button
          onClick={() => copyToClipboard(chatMessage.content)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
        >
          {isCopied ? (
            <IconCheck className="h-4 w-4" />
          ) : (
            <IconCopy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}