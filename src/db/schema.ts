import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const quotations = pgTable("quotations", {
    id: serial("id").primaryKey(),
    orderType: varchar("order_type", { length: 20 }).notNull(), // 'standard' | 'custom'
    companyName: varchar("company_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    product: varchar("product", { length: 255 }), // For standard orders
    customDescription: text("custom_description"), // For custom orders
    quantity: integer("quantity").notNull(),
    notes: text("notes"),
    fileUrl: text("file_url"), // Vercel Blob URL for custom design uploads
    fileName: varchar("file_name", { length: 255 }),
    status: varchar("status", { length: 20 }).notNull().default("Pending"), // Pending | Reviewed | Approved | Rejected
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Quotation = typeof quotations.$inferSelect;
export type NewQuotation = typeof quotations.$inferInsert;
