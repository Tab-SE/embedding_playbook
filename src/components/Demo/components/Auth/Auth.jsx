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

  const {
    app_id,
    base_path,
    app_name,
    app_logo,
    auth_logo,
    auth_hero,
    auth_logo_variant = 'avatar',
    /** When true, full-page background uses theme `bg-navBackground` (no photo). */
    auth_solid_background,
    /** When false, omit the CardTitle under the logo (use for full lockup artwork). */
    auth_show_title = true,
  } = settings;
  const logoToUse = auth_logo || app_logo;

  const demoManager = new UserModel();
  const users = demoManager.getUsersForDemo(app_id);
  const roles = demoManager.getAllRolesForDemo(app_id);


  return (
    <div className="relative w-full min-h-screen">

      <div className="absolute inset-0 h-full w-full" aria-hidden>
        {auth_solid_background ? (
          <div className="h-full w-full bg-navBackground" />
        ) : (
          <Image
            src={auth_hero || "/placeholder.svg"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover dark:brightness-[0.2] dark:grayscale background"
          />
        )}
      </div>

      <div className="relative z-10 flex items-center justify-center w-full min-h-screen p-4">
        <Card className="mx-auto w-[480px] max-w-full shadow-lg backdrop-blur-sm loginBackground/95">
          <CardHeader className="text-center">
            {auth_logo_variant === 'wide' ? (
              <div className="mb-2 flex justify-center px-2">
                <Image
                  src={logoToUse}
                  alt={app_name}
                  width={400}
                  height={200}
                  className="h-auto max-h-[min(40vh,220px)] w-auto max-w-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div className="mb-4 flex justify-center">
                <Avatar className="flex h-16 w-16 items-center justify-center bg-logoBackground">
                  <AvatarImage src={logoToUse} className="rounded-full object-cover" />
                  <AvatarFallback>APP</AvatarFallback>
                </Avatar>
              </div>
            )}
            {auth_show_title ? (
              <CardTitle className="text-3xl font-bold">{app_name}</CardTitle>
            ) : null}
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
