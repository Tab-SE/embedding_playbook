import {
  File,
  ListFilter,
  PlusCircle,
} from "lucide-react";

import { Button } from "components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui";

import { ProductsTable, TableauEmbed } from "components";

export const description = "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions."

export const Products = (props) => {
  const { } = props;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="products">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="segment">Segments</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable />
        </TabsContent>
        <TabsContent value="segment">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Segment Analysis</CardTitle>
              <CardDescription>
                A comparison of product sales and profitability by segment and category
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ProductDetails'
                width={1260}
                height={516}
                hideTabs={true}
                device='default'
                toolbar='hidden'
                layouts = {{
                  'xs': { 'device': 'default', 'width': 300, 'height': 500 },
                  'sm': { 'device': 'default', 'width': 520, 'height': 600 },
                  'md': { 'device': 'default', 'width': 650, 'height': 700 },
                  'lg': { 'device': 'phone', 'width': 900, 'height': 800 },
                  'xl': { 'device': 'tablet', 'width': 1150, 'height': 800 },
                  'xl2': { 'device': 'desktop', 'width': 1400, 'height': 800 },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                Product category sales by month and year. Darker cells indicate higher relative sales while lighter cells signal the opposite.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/superstore/ProductView'
                width={1260}
                height={516}
                hideTabs={true}
                device='default'
                toolbar='hidden'
                layouts = {{
                  'xs': { 'device': 'default', 'width': 300, 'height': 500 },
                  'sm': { 'device': 'default', 'width': 520, 'height': 600 },
                  'md': { 'device': 'default', 'width': 650, 'height': 700 },
                  'lg': { 'device': 'phone', 'width': 900, 'height': 800 },
                  'xl': { 'device': 'tablet', 'width': 1150, 'height': 800 },
                  'xl2': { 'device': 'desktop', 'width': 1400, 'height': 800 },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
