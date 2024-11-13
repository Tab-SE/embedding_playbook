import { Avatar, AvatarFallback, AvatarImage } from 'components/ui';

export default function ChatAvatar({ role }) {
  if (role === 'user') {
    return (
      <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-background shadow-xl">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/img/users/mackenzie_day.png" alt="Demo User" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-background shadow-xl">
      <Avatar className="h-9 w-9">
        <AvatarImage src="/img/tableau/tableau_logo.png" alt="AI User" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    </div>
  );
}
