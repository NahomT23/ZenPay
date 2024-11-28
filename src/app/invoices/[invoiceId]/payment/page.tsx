// import { notFound } from "next/navigation"
// import { Badge } from "@/components/ui/badge"
// import { db } from "@/db"
// import { Invoices } from "@/db/schema"
// import { cn } from "@/lib/utils"
// import { eq } from "drizzle-orm"
// import { auth } from "@clerk/nextjs/server"
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { AVALIABLE_STATUSES } from "@/data/invoices"
// import { Ellipsis } from "lucide-react"
// import { Customers } from "@/db/schema"

// const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
//   const { userId } = await auth()

//   if (!userId) return

//   const invoiceId = parseInt(params.invoiceId)

//   if (isNaN(invoiceId)) {
//     throw new Error("Invalid Invoice Id")
//   }

//   const [result] = await db.select({
//     id: Invoices.id,
//     status: Invoices.status,
//     createTs: Invoices.createTs,
//     description: Invoices.description,
//     value: Invoices.value,
//     name: Customers.name
//   }).from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id)).where(
//     eq(Invoices.id, invoiceId),
//     eq(Invoices.userId, userId)
//   ).limit(1)

//   if (!result) {
//     notFound()
//   }

//   return (
    
//     <div>
    // <div className="h-full max-w-5xl mx-auto my-12 px-4">
//       <div className="flex justify-between mb-8">
//         <h1 className="flex items-center gap-4 text-3xl font-semibold">
//           Invoice {invoiceId}
//           <Badge
//             className={cn(
//               "rounded-full capitalize px-4 py-1 text-white text-sm",
//               result.status === "open" && "bg-blue-500",
//               result.status === "paid" && "bg-green-600",
//               result.status === "void" && "bg-zinc-700",
//               result.status === "uncollectable" && "bg-red-600"
//             )}
//           >
//             {result.status}
//           </Badge>
//         </h1>
//       </div>
//       <p className="text-3xl font-semibold mb-3">${(result.value / 100).toFixed(2)}</p>
//       <p className="text-lg mb-8 text-gray-700">{result.description}</p>

//       <h2 className="text-lg font-bold mb-4">Billing Details</h2>
//       <ul className="grid gap-4">
//         <li className="flex gap-4">
//           <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Invoice ID</strong>
//           <span>{invoiceId}</span>
//         </li>
//         <li className="flex gap-4">
//           <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Invoice Date</strong>
//           <span>{new Date(result.createTs).toLocaleDateString()}</span>
//         </li>
//         <li className="flex gap-4">
//           <strong className="block w-32 flex-shrink-0 font-medium text-sm text-gray-600">Billing Name</strong>
//           <span>{result.name}</span>
//         </li>
//       </ul>
//     </div>
//     </div>
  
//   )
// }

// export default InvoicePage

import { eq } from "drizzle-orm";
import { Check, CreditCard } from "lucide-react";
import Stripe from "stripe";


import { Badge } from "@/components/ui/badge";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { createPayment, updateStatusAction } from "@/actions/createAction";
import { db } from "@/db";
import { notFound } from "next/navigation";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: { invoiceId: string };
  searchParams: {
    status: string;
    session_id: string;
  };
}

export default async function InvoicePage({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoiceId = Number.parseInt(params.invoiceId);

  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === "success";
  const isCanceled = searchParams.status === "canceled";
  let isError = isSuccess && !sessionId;

  console.log("isSuccess", isSuccess);
  console.log("isCanceled", isCanceled);

  if (Number.isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    const { payment_status } =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      await updateStatusAction(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <div className="h-full max-w-5xl mx-auto my-12 px-4">
    <main className="w-full h-full">
        {isError && (
          <p className="bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6">
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was canceled, please try again.
          </p>
        )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-600",
                    invoice.status === "void" && "bg-zinc-700",
                    invoice.status === "uncollectible" && "bg-red-600",
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
            {invoice.status === "open" && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="flex gap-2 font-bold bg-green-700">
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <p className="flex gap-2 items-center text-xl font-bold">
                <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                Invoice Paid
              </p>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
    </main>
    </div>
  );
}