import * as dotenv from "dotenv";

dotenv.config({
    path: './.env.local'
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts", // Change this to a relative path
    out: "./src/db/migrations",
    dbCredentials: {
        url: String(process.env.XATA_DATABASE_URL)
    }
});
