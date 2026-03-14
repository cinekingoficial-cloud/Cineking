import { db } from "./db";
import { 
  customers, contentRequests, problemReports, notices, games,
  type Customer, type InsertCustomer,
  type ContentRequest, type InsertContentRequest,
  type ProblemReport, type InsertProblemReport,
  type Notice, type InsertNotice,
  type Game, type InsertGame
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByCode(code: string): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  // Content Requests
  createContentRequest(request: InsertContentRequest): Promise<ContentRequest>;
  getContentRequests(): Promise<ContentRequest[]>;

  // Problem Reports
  createProblemReport(report: InsertProblemReport): Promise<ProblemReport>;
  getProblemReports(): Promise<ProblemReport[]>;

  // Notices
  createNotice(notice: InsertNotice): Promise<Notice>;
  getNotices(): Promise<Notice[]>;
  deleteNotice(id: number): Promise<void>;

  // Games
  createGame(game: InsertGame): Promise<Game>;
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  updateGame(id: number, updates: Partial<InsertGame>): Promise<Game>;
  deleteGame(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByCode(code: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.customerCode, code));
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [updated] = await db.update(customers).set(updates).where(eq(customers.id, id)).returning();
    return updated;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async createContentRequest(request: InsertContentRequest): Promise<ContentRequest> {
    const [newRequest] = await db.insert(contentRequests).values(request).returning();
    return newRequest;
  }

  async getContentRequests(): Promise<ContentRequest[]> {
    return await db.select().from(contentRequests);
  }

  async createProblemReport(report: InsertProblemReport): Promise<ProblemReport> {
    const [newReport] = await db.insert(problemReports).values(report).returning();
    return newReport;
  }

  async getProblemReports(): Promise<ProblemReport[]> {
    return await db.select().from(problemReports);
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [newNotice] = await db.insert(notices).values(notice).returning();
    return newNotice;
  }

  async getNotices(): Promise<Notice[]> {
    return await db.select().from(notices);
  }

  async deleteNotice(id: number): Promise<void> {
    await db.delete(notices).where(eq(notices.id, id));
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async getGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async updateGame(id: number, updates: Partial<InsertGame>): Promise<Game> {
    const [updated] = await db.update(games).set(updates).where(eq(games.id, id)).returning();
    return updated;
  }

  async deleteGame(id: number): Promise<void> {
    await db.delete(games).where(eq(games.id, id));
  }
}

export const storage = new DatabaseStorage();
