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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-navBackground sm:flex">
      <nav className="flex flex-col items-center gap-5 px-3 sm:py-6 bg-navBackground">
        <Link
          href='/demos'
          className="group flex h-14 w-14 shrink-0 items-center justify-center gap-2 rounded-full bg-logoBackground text-lg font-semibold text-primary-foreground"
        >
          <Avatar className="h-12 w-12 p-1.5 transition-all group-hover:scale-110 bg-logoBackground">
            <AvatarImage src={app_logo} alt="demo brand logo" />
            <AvatarFallback>APP</AvatarFallback>
          </Avatar>
          <span className="sr-only">{app_name}</span>
        </Link>
        {sections ? sections.map((section) => {
          return <NavBarItem key={section.name} section={section} base_path={base_path} />
        }): null}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-5 px-3 sm:py-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={base_path + '/settings'}
                className="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <Settings className="h-6 w-6 text-navIcons"/>
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
            className="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground text-navIcons bg-iconBackground hover:scale-110"
          >
            <div className="scale-125">
              {icon}
            </div>
            <span className="sr-only">{name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
