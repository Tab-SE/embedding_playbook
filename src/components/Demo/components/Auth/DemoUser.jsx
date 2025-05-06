'use client';

import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export const DemoUser = (props) => {
  const { user, roles, demo, base_path } = props;
  const { id, name, email, role, picture } = user;
  const router = useRouter();

  const getRoleProperties = (roleId) => {
    return roles[roleId] || { title: "Unknown", description: "Role not found" }
  };

  const { title, description } = getRoleProperties(role);

  const authenticateUser = () => {
    // sign the user in with the selected options
    signIn('demo-user', { redirect: false, ID: id, demo: demo });
    // redirect to local demo /auth page using the base_path in config file

    router.push(base_path);
  }

  return (
    <div
      className="grid sm:grid-cols-[auto_1fr_1fr] grid-cols-[auto_1fr] gap-3 items-center p-2 rounded-md border border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
      onClick={authenticateUser}
    >
      <Avatar className="flex-shrink-0 row-span-2 sm:row-span-1 self-center">
        <AvatarImage src={picture} />
        <AvatarFallback>USER</AvatarFallback>
      </Avatar>

      <div className="min-w-0 max-w-[150px]">
        <p className="text-sm font-medium leading-none truncate">{name}</p>
        <p className="text-xs font-light italic text-muted-foreground truncate">{email}</p>
      </div>

      <div className="min-w-0 max-w-[150px] sm:col-start-3 col-start-2 row-start-2 sm:row-start-1">
        <p className="text-sm font-medium leading-none truncate">{title}</p>
        <p className="text-xs font-light italic text-muted-foreground truncate">{description}</p>
      </div>
    </div>
  )
}
