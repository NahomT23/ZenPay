import { integer, pgTable, serial, timestamp, text, pgEnum } from "drizzle-orm/pg-core"
import { AVALIABLE_STATUSES } from "@/data/invoices"

export type Status = typeof AVALIABLE_STATUSES[number]["id"]

export const statuses = AVALIABLE_STATUSES.map(({id}) => id) as Array<Status>

export const statusEnum = pgEnum('status', statuses as [Status, ...Array<Status>])


export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('createTs').defaultNow().notNull(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    userId: text("userId").notNull(),
    customerId: integer('customerId').notNull().references(() => Customers.id),
    status: statusEnum('status').notNull(), 
})


export const Customers = pgTable('customers', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('createTs').defaultNow().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    userId: text("userId").notNull(),
})

