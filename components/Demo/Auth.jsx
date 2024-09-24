import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"


import { Button } from "components/ui";
import { Checkbox } from "components/ui";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui";

export const description = "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image";

export const Auth = (props) => {
  const { } = props;

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-12 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12 lg:col-span-4">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex justify-center">
            <Avatar className="flex items-center justify-center min-h-12 min-w-12">
              <AvatarImage src="/img/themes/superstore/superstore.png" className="object-cover rounded-full" />
              <AvatarFallback>APP</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Superstore Analytics</h1>
            <p className="text-balance text-muted-foreground">
              Select a user to login
            </p>
          </div>
          <DemoTeamMembers />
        </div>
      </div>
      <div className="hidden bg-muted lg:block lg:col-span-8">
        <Image
          src="https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}



export const DemoTeamMembers = (props) => {
  const { } = props;

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
          <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardContent>
    </Card>
  )
}
