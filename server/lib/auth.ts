import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString = Deno.env.get("DATABASE_URL");

export const auth = betterAuth({
  database: new Pool({
    connectionString,
  }),
  socialProviders: {
    github: {
      clientId: Deno.env.get("GITHUB_CLIENT_ID") as string,
      clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET") as string,
    },
    discord: {
      clientId: Deno.env.get("DISCORD_CLIENT_ID") as string,
      clientSecret: Deno.env.get("DISCORD_CLIENT_SECRET") as string,
    },
  },
});
