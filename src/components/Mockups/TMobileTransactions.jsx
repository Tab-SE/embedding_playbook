import Link from "next/link";
import {
  ArrowUpRight,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

import { Badge } from "components/ui";
import { Button } from "components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui";

export const TMobileTransactions = ({ title = "Recent Support Tickets" }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Escalated":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Phone":
        return <Phone className="h-4 w-4" />;
      case "Chat":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className='dark:bg-stone-900 shadow-xl'>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Recent support tickets and customer inquiries
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1 bg-primary hover:bg-primary/90">
          <Link href="/demo/tmobile/support">
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
              <TableHead className="hidden xl:table-column">
                Channel
              </TableHead>
              <TableHead className="hidden xl:table-column">
                Priority
              </TableHead>
              <TableHead className="hidden xl:table-column">
                Status
              </TableHead>
              <TableHead className="hidden xl:table-column">
                Created
              </TableHead>
              <TableHead className="text-right">Ticket #</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">TechCorp Solutions</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Billing inquiry - Data overage
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getChannelIcon("Phone")}
                  Phone
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className={`text-xs ${getPriorityColor("High")}`}>
                  High
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getStatusIcon("In Progress")}
                  In Progress
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-01-15
              </TableCell>
              <TableCell className="text-right font-mono">#TMO-2024-001</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Global Enterprises</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Network connectivity issue
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getChannelIcon("Chat")}
                  Chat
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className={`text-xs ${getPriorityColor("Medium")}`}>
                  Medium
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getStatusIcon("Resolved")}
                  Resolved
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-01-14
              </TableCell>
              <TableCell className="text-right font-mono">#TMO-2024-002</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">StartupHub Inc</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Service upgrade request
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getChannelIcon("Phone")}
                  Phone
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className={`text-xs ${getPriorityColor("Low")}`}>
                  Low
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getStatusIcon("In Progress")}
                  In Progress
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-01-13
              </TableCell>
              <TableCell className="text-right font-mono">#TMO-2024-003</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Manufacturing Co</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Account management inquiry
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getChannelIcon("Chat")}
                  Chat
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className={`text-xs ${getPriorityColor("High")}`}>
                  High
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getStatusIcon("Escalated")}
                  Escalated
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-01-12
              </TableCell>
              <TableCell className="text-right font-mono">#TMO-2024-004</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Retail Chain Corp</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  Billing dispute resolution
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getChannelIcon("Phone")}
                  Phone
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <Badge className={`text-xs ${getPriorityColor("Medium")}`}>
                  Medium
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-column">
                <div className="flex items-center gap-2">
                  {getStatusIcon("Resolved")}
                  Resolved
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                2024-01-11
              </TableCell>
              <TableCell className="text-right font-mono">#TMO-2024-005</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
