import Link from "next/link"
import { ArrowUpRight, DollarSign, CreditCard, Banknote, Building, ShoppingCart } from "lucide-react"

import { Badge } from "components/ui"
import { Button } from "components/ui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "components/ui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui"

export const Withdrawals = () => {
  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Withdrawals</CardTitle>
          <CardDescription>
            Recent withdrawals from your Checking Account  x2345
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden xl:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2024-10-08</TableCell>
              <TableCell>
                <div className="font-medium">Rent Payment</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Sunshine Apartments
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ACH
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              </TableCell>
              <TableCell className="text-right">-$2,500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2024-10-05</TableCell>
              <TableCell>
                <div className="font-medium">ATM Withdrawal</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  ATM #5678
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  ATM
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="outline" className="text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">-$200.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2024-10-03</TableCell>
              <TableCell>
                <div className="font-medium">Check Payment</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Check #1002
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                  <Banknote className="h-3 w-3" />
                  Check
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="outline" className="text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">-$1,500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2024-10-01</TableCell>
              <TableCell>
                <div className="font-medium">Transfer to Savings</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Account ending in 1093
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                  <Building className="h-3 w-3" />
                  Transfer
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="outline" className="text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">-$500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2024-09-30</TableCell>
              <TableCell>
                <div className="font-medium">Online Purchase</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Amazon.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                  <ShoppingCart className="h-3 w-3" />
                  Debit Card
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant="outline" className="text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="text-right">-$150.75</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild size="sm" className="gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
