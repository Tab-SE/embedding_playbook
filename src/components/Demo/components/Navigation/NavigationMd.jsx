import Link from 'next/link';
import { Settings } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from 'components/ui';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui';

import { settings } from '../../settings';

export const NavigationMd = (props) => {
  const {} = props;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-navigationBackground sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={settings.base_path}
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Avatar className="h-6 w-6 transition-all group-hover:scale-110">
            <AvatarImage src={settings.app_logo} alt="demo brand logo" />
            <AvatarFallback>APP</AvatarFallback>
          </Avatar>
          <span className="sr-only">{settings.app_name}</span>
        </Link>
        {settings.sections
          ? settings.sections.map((section) => {
              return <NavBarItem key={section.name} section={section} />;
            })
          : null}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/demos/superstore/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5 text-navigationIcons" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

const NavBarItem = (props) => {
  const { section } = props;
  const { name, icon, path, min_role, description } = section;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={settings.base_path + path}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 text-navigationIcons"
          >
            {icon}
            <span className="sr-only">{name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
