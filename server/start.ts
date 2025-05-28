const TARGET_ENVIRONMENT = Deno.env.get("TARGET_ENVIRONMENT");
const MIGRATIONS_DIR = "./better-auth_migrations";
const BETTER_AUTH_CLI_BASE_CMD = ["deno", "run", "-A", "npm:@better-auth/cli"]; // -A for broad permissions for the CLI tool
const MAIN_APP_ENTRY_POINT = "main.ts";


if (import.meta.main) {
  main().catch((err) => {
    console.error("❌ Unhandled error in main execution:", err);
    Deno.exit(1);
  });
}

async function main() {
  const mode = TARGET_ENVIRONMENT?.toLowerCase();

  if (!mode || (mode !== "dev" && mode !== "prod")) {
    console.error(
      `❌ Invalid or unset ${TARGET_ENVIRONMENT} environment variable.
      Please set it to "dev" or "prod". Current value: "${TARGET_ENVIRONMENT}"`,
    );
    Deno.exit(1);
  }
  console.info(`Environment mode: ${mode}`);

  // Setup Better Auth
  console.info("🔧 Setting up Better Auth...");
  if (await isFirstRun()) {
    console.info("✨ First run detected - generating Better Auth migrations.");
    await runCommand(
      [...BETTER_AUTH_CLI_BASE_CMD, "generate", "-y"],
      "Better Auth migration generation",
    );
  }

  // Always run migrate to ensure DB is up to date
  await runCommand(
    [...BETTER_AUTH_CLI_BASE_CMD, "migrate", "-y"],
    "Better Auth database migration",
  );
  console.info("🔑 Better Auth setup complete.");

  // Start the main application
  console.info(`🚀 Starting main application in ${mode} mode...`);
  let mainAppCmd: string[];

  const baseAppPermissions = [
    "--allow-net", // For network access
    "--allow-read", // For reading files (e.g., config, static assets)
    "--allow-write", // For writing files (e.g., logs, cache)
    "--allow-env", // For accessing environment variables
    // Add more specific permissions if needed, e.g., --allow-env=VAR1,VAR2
  ];

  if (mode === "dev") {
    mainAppCmd = [
      "deno",
      "run",
      ...baseAppPermissions,
      "--watch", // Reload on file changes for development
      MAIN_APP_ENTRY_POINT,
    ];
  } else {
    // mode === "prod"
    mainAppCmd = ["deno", "run", ...baseAppPermissions, MAIN_APP_ENTRY_POINT];
  }

  // For the main application, we let this script's exit code be determined by
  // the app's exit code.
  // `runCommand` already handles exiting on failure for setup steps.
  // Here, we effectively "become" the main application process.
  console.info(`▶️ Executing: ${mainAppCmd.join(" ")}`);
  const process = new Deno.Command(mainAppCmd[0], {
    args: mainAppCmd.slice(1),
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const child = process.spawn();
  const status = await child.status;

  if (!status.success) {
    console.error(`❌ Main application exited with error code: ${status.code}`);
  } else {
    console.info("🏁 Main application finished successfully.");
  }
  Deno.exit(status.code);
}

async function runCommand(cmd: string[], description: string): Promise<void> {
  console.info(`Running: ${description} (${cmd.join(" ")})`);
  try {
    const command = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });

    const status = await command.output();

    if (!status.success) {
      console.error(`❌ Failed: ${description}. Exit code: ${status.code}`);
      console.error("Stderr:", new TextDecoder().decode(status.stderr));
      Deno.exit(status.code);
    }
    console.info(`✅ Completed: ${description}`);
  } catch (error) {
    console.error(`❌ Error executing command for: ${description}`, error);
    Deno.exit(1); // Exit with a generic error code if Deno.Command itself fails
  }
}

// Checks if this is the first run by looking for .sql migration files.
// @returns true if none are found or the directory does not exist
async function isFirstRun(): Promise<boolean> {
  try {
    for await (const entry of Deno.readDir(MIGRATIONS_DIR)) {
      if (entry.isFile && entry.name.endsWith(".sql")) {
        // Found a migration file, not the first run
        console.info(
          `🔎 Found migration file: ${entry.name}. Not the first run.`,
        );
        return false;
      }
    }
    // No .sql files found in the directory, first run
    console.info(
      `📂 No .sql files found in ${MIGRATIONS_DIR}. Assuming first run.`,
    );
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // Directory doesn't exist, first run
      console.info(
        `📂 Migrations dir (${MIGRATIONS_DIR}) not found. Assuming first run.`,
      );
      return true;
    }
    // Other errors (e.g., permission denied) should be treated as problems
    console.error(
      `❌ Error checking for migrations in ${MIGRATIONS_DIR}:`,
      error,
    );
    throw error;
  }
}
