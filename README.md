# Daynest

**Your everyday, a little easier.** A React Native app for keeping a household kitchen organized, built with Expo and a Neon-compatible PostgreSQL backend.

The first version includes inventory CRUD, quantities and storage locations, expiry and low-stock filters, shopping lists, persistent device storage, and optional manual cloud saves. It starts empty; sample data is opt-in. AI, receipt scanning, medicine tracking, and scheduled notifications are future work.

## Run the app

Requires Node.js 22.13+ (Node 24 recommended) and npm.

```sh
cd daynest
npm ci
# Copy .env.example to .env, then edit the public API URL if needed.
npm run web
# Or start the mobile development server:
npm start
```

Use an Expo Go version compatible with the project's SDK, or a development build. A phone needs the computer's LAN address instead of `localhost`. Android/iOS native runtime behavior should be checked on physical devices before release.

## Connect Neon

Daynest talks to a TypeScript API, which talks to PostgreSQL. Database credentials are never put into React Native code or `EXPO_PUBLIC_*` variables.

1. Sign in to the Neon CLI with `npx neon@latest login`, or authorize the installed Neon MCP OAuth connection in Codex.
2. Select your existing Neon project and create a development branch. No live project or database was provisioned by this scaffold.
3. Copy `daynest/.env.server.example` to `daynest/.env.server`. Set the pooled `DATABASE_URL` for the API and direct `DATABASE_URL_UNPOOLED` for migrations. Preserve TLS certificate verification.
4. Generate a personal API token using the command in that example. Keep it in `.env.server` and enter it in the app's Settings screen. Never prefix it with `EXPO_PUBLIC_`.
5. From `daynest/`, run `npm run db:migrate`, then `npm run api`.
6. In Daynest Settings, enter the API URL and token. Use **Save to Neon** to upload to an empty cloud pantry, or **Load from Neon** to use an existing one. Loading asks before replacing local data. Changes remain local until explicitly saved.

The server defaults to loopback. For phone testing on a trusted LAN, set `HOST=0.0.0.0` and use the computer's LAN address in the app. Use HTTPS for a deployed API. CORS origins are an explicit comma-separated allowlist.

This initial backend is a **personal, single-household prototype** with one server-configured access token. It is not a multiuser login system. Introduce verified user sessions and household membership authorization before opening it to multiple households. Tokens are kept in memory only; the app asks for them again after restart.

## Environment separation

| File | Purpose | Committed? |
| --- | --- | --- |
| `.env.example` | Public mobile/web API URL template | Yes |
| `.env` | Public local app configuration | No |
| `.env.server.example` | Documented server configuration placeholders | Yes |
| `.env.server` | Database URLs, API token, server configuration | No |
| `.neon` | Local Neon project/branch selection | No |

All paths above are relative to `daynest/`. Server code explicitly loads `.env.server`; Expo never loads that filename automatically. Production hosts can inject the same server variables directly. Startup validates configuration without printing secrets.

## Project structure

```text
daynest/
  src/app/             Expo Router routes and shared provider layout
  src/                 Feature UI, domain rules, schemas, local storage, cloud client
  server/              Hono HTTP API, environment validation, PostgreSQL repository
  server/migrations/   Versioned SQL migrations with checksum tracking
  tests/               Domain, API, and embedded PostgreSQL integration tests
.agents/skills/        Neon and neon-postgres project skills
.github/workflows/    CI checks and web export
```

Cloud saves use an optimistic version check and a database transaction. Conflicting device saves return HTTP 409 rather than overwriting newer data. The API chooses the household from server configuration, not a client-supplied ID. It validates all inputs and limits request size; secrets and database errors are never returned to the client.

For this small prototype, saving sends the complete inventory and shopping snapshot, stored in relational tables in one transaction. Before supporting large inventories or continuous multi-device editing, replace snapshot sync with per-record mutations, idempotent operations, and conflict resolution.

## Quality checks

```sh
cd daynest
npm run check
npx expo export --platform web
```

`check` runs TypeScript, ESLint, tests, and formatting checks. Database tests run real PostgreSQL SQL in PGlite without needing cloud credentials. They verify migrations, persistence, household isolation, and version conflicts. They do not verify Neon credentials, network access, or deployment.

## Neon tooling setup

The requested `neon` and `neon-postgres` skills are installed at project scope and tracked with `skills-lock.json`. The official Neon skill was also fetched and reviewed. A missing Neon MCP entry was installed in the local `.codex/config.toml` using OAuth; global Codex configuration was preserved. Local MCP configuration is ignored by Git.

To reproduce the tooling setup in another checkout:

```sh
npx neon@latest skills -s neon -s neon-postgres -y
npx neon@latest mcp --oauth --project --agent codex -y
```

Installing tooling does not authenticate an account. Reload the Codex project if the MCP tools are not available, then complete OAuth sign-in. No API key was minted by the MCP installer.

## Dependency status

The initial Expo dependency audit reported advisories inherited through its CLI/native-build tooling (`node-forge` and the `xcode` dependency on `uuid`). The audit's suggested forced fix downgrades Expo across major versions; it was not applied. Recheck `npm audit` and update within supported Expo compatibility constraints before shipping native releases.

The Expo scaffold's MIT license is retained in `daynest/LICENSE`.
