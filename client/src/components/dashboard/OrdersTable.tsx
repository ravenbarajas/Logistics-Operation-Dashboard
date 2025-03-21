import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { orders } from "@/data/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrdersTable() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0 border-b border-border">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.from}</TableCell>
                <TableCell>{order.to}</TableCell>
                <TableCell>
                  <Badge 
                    className={cn(
                      order.status === "In Transit" && "bg-secondary/10 text-secondary hover:bg-secondary/20",
                      order.status === "Delayed" && "bg-destructive/10 text-destructive hover:bg-destructive/20",
                      order.status === "Delivered" && "bg-muted hover:bg-muted/80"
                    )}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 5 of 153 orders</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Previous</Button>
          <Button>Next</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
