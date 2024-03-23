import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";

export default function ChatAvatar({ role }) {
  if (role === "user") {
    return (
      <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-background shadow-xl">
        <Avatar className='h-9 w-9'>
          <AvatarImage src="img/users/mackenzie_day.png" alt="Demo User" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-md border text-white shadow-xl">
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
