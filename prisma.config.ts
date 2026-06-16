import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrate/CLI commands need session-mode (advisory locks); the app's runtime
    // Prisma Client connects separately via DATABASE_URL's transaction-mode pooler.
    url: process.env["DIRECT_URL"]!,
  },
});
