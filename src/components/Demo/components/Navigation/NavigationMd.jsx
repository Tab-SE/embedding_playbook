import Link from "next/link";
import {
  Settings,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";


export const NavigationMd = (props) => {
  const {
    base_path,
    crumbs,
    app_name,
    app_logo,
    ai_chat,
    ai_avatar,
    sections,
  } = props;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-navBackground sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 bg-logoBackground">
        <Link
          href='/demos'
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-logoBackground text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Avatar className="h-8 w-8 p-1 transition-all group-hover:scale-110 bg-logoBackground">
            <AvatarImage src={app_logo} alt="demo brand logo" />
            <AvatarFallback>APP</AvatarFallback>
          </Avatar>
          <span className="sr-only">{app_name}</span>
        </Link>
        {sections ? sections.map((section) => {
          return <NavBarItem key={section.name} section={section} base_path={base_path} />
        }): null}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={base_path + '/settings'}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5 text-navIcons"/>
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}

const NavBarItem = (props) => {
  const { section, base_path } = props;
  const { name, icon, path, min_role, description} = section;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={base_path + path}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 text-navIcons bg-iconBackground hover:scale-110"
          >
            {icon}
            <span className="sr-only">{name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
