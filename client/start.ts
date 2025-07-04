const mode = Deno.env.get("TARGET_ENVIRONMENT");

let cmd: string[];

if (mode === "dev") {
  console.log("Starting in development mode");
  cmd = ["deno", "task", "dev_host"];
} else if (mode === "prod") {
  console.log("Starting in production mode");
  cmd = ["deno", "task", "build"];
} else {
  console.error(
    "Unknown or unset TARGET_ENVIRONMENT value.\nPlease set the TARGET_ENVIRONMENT environment variable correctly.",
  );
  Deno.exit(1);
}

const process = new Deno.Command(cmd[0], {
  args: cmd.slice(1),
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const child = process.spawn();
const status = await child.status;

Deno.exit(status.code);
