import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui";
import { Button } from "components/ui"
import { Input } from "components/ui"
import { Label } from "components/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui"

import { TableauEmbed } from 'components';

export const Weekly = () => {
  return (
    <TabsContent value="weekly" className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        <div className="col-span-7 dark:bg-stone-900">
          <div className="grid gap-3 grid-flow-row">
            <Card className="dark:bg-stone-900">
              <CardHeader>
                <CardTitle>2 customers had sales well below your margin threshold</CardTitle>
                <CardDescription>
                  Two customers had margins well below your margin threshold.
                  They appear to be outliers, as the rest of your customers are within targer.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/CPQ_misc_17182505736430/customer_scatter_plot'
                  width={720}
                  height={300}
                  hideTabs={true}
                  device='default'
                  toolbar='hidden'
                />
              </CardContent>
            </Card>
            <Card className="dark:bg-stone-900">
              <CardHeader>
                <CardTitle>Uneven profitability in North America</CardTitle>
                <CardDescription>
                  Price adjustments have performed well in Canada and most of the United States.
                  Colorado, Texas, Ohio and Tennessee have been negatively impacted.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/CPQ_misc_17182505736430/sales_map'
                  width={720}
                  height={300}
                  hideTabs={true}
                  device='default'
                  toolbar='hidden'
                />
              </CardContent>
            </Card>
            <Card className="dark:bg-stone-900">
              <CardHeader>
                <CardTitle>Experiment Complete</CardTitle>
                <CardDescription>
                  Consumer segment surpassed all revenue goals YoY. Home Office and Corporate lag behind.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TableauEmbed
                  src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/CPQ_misc_17182505736430/sales_performance'
                  width={720}
                  height={310}
                  hideTabs={true}
                  device='default'
                  toolbar='hidden'
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-5 dark:bg-stone-900">
          <div className="grid gap-3 grid-flow-row">
            <Card className="dark:bg-stone-900">
              <CardHeader>
                <CardTitle>🔔 Notifications</CardTitle>
                <CardDescription>
                  You have 7 new notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Notifications />
              </CardContent>
            </Card>
            <Card className="dark:bg-stone-900">
              <CardHeader>
                <CardTitle>📖 Recent Price Lists</CardTitle>
                <CardDescription>
                  You have 5 price lists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriceLists />
              </CardContent>
            </Card>
            <NewPriceList />
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

const Notifications = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-emerald-500 text-white">✔</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Global Price List</p>
          <p className="text-sm text-muted-foreground">
            sent for approval
          </p>
        </div>
        <div className="ml-auto font-medium">05/07/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-blue-500 text-white">✎</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Country Price List</p>
          <p className="text-sm text-muted-foreground">
            updated by Jim Lee
          </p>
        </div>
        <div className="ml-auto font-medium">05/13/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-red-500 text-white">⌛</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Regional Price List</p>
          <p className="text-sm text-muted-foreground">
            expires soon
          </p>
        </div>
        <div className="ml-auto font-medium">05/16/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-red-500 text-white">⌛</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Europe Price List</p>
          <p className="text-sm text-muted-foreground">
            expires soon
          </p>
        </div>
        <div className="ml-auto font-medium">05/22/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-500 text-white">💬</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Asia Price List</p>
          <p className="text-sm text-muted-foreground">
            Sarah Ballen wrote a comment
          </p>
        </div>
        <div className="ml-auto font-medium">05/22/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-teal-500 text-white">📅</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Regional Price List</p>
          <p className="text-sm text-muted-foreground">
            test plan required
          </p>
        </div>
        <div className="ml-auto font-medium">06/04/2024</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-yellow-500 text-white">❗</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Australia Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">06/05/2024</div>
      </div>

    </div>
  )
}

const PriceLists = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-200 text-white">🌐</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Global Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">12% Margin</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-200 text-white">🌎</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Regional Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">18% Margin</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-200 text-white">🇺🇸</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Country Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">24% Margin</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-200 text-white">🇪🇺</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Europe Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">15% Margin</div>
      </div>

      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="bg-stone-200 text-white">🌏</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Asia Price List</p>
          <p className="text-sm text-muted-foreground">
            price list is incomplete
          </p>
        </div>
        <div className="ml-auto font-medium">27% Margin</div>
      </div>
    </div>
  )
}

const NewPriceList = () => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Price List</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="segment">Segment</Label>
              <Select>
                <SelectTrigger id="segment">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="office">Home Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pb-9">
        <Button >Cancel</Button>
        <Button className='bg-[#e14462]'>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
