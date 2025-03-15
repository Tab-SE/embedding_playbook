'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export const DemoUser = (props) => {
  const { user, roles } = props;
  const { name, email, role, picture } = user;

  const getRoleProperties = (roleId) => {
    return roles[roleId] || { title: "Unknown", description: "Role not found" }
  };

  const { title, description } = getRoleProperties(role);

  const authenticateUser = () => {
    // Empty function for now
    console.log("Authenticating user:", name);
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
