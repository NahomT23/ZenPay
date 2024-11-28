
"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { Invoices, Status, Customers } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import Stripe from 'stripe'

import { headers } from "next/headers";



const stripe = new Stripe(String(process.env.STRIPE_API_SECRET))


export async function createAction(formData: FormData) {
  const { userId } = await auth();


  // if (!userId) {
  //   return;
  // }

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100,);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;


  const [customer] = await db.insert(Customers).values({
    name,
    email,
    userId,
  })
  .returning({
    id: Customers.id,
  })


  const results = await db.insert(Invoices)
    .values({
      value,
      description,
      status: "open",
      userId,
      customerId: customer.id
    })
    .returning({
      id: Invoices.id,
    });

    redirect(`/invoices/${results[0].id}`)

  }




// Update invoice status
export async function updateStatusAction(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    return; // Return early if no user is authenticated
  }

  const id = formData.get("id") as string
  const status = formData.get("status") as Status

  const validStatuses = ["open", "paid", "void", "uncollectable"]
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`)
  }

  const results = await db.update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)))

  if (results.count === 0) {
    throw new Error("Invoice not found or user does not have permission to update the status.")
  }

  revalidatePath(`/invoices/${id}`)
  console.log(`Status updated to: ${status} for invoice ${id}`)
}

// Delete an invoice
export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    return; // Return early if no user is authenticated
  }

  const id = formData.get("id") as string

  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid Invoice ID")
  }

  const invoiceId = parseInt(id)

  const result = await db.delete(Invoices).where(
    and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId))
  )

  if (result.count === 0) {
    throw new Error("Invoice not found or user does not have permission to delete.")
  }

  revalidatePath(`/invoices`)
  redirect('/dashboard')
  console.log(`Invoice ${invoiceId} deleted successfully`)
}


export async function createPayment(formData: FormData) {
  // Payments disabled for demo
  const { userId } = await auth();
  if ( userId !== process.env.ME_ID ) return;

  const headersList = headers();
  const origin = headersList.get("origin");
  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_RIa7p8cD6YhAP7",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid Session");
  }

  redirect(session.url);
}