import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

// get demo users via this request: https://randomuser.me/api/?results=15&nat=us&inc=name,id,picture,email

export const TransactionsLong = () => {
  return (
    <Card className='shadow-xl' x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent client transactions.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  olivia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Refund</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Declined</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Noah Williams</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  noah@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Subscription</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-25</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Emma Brown</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  emma@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-26</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Mason Lee</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  mason@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-27</TableCell>
              <TableCell className="text-right">$550.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Sophia Martinez</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  sophia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Subscription</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-28</TableCell>
              <TableCell className="text-right">$200.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">James Miller</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  james@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Refund</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Declined</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-29</TableCell>
              <TableCell className="text-right">$120.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Isabella Garcia</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  isabella@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-30</TableCell>
              <TableCell className="text-right">$300.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Benjamin Clark</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  benjamin@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Subscription</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-01</TableCell>
              <TableCell className="text-right">$400.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Mia Walker</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  mia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-02</TableCell>
              <TableCell className="text-right">$275.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Elijah Lewis</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  elijah@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Refund</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Declined</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-03</TableCell>
              <TableCell className="text-right">$180.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Charlotte Young</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  charlotte@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Subscription</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-04</TableCell>
              <TableCell className="text-right">$225.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">William Hall</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  william@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Sale</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-05</TableCell>
              <TableCell className="text-right">$500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Amelia Allen</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  amelia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Refund</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Declined</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-06</TableCell>
              <TableCell className="text-right">$130.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Lucas King</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  lucas@example.com
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">Subscription</TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className="text-xs" variant="outline">Approved</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-07-07</TableCell>
              <TableCell className="text-right">$320.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
