import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";
import { Button } from "components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "components/ui";


export function UserMenu(props) {
  const { src } = props;
  const avatar = src ? src : 'img/users/mackenzie_day.png';
  const [user, setUser] = useState(undefined);
  // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
  const { status, data } = useSession({ required: false });

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(data.user.name);
    }
  }, [status, data]);

  return (
    <DropdownMenu>
      <Trigger src={avatar} />
      <DropdownMenuContent className="w-56 dark:bg-stone-700 shadow-xl" align="end" forceMount>
        <Label />
        <Group />
        <Logout status={status} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


const Logout = (props) => {
  const { status } = props;

  if (status === 'authenticated') {
    return (
      <DropdownMenuItem>
        <Button
          variant="ghost"
          className="h-min p-1"
          onClick={async () => await signOut('credentials', { redirect: false })}
        >
        Log out
        </Button>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem>
      <Button
        variant="ghost"
        className="h-min p-1"
        onClick={async () => await signIn()}
      >
      Log in
      </Button>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}


const Trigger = (props) => {
  const { src } = props;
  return (
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-12 w-12 rounded-full shadow-xl">
        <Avatar className="h-12 w-12">
          <AvatarImage src={src} alt="user profile picture" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
  )
}


const Label = (props) => {
  return (
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">Superstore Analytics</p>
        <p className="text-xs leading-none text-muted-foreground">
          mday@mail.com
        </p>
      </div>
    </DropdownMenuLabel>
  )
}


const Group = (props) => {
  return (
    <div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </div>
  )
}
