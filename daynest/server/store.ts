import type { PantryState } from '../src/domain';
import { stateSchema } from '../src/schema';
import type { Pool } from 'pg';

export type Snapshot = { state: PantryState; version: number };
export interface PantryStore {
  read(): Promise<Snapshot>;
  save(state: PantryState, expectedVersion: number): Promise<Snapshot | null>;
}

/** A server instance owns one personal household. Clients never choose the scope. */
export function postgresStore(pool: Pool, householdId: string): PantryStore {
  return {
    async read() {
      const client = await pool.connect();
      try {
        // One consistent snapshot even if another device saves between these queries.
        await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
        const household = await client.query(
          'SELECT version FROM daynest_households WHERE id = $1',
          [householdId],
        );
        const items = await client.query(
          `SELECT id, name, category, location, quantity::float8 AS quantity, unit,
          low_at::float8 AS "lowAt", to_char(expires, 'YYYY-MM-DD') AS expires
          FROM daynest_inventory WHERE household_id = $1 ORDER BY position`,
          [householdId],
        );
        const shopping = await client.query(
          'SELECT id, name, checked FROM daynest_shopping WHERE household_id = $1 ORDER BY position',
          [householdId],
        );
        await client.query('COMMIT');
        return {
          state: stateSchema.parse({ items: items.rows, shopping: shopping.rows }),
          version: household.rows[0]?.version ?? 0,
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
    async save(state, expectedVersion) {
      const validated = stateSchema.parse(state);
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO daynest_households(id) VALUES ($1) ON CONFLICT DO NOTHING',
          [householdId],
        );
        const result = await client.query(
          `UPDATE daynest_households SET version = version + 1, updated_at = now()
          WHERE id = $1 AND version = $2 RETURNING version`,
          [householdId, expectedVersion],
        );
        if (!result.rowCount) {
          await client.query('ROLLBACK');
          return null;
        }
        // Manual snapshot sync is atomic: no partial pantry writes or lost updates.
        await client.query('DELETE FROM daynest_inventory WHERE household_id = $1', [householdId]);
        await client.query('DELETE FROM daynest_shopping WHERE household_id = $1', [householdId]);
        await client.query(
          `INSERT INTO daynest_inventory(household_id, id, name, category, location, quantity, unit, low_at, expires, position)
          SELECT $1, x.id, x.name, x.category, x.location, x.quantity, x.unit, x."lowAt", x.expires::date, x.position
          FROM jsonb_to_recordset($2::jsonb) AS x(id text, name text, category text, location text, quantity numeric, unit text, "lowAt" numeric, expires text, position integer)`,
          [
            householdId,
            JSON.stringify(validated.items.map((item, position) => ({ ...item, position }))),
          ],
        );
        await client.query(
          `INSERT INTO daynest_shopping(household_id, id, name, checked, position)
          SELECT $1, x.id, x.name, x.checked, x.position
          FROM jsonb_to_recordset($2::jsonb) AS x(id text, name text, checked boolean, position integer)`,
          [
            householdId,
            JSON.stringify(validated.shopping.map((item, position) => ({ ...item, position }))),
          ],
        );
        await client.query('COMMIT');
        return { state: validated, version: result.rows[0].version };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
