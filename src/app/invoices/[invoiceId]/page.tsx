
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db"
import { Invoices } from "@/db/schema"
import { cn } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { updateStatusAction, deleteInvoiceAction } from "@/actions/createAction"
import { AVALIABLE_STATUSES } from "@/data/invoices"
import { Ellipsis } from "lucide-react"
import { Customers } from "@/db/schema"
import Link from "next/link"

const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
  const { userId } = await auth()

  if (!userId) return

  const invoiceId = parseInt(params.invoiceId)

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice Id")
  }



  console.log('PARAMS:', params)


  // const [result] = await db.select().from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id)).where(
  //   eq(Invoices.id, invoiceId),
  //   eq(Invoices.userId, userId)
  // ).limit(1)


  let [result]: Array<{
    invoices: typeof Invoices.$inferSelect;
    customers: typeof Customers.$inferSelect;
  }> = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .limit(1)

    
  if (!result) {
    notFound()
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers
  }

  const customerName = result.customers.name  || "John Doe"
  const customerEmail = result.customers.email || "johndoe@gmail.com"

  return (
    <div className="h-full max-w-5xl mx-auto my-12 px-4">
      <div className="flex justify-between mb-8">
        <h1 className="flex items-center gap-4 text-3xl font-semibold">
          Invoice {invoiceId}
          <Badge
            className={cn(
              "rounded-full capitalize px-4 py-1 text-white text-sm",
              result.invoices.status === "open" && "bg-blue-500",
              result.invoices.status === "paid" && "bg-green-600",
              result.invoices.status === "void" && "bg-zinc-700",
              result.invoices.status === "uncollectable" && "bg-red-600"
            )}
          >
            {result.invoices.status}
          </Badge>
        </h1>
        <div className="flex items-center gap-2">
          {/* Dropdown menu for changing status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4">Change Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              {AVALIABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ellipsis icon dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4">
                <Ellipsis size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/invoices/${invoice.id}/payment`}>
                  Payment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form action={deleteInvoiceAction}>
                  <input type="hidden" name="id" value={invoiceId} />
                  <button type="submit" className="text-red-600">Delete</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-3xl font-semibold mb-3">${(result.invoices.value / 100).toFixed(2)}</p>
      <p className="text-lg mb-8 text-gray-700">{result.invoices.description}</p>
      <h2 className="text-lg font-bold mb-4">Billing Details</h2>
      <ul className="grid gap-4">
        <li className="flex gap-4">
          <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Invoice ID</strong>
          <span>{invoiceId}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Invoice Date</strong>
          <span>{new Date(result.invoices.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Billing Name</strong>
          <span>{customerName}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Billing Email</strong>
          <span>{customerEmail}</span>
        </li>
      </ul>
    </div>
  )
}

export default InvoicePage

