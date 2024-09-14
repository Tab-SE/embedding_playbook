import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  PanelLeft,
  ShoppingCart,
  Users2,
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
  const { } = props;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/demos"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Avatar className="h-6 w-6 transition-all group-hover:scale-110">
              <AvatarImage src='/img/themes/superstore/superstore.png' alt="demo brand logo" />
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <span>Superstore Analytics</span>
          </Link>
          <Separator className="my-4" />
          <Link
            href="/demos/superstore"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            href="/demos/superstore/orders"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="/demos/superstore/products"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="/demos/superstore/customers"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
