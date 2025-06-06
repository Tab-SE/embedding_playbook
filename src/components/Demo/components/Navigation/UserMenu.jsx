"use client";

import { signIn, signOut } from "next-auth/react";
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

import { useTableauSession } from 'hooks';


export function UserMenu(props) {
  const { app_name, base_path } = props;

  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  if (isSessionError) {
    console.debug('Session Error:', sessionError);
  }

  return (
    <div className="pr-6">
      {isSessionError || isSessionLoading ?
          <DropdownMenu>
            <Trigger src='' />
            <DropdownMenuContent className="w-56 dark:bg-stone-700 shadow-xl" align="end" forceMount>
              <Label app_name={app_name} email='' />
              <Group />
              <Logout status={sessionStatus} />
            </DropdownMenuContent>
          </DropdownMenu>
      : null}
      {isSessionSuccess ?
        <DropdownMenu>
          <Trigger src={user.picture} />
          <DropdownMenuContent className="w-56 dark:bg-stone-700 shadow-xl" align="end" forceMount>
            <Label app_name={app_name} email={user.email} />
            <Group base_path={base_path} />
            <Logout status={sessionStatus} />
          </DropdownMenuContent>
        </DropdownMenu>
      : null}
    </div>
  )
}


const Logout = (props) => {
  const { status } = props;

  if (status === 'success') {
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
  const { base_path } = props;

  return (
    <div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${base_path}/settings`} className='hover:cursor-pointer'>
            Settings
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/demos" className='hover:cursor-pointer'>
            More Demos
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </div>
  )
}
