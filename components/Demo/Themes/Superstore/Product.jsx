import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";

import { TableauEmbed } from 'components';

export const Product = () => {
  return (
    <TabsContent value="product" className="space-y-4">
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            A comparison of performance by product segment, category and subcategory
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
<<<<<<< HEAD:components/Demo/Themes/Superstore/Product.jsx
          <TableauViz
=======
          <TableauEmbed
>>>>>>> a0de14a2cf6d51a455e8594e55d1274641094c3a:components/Themes/Superstore/Product.jsx
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/superstore/ProductDetails'
            width={800}
            height={400}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
      <Card className="dark:bg-stone-900">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Segment sales by month and year
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
<<<<<<< HEAD:components/Demo/Themes/Superstore/Product.jsx
          <TableauViz
=======
          <TableauEmbed
>>>>>>> a0de14a2cf6d51a455e8594e55d1274641094c3a:components/Themes/Superstore/Product.jsx
            src='https://us-west-2a.online.tableau.com/t/embedtableau/views/superstore/ProductView'
            width={800}
            height={300}
            hideTabs={true}
            device='default'
            toolbar='hidden'
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}
