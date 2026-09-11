'use client';

import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export const DemoUser = (props) => {
  const { user, roles, demo, base_path, hideEmail, brands, brandLogos } = props;
  const { id, name, email, role, picture } = user;
  const router = useRouter();

  const getRoleProperties = (roleId) => {
    return roles[roleId] || { title: "Unknown", description: "Role not found" }
  };

  const { title, description } = getRoleProperties(role);

  const authenticateUser = async () => {
    const result = await signIn('demo-user', { redirect: false, ID: id, demo: demo });
    if (result && !result.error) {
      router.push(base_path);
    }
  }

  return (
    <div
      className="flex flex-col gap-2 p-2 rounded-md border border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
      onClick={authenticateUser}
    >
      {/* Main row: avatar | name | role */}
      <div className="grid sm:grid-cols-[auto_1fr_1fr] grid-cols-[auto_1fr] gap-3 items-start">
        <Avatar className="flex-shrink-0 self-center">
          <AvatarImage src={picture} />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>

        <div className="min-w-0 self-center">
          <p className="text-sm font-medium leading-none">{name}</p>
          {!hideEmail && <p className="text-xs font-light italic text-muted-foreground">{email}</p>}
        </div>

        <div className="min-w-0 sm:col-start-3 col-start-2 row-start-2 sm:row-start-1 self-center">
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-xs font-light italic text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
      </div>

      {/* Brand row: full width, logos + names side by side, under the person's name */}
      {brands && brands.length > 0 && (
        <div className="flex flex-row flex-wrap gap-3 pl-[52px] items-center">
          {brands.map(brand => (
            <span key={brand} className="inline-flex items-center gap-1.5">
              {brandLogos?.[brand] && (
                <img src={brandLogos[brand]} alt={brand} className="h-4 w-auto max-w-[28px] object-contain flex-shrink-0" />
              )}
              <span className="text-xs font-medium text-muted-foreground">{brand}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
