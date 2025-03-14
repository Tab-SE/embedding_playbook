import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { UserModel } from "@/models";

export const description = "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image";

export const Auth = (props) => {
  const { settings } = props;

  const {
    app_id,
    app_name,
    app_logo,
    auth_hero,
  } = settings;

  const demoManager = new UserModel();
  const users = demoManager.getUsersForDemo(app_id);
  const roles = demoManager.getAllRolesForDemo(app_id);

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
          <DemoTeamMembers
            users={users}
            roles={roles}
          />
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
  const { users, roles } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Role-based access to data & analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {users ? users.map((user) => (
          <DemoUser
            key={user.id}
            user={user}
            roles={roles}
          />
        )) : 'No Users Found for Provided Demo'}
        <Button type="submit" className="w-fit mx-auto">
          Login
        </Button>
      </CardContent>
    </Card>
  )
}

const DemoUser = (props) => {
  const { user , roles } = props;
  const { name, email, role, picture } = user;

  const getRoleProperties = (roleId) => {
    return roles[roleId] || { title: 'Unknown', description: 'Role not found' };
  };

  // Get the correct role properties
  const {title, description } = getRoleProperties(role);

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-9">
        <Avatar>
          <AvatarImage src={picture} />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
