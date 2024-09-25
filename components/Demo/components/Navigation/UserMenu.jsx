import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

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

import { settings } from '../../settings';


export function UserMenu(props) {
  const { activeUser } = props;
  const avatar = activeUser ? activeUser : '/img/users/mackenzie_day.png';
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
        <Label app_name={''} email={''} />
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
      <DropdownMenuItem
        className='hover:cursor-pointer'
        onClick={async () => await signOut('credentials', { redirect: false })}
      >
        <Button
          variant="ghost"
          className="h-min p-1"
        >
        Log out
        </Button>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem
      className='hover:cursor-pointer'
      onClick={async () => await signIn()}
    >
      <Button
        variant="ghost"
        className="h-min p-1"
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
        <Avatar className="h-12 w-12 shadow-xl">
          <AvatarImage src={src} alt="user profile picture" />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
  )
}


const Label = (props) => {
  const { app_name, email } = props;

  return (
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{app_name}</p>
        <p className="text-xs leading-none text-muted-foreground">{email}</p>
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
          Billing
          <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <Link href="/demos/superstore/settings">
          <DropdownMenuItem className='hover:cursor-pointer'>
            Settings
            <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </div>
  )
}
