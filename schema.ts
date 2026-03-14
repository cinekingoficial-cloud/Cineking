import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerCode: text("customer_code").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  planType: text("plan_type").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  status: text("status").notNull().default('Ativo'),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const contentRequests = pgTable("content_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  contentType: text("content_type").notNull(),
  details: jsonb("details").notNull(),
  appUsed: text("app_used").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const problemReports = pgTable("problem_reports", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  problemType: text("problem_type").notNull(),
  contentName: text("content_name").notNull(),
  appUsed: text("app_used").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  noticeType: text("notice_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  matchTime: text("match_time").notNull(),
  championship: text("championship").notNull(),
  channel: text("channel").notNull(),
  gameDate: text("game_date").notNull(),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export const insertContentRequestSchema = createInsertSchema(contentRequests).omit({ id: true, createdAt: true });
export const insertProblemReportSchema = createInsertSchema(problemReports).omit({ id: true, createdAt: true });
export const insertNoticeSchema = createInsertSchema(notices).omit({ id: true, createdAt: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true, createdAt: true });

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type ContentRequest = typeof contentRequests.$inferSelect;
export type InsertContentRequest = z.infer<typeof insertContentRequestSchema>;

export type ProblemReport = typeof problemReports.$inferSelect;
export type InsertProblemReport = z.infer<typeof insertProblemReportSchema>;

export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
