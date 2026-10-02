import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import type { Pool } from 'pg';
import { postgresStore } from '../server/store';
import { sampleState } from '../src/domain';

test('PostgreSQL migration, roundtrip, household isolation, and version conflicts', async () => {
  const db = new PGlite();
  try {
    await db.exec(await readFile(path.resolve('server/migrations/001_initial.sql'), 'utf8'));
    // Exercise production SQL against embedded PostgreSQL, adapting only the client transport.
    const client = {
      query: async (sql: string, params?: unknown[]) => {
        const result = await db.query(sql, params);
        return { rows: result.rows, rowCount: result.affectedRows };
      },
      release() {},
    };
    const pool = { connect: async () => client } as unknown as Pool;
    const store = postgresStore(pool, 'test-household');
    const other = postgresStore(pool, 'other-household');
    assert.deepEqual(await store.read(), { state: { items: [], shopping: [] }, version: 0 });
    const sample = sampleState();
    const first = await store.save(sample, 0);
    assert.equal(first?.version, 1);
    assert.deepEqual((await store.read()).state, sample);
    assert.equal(await store.save({ items: [], shopping: [] }, 0), null);
    assert.deepEqual((await store.read()).state, sample);
    assert.deepEqual((await other.read()).state, { items: [], shopping: [] });
    assert.equal((await store.save({ items: [], shopping: [] }, 1))?.version, 2);
    assert.deepEqual((await store.read()).state, { items: [], shopping: [] });
    await assert.rejects(() =>
      db.query(
        "INSERT INTO daynest_inventory(household_id,id,name,category,location,quantity,unit,low_at,position) VALUES ('test-household','bad','Bad','Produce','Fridge',-1,'pcs',0,0)",
      ),
    );
  } finally {
    await db.close();
  }
});
