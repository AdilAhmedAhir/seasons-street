import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    varchar,
    boolean,
} from "drizzle-orm/pg-core";

// ─── Quotations ───────────────────────────────────────────────
export const quotations = pgTable("quotations", {
    id: serial("id").primaryKey(),
    orderType: varchar("order_type", { length: 20 }).notNull(),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    product: varchar("product", { length: 255 }),
    customDescription: text("custom_description"),
    quantity: integer("quantity").notNull(),
    notes: text("notes"),
    fileUrl: text("file_url"),
    fileName: varchar("file_name", { length: 255 }),
    status: varchar("status", { length: 20 }).notNull().default("Pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Products ─────────────────────────────────────────────────
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(), // 'quilling' | 'disposables' | 'handicrafts' | 'printing'
    description: text("description"),
    imageUrl: text("image_url"),
    price: varchar("price", { length: 50 }), // display price or "Contact for pricing"
    moq: integer("moq").notNull().default(100),
    tags: text("tags"), // comma-separated
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Portfolio Items ──────────────────────────────────────────
export const portfolioItems = pgTable("portfolio_items", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    category: varchar("category", { length: 100 }), // 'past_work' | 'shipment' | 'finished_goods'
    clientName: varchar("client_name", { length: 255 }),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Team Members ─────────────────────────────────────────────
export const teamMembers = pgTable("team_members", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 100 }).notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Site Settings (Key-Value) ────────────────────────────────
export const siteSettings = pgTable("site_settings", {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
    section: varchar("section", { length: 50 }).notNull(), // 'hero' | 'about' | 'contact' | 'catalog' | 'general'
    label: varchar("label", { length: 255 }).notNull(), // Human-readable label for admin UI
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Type exports ─────────────────────────────────────────────
export type Quotation = typeof quotations.$inferSelect;
export type NewQuotation = typeof quotations.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
