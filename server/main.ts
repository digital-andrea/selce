import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { csrf } from "hono/csrf";

const app = new Hono();
app.use(csrf());

app.get("/*", serveStatic({ root: "./client" }));

Deno.serve(app.fetch);
