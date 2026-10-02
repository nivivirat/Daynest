import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { Client } from 'pg';
import { loadMigrationUrl } from './env';

async function migrate() {
  const client = new Client({
    connectionString: loadMigrationUrl(),
    connectionTimeoutMillis: 10000,
    statement_timeout: 30000,
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(7264931)');
    await client.query(
      'CREATE TABLE IF NOT EXISTS daynest_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())',
    );
    const directory = path.resolve(process.cwd(), 'server/migrations');
    for (const name of (await readdir(directory)).filter((n) => n.endsWith('.sql')).sort()) {
      const sql = await readFile(path.join(directory, name), 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const previous = await client.query(
        'SELECT checksum FROM daynest_migrations WHERE name = $1',
        [name],
      );
      if (previous.rowCount) {
        if (previous.rows[0].checksum !== checksum)
          throw new Error(`Previously applied migration changed: ${name}`);
        continue;
      }
      await client.query(sql);
      await client.query('INSERT INTO daynest_migrations(name, checksum) VALUES ($1, $2)', [
        name,
        checksum,
      ]);
      console.info(`Applied ${name}`);
    }
    await client.query('COMMIT');
    console.info('Migrations complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}
migrate().catch(() => {
  console.error(
    'Migration failed. Check the direct connection URL and migration history; no partial migration was committed.',
  );
  process.exitCode = 1;
});
