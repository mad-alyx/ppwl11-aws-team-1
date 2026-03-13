import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { PrismaClient } from "../src/generated/prisma/client";
import { prisma } from '../prisma/db';
import type { ApiResponse, HealthCheck, User } from "shared";

const app = new Elysia()
  .use(cors({ origin: ["http://localhost:5173"] }))
  .use(swagger())
  .get("/", () => ({ status: "ok" }))
  .get("/", (): ApiResponse<HealthCheck> => {
    return {
      data: { status: "ok" },
      message: "server running"
    }
  })
  .get("/users", async () => {
    const users = await prisma.user.findMany()
    const response: ApiResponse<User[]> = {
      data: users,
      message: "User list retrieved"
    }
    return response
  })
  .listen(3000);

console.log(`🦊 Backend → http://localhost:${app.server?.port}`);
console.log(`📖 Swagger → http://localhost:${app.server?.port}/swagger`);

export type App = typeof app;