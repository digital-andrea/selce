import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth.ts";

const app = new Hono();
app.use(logger());
app.use("/api/auth/**", cors());

app.use(csrf());

const test = {
  menu: {
    id: "file",
    value: "File",
    popup: {
      menuitem: [
        { value: "New", onclick: "CreateNewDoc()" },
        { value: "Open", onclick: "OpenDoc()" },
        { value: "Close", onclick: "CloseDoc()" },
      ],
    },
  },
};
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.get("/api/test", (c) => c.json(test));
app.get("/*", serveStatic({ root: "./public" }));

Deno.serve(app.fetch);
