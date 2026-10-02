import { serve } from '@hono/node-server';
import { Pool } from 'pg';
import { createApp } from './app';
import { loadServerEnv } from './env';
import { postgresStore } from './store';
const env = loadServerEnv();
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  statement_timeout: 10000,
});
pool.on('error', () => console.error('Database connection interrupted'));
const app = createApp(
  postgresStore(pool, env.HOUSEHOLD_ID),
  env.API_TOKEN,
  env.ALLOWED_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);
const server = serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST }, () =>
  console.info(`Daynest API listening on port ${env.PORT}`),
);
async function shutdown() {
  server.close();
  await pool.end();
}
process.once('SIGINT', () => {
  void shutdown();
});
process.once('SIGTERM', () => {
  void shutdown();
});
