import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm";
import { Customers } from "@/db/schema";

const Dashboard = async () => {
  const { userId } = await auth()

  if(!userId) return

  const results = await db.select().from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id)).where(eq(Invoices.userId, userId))

  return (
    <div className="flex flex-col justify-center h-full text-center gap-6 my-12 max-w-5xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <Button variant="ghost" className="inline-flex gap-2" asChild>
          <Link href="/invoices/new"><CirclePlus className="h-4 w-4" /> Create Invoice</Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-semibold p-4">Date</TableHead>
            <TableHead className="font-semibold p-4">Customer</TableHead>
            <TableHead className="p-4">Email</TableHead>
            <TableHead className="text-center p-4">Status</TableHead>
            <TableHead className="text-right p-4">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.invoices.id}>
              <TableCell className="text-left font-semibold">
                <Link href={`/invoices/${result.invoices.id}`} className="p-4">
                  {new Date(result.invoices.createTs).toLocaleDateString()}
                </Link>
              </TableCell>
              <TableCell className="text-left font-semibold">
                <Link href={`/invoices/${result.invoices.id}`} className="p-4">
                  {result.customers.name}
                </Link>
              </TableCell>
              <TableCell className="text-left">
                <Link href={`/invoices/${result.invoices.id}`} className="p-4">
                {result.customers.email}
                </Link>
              </TableCell>
              <TableCell  className="text-center">
                <Link href={`/invoices/${result.invoices.id}`} className="p-4">
                          <Badge className={cn(
            'rounded-full',
            result.status === 'open' && 'bg-blue-500',
            result.status === 'paid' && 'bg-green-600',
            result.status === 'void' && 'bg-zinc-700',
            result.status === 'uncollectable' && 'bg-red-600',
        )}>
           {result.invoices.status}
        </Badge>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/invoices/${result.invoices.id}`} className="p-4">
                  {(result.invoices.value / 100).toFixed(2)} {/* Ensure this is correctly formatted */}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;