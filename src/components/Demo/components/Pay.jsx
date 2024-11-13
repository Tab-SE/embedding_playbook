import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui";

import { ProductsTable, TableauEmbed } from "components";

export const description = "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions."

export const Pay = (props) => {
  const { } = props;

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="forecaster">
        <TabsList className="mb-2 sm:mb-0">
          <TabsTrigger value="forecaster">Forecast</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable />
        </TabsContent>
        <TabsContent value="forecaster">
          <Card className="dark:bg-stone-900 shadow-xl">
            <CardHeader>
              <CardTitle>Pay Forecaster</CardTitle>
              <CardDescription>
                A comparison of product sales and profitability by segment and category
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center px-1">
              <TableauEmbed
                src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/cpq_optimization/Fullscreen'
                hideTabs={true}
                toolbar='hidden'
                className='
                min-w-[1200px] min-h-[1100px]
                sm:min-w-[1200px] sm:min-h-[1100px]
                md:min-w-[1200px] md:min-h-[1100px]
                lg:min-w-[1200px] lg:min-h-[1100px]
                xl:min-w-[1200px] xl:min-h-[1100px]
                2xl:min-w-[1200px] 2xl:min-h-[1100px]
                '
                layouts = {{
                  '*': { 'device': 'default' }
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
                hideTabs={true}
                device='default'
                toolbar='hidden'
                className='
                min-w-[1260px] min-h-[1100px]
                sm:min-w-[1260px] sm:min-h-[1100px]
                md:min-w-[1260px] md:min-h-[1100px]
                lg:min-w-[1260px] lg:min-h-[1100px]
                xl:min-w-[1260px] xl:min-h-[1100px]
                2xl:min-w-[1260px] 2xl:min-h-[1100px]
                '
                layouts = {{
                  '*': { 'device': 'default' }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
