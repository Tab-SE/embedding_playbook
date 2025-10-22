import React, { Fragment } from 'react';
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Separator } from "@/components/ui";

import { UserModel } from "@/models";
import { DemoUser } from "./DemoUser";

export const description = "A login page with a full-screen background image and centered content overlay"

export const Auth = (props) => {
  const { settings } = props;

  const { app_id, base_path, app_name, app_logo, auth_logo, auth_hero } = settings;

  const demoManager = new UserModel();
  const users = demoManager.getUsersForDemo(app_id);
  const roles = demoManager.getAllRolesForDemo(app_id);


  return (
    <div className="relative w-full min-h-screen">

      <div className="absolute inset-0 w-full h-full">
        <Image
          src={auth_hero || "/placeholder.svg"}
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover dark:brightness-[0.2] dark:grayscale background"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full min-h-screen p-4">
        <Card className="mx-auto w-[480px] max-w-full shadow-lg backdrop-blur-sm loginBackground/95">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="flex items-center justify-center h-16 w-16 bg-logoBackground">
                <AvatarImage src={auth_logo || app_logo} className="object-cover rounded-full avatar-container" />
                <AvatarFallback>APP</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-bold">{app_name}</CardTitle>
            <CardDescription className="text-balance">Select a user to login</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col items-center">
              {users && users.length > 0 ? (
                <div className="w-full max-w-md space-y-3">
                  {users.map((user, index) => (
                    <Fragment key={user.id}>
                      {index > 0 && <Separator className="my-3 bg-gray-300" orientation="horizontal" />}
                      <DemoUser user={user} demo={app_id} roles={roles} base_path={base_path} />
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No Users Found for Provided Demo</div>
              )}
            </div>
            <Link href="/demos" className="text-sm text-balance text-stone-500 dark:text-stone-400 hover:underline text-center">
              &larr; More Demos
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
