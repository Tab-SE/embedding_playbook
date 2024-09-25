import Link from "next/link";
import {
  Home,
  Package,
  PanelLeft,
  ShoppingCart,
  Users2,
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

import { settings } from '../../settings';


export const NavigationSm = (props) => {
  const { } = props;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs bg-navigationBackground">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href={settings.base_path}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Avatar className="h-6 w-6 transition-all group-hover:scale-110">
              <AvatarImage src={settings.app_logo} alt="demo brand logo" />
              <AvatarFallback>APP</AvatarFallback>
            </Avatar>
            <span>{settings.app_name}</span>
          </Link>
          <Separator className="my-4" />
          {settings.sections ? settings.sections.map((section) => {
            return <NavBarItem key={section.name} section={section} />
          }): null}
          <Link
            href="/demos/superstore/settings"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const NavBarItem = (props) => {
  const { section } = props;
  const { name, icon, path, min_role, description} = section;

  return (
    <Link
      href={settings.base_path + path}
      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
    >
      {icon}
      {name}
    </Link>
  )
}
