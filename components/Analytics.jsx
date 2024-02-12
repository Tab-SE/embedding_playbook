import { useState, useRef } from 'react';
import Image from "next/image"

import { Button } from "./ui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "./ui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui"

// import { CalendarDateRangePicker } from "@/app/examples/dashboard/components/date-range-picker"
// import { MainNav } from "@/app/examples/dashboard/components/main-nav"
// import { Overview } from "@/app/examples/dashboard/components/overview"
// import { RecentSales } from "@/app/examples/dashboard/components/recent-sales"
// import { Search } from "@/app/examples/dashboard/components/search"
// import TeamSwitcher from "@/app/examples/dashboard/components/team-switcher"
// import { UserNav } from "@/app/examples/dashboard/components/user-nav"


export const Analytics = (props) => {
  const { src, height, width, hideTabs, device, toolbar } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <section className='bg-colorblind-lgray rounded pb-3'> 
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </section>
  )
}
