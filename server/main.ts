import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());
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

app.get("/api/test", (c) => c.json(test));
app.get("/*", serveStatic({ root: "./client" }));

Deno.serve(app.fetch);
