import Link from "next/link";
import {
  PanelLeft,
  Settings
} from "lucide-react";

import { Button } from "components/ui";
import { Sheet, SheetContent, SheetTrigger } from "components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";
import { Separator } from "components/ui";


export const NavigationSm = (props) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5 text-navIcons"/>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs bg-navBackground">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href='/demos'
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground bg-primary"
          >
            <Avatar className="h-6 w-6 transition-all group-hover:scale-110">
              <AvatarImage src={app_logo} alt="demo brand logo" />
              <AvatarFallback>APP</AvatarFallback>
            </Avatar>
            <span>{app_name}</span>
          </Link>
          <Separator className="my-4" />
          {sections ? sections.map((section) => {
            return <NavBarItem key={section.name} section={section} base_path={base_path} />
          }): null}
          <Link
            href={base_path + '/settings'}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5 text-navIcons"/>
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const NavBarItem = (props) => {
  const { section, base_path } = props;
  const { name, icon, path, min_role, description} = section;

  return (
    <Link
      href={base_path + path}
      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-navIcons bg-iconBackground"
    >
      {icon}
      {name}
    </Link>
  )
}
