"use client";

import React, { useContext } from 'react';

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
import { AuthenticatedUserContext } from 'context';


export function UserMenu(props) {
  const { app_name } = props;

  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthenticatedUserContext);
  const { user_id, demo } =  authenticatedUser;

  // tanstack query hook to manage embed sessions
  const {
    status,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession(user_id, demo);

  if (isSessionError) {
    console.debug('Session Error:', sessionError);
  }

  return (
    <div>
      {isSessionSuccess ?
        <DropdownMenu>
          <Trigger src={user.picture} />
          <DropdownMenuContent className="w-56 dark:bg-stone-700 shadow-xl" align="end" forceMount>
            <Label app_name={app_name} email={user.email} />
            <Group />
            <Logout status={status} />
          </DropdownMenuContent>
        </DropdownMenu>
    : null}
    {isSessionError ?
        <DropdownMenu>
          <Trigger src='' />
          <DropdownMenuContent className="w-56 dark:bg-stone-700 shadow-xl" align="end" forceMount>
            <Label app_name={app_name} email='' />
            <Group />
            <Logout status={status} />
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
