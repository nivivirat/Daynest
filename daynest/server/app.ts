import { createHash, timingSafeEqual } from 'node:crypto';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { secureHeaders } from 'hono/secure-headers';
import { z } from 'zod';
import { stateSchema } from '../src/schema';
import type { PantryStore } from './store';

export function createApp(store: PantryStore, apiToken: string, allowedOrigins: string[]) {
  if (apiToken.length < 32) throw new Error('API_TOKEN must have at least 32 characters.');
  const expected = createHash('sha256').update(apiToken).digest();
  const app = new Hono();
  app.use('*', secureHeaders());
  app.use(
    '*',
    cors({
      origin: (origin) => (allowedOrigins.includes(origin) ? origin : ''),
      allowMethods: ['GET', 'PUT', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.get('/health', (c) => c.json({ status: 'ok', service: 'daynest' }));
  app.use('/v1/*', async (c, next) => {
    c.header('Cache-Control', 'no-store');
    const authorization = c.req.header('Authorization') ?? '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token || !timingSafeEqual(createHash('sha256').update(token).digest(), expected))
      return c.json({ error: 'Unauthorized' }, 401);
    await next();
  });
  app.use(
    '/v1/*',
    bodyLimit({
      maxSize: 2 * 1024 * 1024,
      onError: (c) => c.json({ error: 'Request too large' }, 413),
    }),
  );
  app.get('/v1/state', async (c) => c.json(await store.read()));
  app.put('/v1/state', async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON' }, 400);
    }
    const result = z
      .object({ state: stateSchema, version: z.number().int().min(0).max(2147483646) })
      .safeParse(body);
    if (!result.success)
      return c.json(
        {
          error: 'Invalid pantry data',
          issues: result.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
        400,
      );
    const saved = await store.save(result.data.state, result.data.version);
    return saved
      ? c.json(saved)
      : c.json({ error: 'Version conflict. Reload before saving.' }, 409);
  });
  app.onError((_error, c) => {
    // Do not return connection strings, SQL errors, tokens, or household data.
    console.error('Daynest API request failed');
    return c.json({ error: 'Service temporarily unavailable' }, 503);
  });
  return app;
}
