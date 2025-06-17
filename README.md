Selce
=====

_A full stack template to quickly deploy a web app, auth included_

- Fill in your `.env` file
- Run `docker compose up`
- Enjoy! You get auth, a database, HTTPS, backend, frontend, and Docker config.

## ✨ What's Inside

- **🫆 Authentication ready** - OAuth login out of the box (easy to add more)
- **🔥 Lightweight backend** - Hono server, built on web standards, with Deno
- **☄️ Flexible frontend** - Astro, so you can have your choice of framework(s)
- **🔒 Automatic HTTPS** - Caddy handles certificates, even on localhost
- **🗃️ Database included** - PostgreSQL, ready for your data
- **🐳 One-command deploy** - Docker Compose orchestrates everything

## 🚀 Quick Start

> [!TIP]
> On GitHub, you can use the `Use this template` button instead of cloning.

1. **Clone the template**

   ```bash
   git clone --depth=1 https://github.com/digital-andrea/selce.git my-new-app
   cd my-new-app
   rm -rf .git
   ```

2. **Set up your environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values (see configuration below)
   ```

3. **Launch everything**
   ```bash
   docker compose up
   ```

That's it! Your app is running with HTTPS, auth, and database ready to go.

## ⚙️ Configuration

You will need to add your own keys, URLs, and more as environment variables.
After copying `.env.example` to `.env`, configure these variables:

| Variable                | Description                     | Values                                                                                                                           |
| ----------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `TARGET_ENVIRONMENT`    | Deployment environment          | `dev` for development mode, `prod` for production. See below for information on the differences                                  |
| `BETTER_AUTH_SECRET`    | Secret key for auth tokens      | You can generate this with `openssl rand -base64 32` or through their [docs page](https://www.better-auth.com/docs/installation) |
| `BETTER_AUTH_URL`       | Your app's URL                  | `https://localhost` (dev) or `https://yourdomain.com`                                                                            |
| `GITHUB_CLIENT_ID`      | GitHub OAuth app ID             | Get it from [GitHub Developer Settings](https://github.com/settings/developers)                                                  |
| `GITHUB_CLIENT_SECRET`  | GitHub OAuth app secret         | Get it from your GitHub OAuth app                                                                                                |
| `DISCORD_CLIENT_ID`     | Discord OAuth app ID            | Get it from [Discord Developer Portal](https://discord.com/developers/applications)                                              |
| `DISCORD_CLIENT_SECRET` | Discord OAuth app secret        | Get it from your Discord OAuth app                                                                                               |
| `POSTGRES_USER`         | Database username               | Anything you like! :)                                                                                                            |
| `POSTGRES_PASSWORD`     | Database password               | Use a strong password                                                                                                            |
| `POSTGRES_DB`           | Database name                   | `my_db` (or whatever you prefer)                                                                                                 |
| `POSTGRES_URL`          | Full database connection string | `postgresql://user:password@db:5432/dbname`                                                                                      |

### Development vs production modes

#### Development Mode (TARGET_ENVIRONMENT=dev)

- Astro will spin up its own development server, offering dev tools and hot
  reloading (HMR).
- API routes are still served by Hono.
- Hono will automatically restart when it detects server file changes.
- Database admin page available at https://localhost/adminer

#### Production Mode (TARGET_ENVIRONMENT=prod)

- Astro builds static files once during startup
- Hono serves everything - both API routes and the built static frontend files

> [!NOTE]
> Docker syncs files so that they are mirrored instantly within the container,
regardless of mode, for simplicity and ease of use. This does not cause hot
reloading in production, as it is still up to Deno to watch for changes in the
file system, but it is still something to be aware of.

## Adding More Auth Providers

Selce uses [Better Auth](https://www.better-auth.com/docs) which supports many
OAuth providers, and even other auth flows like email and password.

Check their docs to see what's available and how to add them!

## 🏗️ Architecture

Development mode:
```
     ┌──────────┐
     │  Client  │
     └────┬─────┘
          │
          │
          │
┌─────────┴─────────┐
│       Caddy       │
│   Reverse proxy   │
│                   │
│       caddy       │
│     :80  :443     │
└─────────┬─────────┘
          │
          │                    ┌───────────────────┐
          │                    │       Astro       │
          ├─ Static content ───│    Dev server     │
          │                    │                   │
          │                    │     frontend      │
          │                    │       :4321       │
          │                    └─────────┬─────────┘
          │                              │
          │                    ┌─────────┴─────────┐      ┌───────────────────┐
          │                    │       Hono        │      │     Postgres      │
          ├─ /api/* routes ────┤      Server       │      │     Database      │
          │                    │                   ├──────┤                   │
          │                    │    hono-server    │      │        db         │
          │                    │       :8000       │      │   POSTGRES_PORT   │
          │                    └───────────────────┘      └─────────┬─────────┘
          │                                                         │
          │                                                         │
          │                                               ┌─────────┴─────────┐
          │                                               │      Adminer      │
          │                                               │   DB Management   │
          └─ /adminer ────────────────────────────────────┤                   │
                                                          │      adminer      │
                                                          │       :8080       │
                                                          └───────────────────┘
```

Production mode:
```
     ┌──────────┐
     │  Client  │
     └────┬─────┘
          │
          │
          │
┌─────────┴─────────┐
│       Caddy       │
│   Reverse proxy   │
│                   │
│       caddy       │
│     :80  :443     │
└─────────┬─────────┘
          │
          │                    ┌───────────────────┐
          │                    │       Astro       │
          │                    │   Static files    │
          │                    │                   │
          │                    │     frontend      │
          │                    │  Build step only  │
          │                    └─────────┬─────────┘
          │                              │
          │                    ┌─────────┴─────────┐      ┌───────────────────┐
          │                    │       Hono        │      │     Postgres      │
          └────────────────────┤      Server       │      │     Database      │
                               │                   ├──────┤                   │
                               │    hono-server    │      │        db         │
                               │       :8000       │      │   POSTGRES_PORT   │
                               └───────────────────┘      └─────────┬─────────┘
                                                                    │
                                                                    │
                                                          ┌─────────┴─────────┐
                                                          │      Adminer      │
                                                          │   DB Management   │
                                                          │                   │
                                                          │      adminer      │
                                                          │       :8080       │
                                                          └───────────────────┘
```

## 📁 Project Structure

```
selce/
├── client/          # Astro frontend
├── server/          # Hono backend
├── caddy/           # Caddy's reverse proxy config
├── compose.yaml     # Docker orchestration
└── .env.example     # Configuration template
```

## 🔒 HTTPS on Localhost

Caddy automatically generates certificates for HTTPS.
To achieve that in development mode, it signs its own certificates.
Your browser may refuse to display the site because of Caddy being an unknown
issuer. Remember Caddy lives inside a docker container, so it can't do the
right thing on your host operating system.
While your browser will typically offer an option to acknowledge the issue and
proceed anyway, you may sometimes be in the position of having to add this
certificate to a list of trusted sources manually.

You can find the certificate's location by querying docker for caddy's
mountpoint, and then descending through caddy's directories:
```sh
# Find where the caddy volume is mounted
# You may need to "sudo" the docker call, depending on your docker setup
caddy_mp=$(docker volume inspect --format '{{ .Mountpoint }}' selce_caddy_data)
# Build a full path to the directory containing the root certificate
certificate_path="${caddy_mp%/}/caddy/pki/authorities/local"

# You now have the right directory stored in the `certificate_path` var
echo $certificate_path
```

The path should look similar to this:
`/var/lib/docker/volumes/selce_caddy_data/_data/caddy/pki/authorities/local`

You are looking for the intermediate certificate.
Now you can optionally copy it out and allow it in your browser.
