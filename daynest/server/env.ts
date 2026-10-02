import { config } from 'dotenv';
import { z } from 'zod';
import path from 'node:path';
// Server secrets use a separate file that Expo never loads automatically.
config({ path: path.resolve(process.cwd(), '.env.server'), quiet: true });
const postgresUrl = z
  .string()
  .url()
  .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'));
export function loadServerEnv() {
  const result = z
    .object({
      DATABASE_URL: postgresUrl,
      API_TOKEN: z.string().min(32),
      HOUSEHOLD_ID: z.string().min(1).max(100).default('personal'),
      PORT: z.coerce.number().int().min(1).max(65535).default(3001),
      HOST: z.string().default('127.0.0.1'),
      ALLOWED_ORIGINS: z.string().default('http://localhost:8081,http://localhost:8082'),
    })
    .safeParse(process.env);
  if (!result.success)
    throw new Error(
      `Invalid server configuration: ${result.error.issues.map((i) => i.path.join('.')).join(', ')}. See .env.server.example.`,
    );
  return result.data;
}
export function loadMigrationUrl() {
  const result = postgresUrl.safeParse(process.env.DATABASE_URL_UNPOOLED);
  if (!result.success) throw new Error('Set DATABASE_URL_UNPOOLED in .env.server for migrations.');
  if (new URL(result.data).hostname.includes('-pooler'))
    throw new Error('Migrations require the direct, non-pooled database URL.');
  return result.data;
}
