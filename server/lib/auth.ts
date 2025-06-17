import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pgUser = Deno.env.get("POSTGRES_USER");
const pgPassword = Deno.env.get("POSTGRES_PASSWORD");
const pgDatabase = Deno.env.get("POSTGRES_DB");
const pgHostname = Deno.env.get("POSTGRES_HOSTNAME");
const pgPort = Deno.env.get("POSTGRES_PORT");
const connectionString = `postgresql://${pgUser}:${pgPassword}@${pgHostname}:${pgPort}/${pgDatabase}`

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
