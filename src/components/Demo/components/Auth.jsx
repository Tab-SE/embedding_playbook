import Image from "next/image"
import Link from "next/link"

import { Button } from "components/ui";
import { RadioGroup, RadioGroupItem } from "components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui";

export const description = "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image";

export const Auth = (props) => {
  const {
    app_name,
    app_logo,
    auth_hero,
    users
  } = props;

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-12 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 lg:col-span-4">
        <div className="mx-auto grid w-[420px] gap-6">
          <div className="flex justify-center">
            <Avatar className="flex items-center justify-center min-h-12 min-w-12">
              <AvatarImage src={app_logo} className="object-cover rounded-full" />
              <AvatarFallback>APP</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{app_name}</h1>
            <p className="text-balance text-muted-foreground">
              Select a user to login
            </p>
          </div>
          <DemoTeamMembers users={users} />
        </div>
      </div>
      <div className="hidden bg-muted lg:block lg:col-span-8">
        <Image
          src={auth_hero}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-demoBackground"
        />
      </div>
    </div>
  )
}



const DemoTeamMembers = (props) => {
  const { users } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Role-based access to data & analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-9">
            <Avatar>
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">m@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Explorer</p>
              <p className="text-sm text-muted-foreground">Self-service analytics</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-9">
            <Avatar>
              <AvatarImage src="/avatars/02.png" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Jackson Lee</p>
              <p className="text-sm text-muted-foreground">p@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Viewer</p>
              <p className="text-sm text-muted-foreground">Analytics consumer</p>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-fit mx-auto">
          Login
        </Button>
      </CardContent>
    </Card>
  )
}

const demoUser = (props) => {
  const { user, roles } = props;
  const { name, email, role, img } = user;

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-9">
        <Avatar>
          <AvatarImage src={img} />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">{role.title}</p>
          <p className="text-xs text-muted-foreground">{role.description}</p>
        </div>
      </div>
    </div>
  )
}
