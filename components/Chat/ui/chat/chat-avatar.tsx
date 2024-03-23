import { IconUser } from '@tabler/icons-react';
import Image from "next/image";

export default function ChatAvatar({ role }: { role: string }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <IconUser className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border text-white shadow">
      <Image
        className="rounded-md"
        src="svg/logo_color.svg"
        alt="AI profile picture"
        width={24}
        height={24}
        priority
      />
    </div>
  );
}
