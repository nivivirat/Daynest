import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app';
import { sampleState } from '../src/domain';
import type { PantryStore, Snapshot } from '../server/store';

const token = 'test-only-token-with-at-least-32-characters';
function fixture() {
  let snapshot: Snapshot = { state: { items: [], shopping: [] }, version: 0 };
  const store: PantryStore = {
    async read() {
      return snapshot;
    },
    async save(state, version) {
      if (version !== snapshot.version) return null;
      snapshot = { state, version: version + 1 };
      return snapshot;
    },
  };
  return createApp(store, token, ['http://localhost:8081']);
}
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
test('API requires authentication before reading or changing data', async () => {
  const app = fixture();
  assert.equal((await app.request('/v1/state')).status, 401);
  assert.equal((await app.request('/v1/state', { method: 'PUT', body: '{}' })).status, 401);
  assert.equal(
    (await app.request('/v1/state', { headers: { Authorization: 'Bearer wrong' } })).status,
    401,
  );
});
test('API saves validated state and prevents stale-device overwrite', async () => {
  const app = fixture();
  const request = () =>
    app.request('/v1/state', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ state: sampleState(), version: 0 }),
    });
  assert.equal((await request()).status, 200);
  assert.equal((await request()).status, 409);
  const response = await app.request('/v1/state', { headers });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  const saved = await response.json();
  assert.equal(saved.version, 1);
  assert.equal(saved.state.items.length, 6);
});
test('API rejects malformed bodies and invalid inventory', async () => {
  const app = fixture();
  assert.equal(
    (await app.request('/v1/state', { method: 'PUT', headers, body: '{broken' })).status,
    400,
  );
  const state = sampleState();
  state.items[0].quantity = -3;
  assert.equal(
    (
      await app.request('/v1/state', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ state, version: 0 }),
      })
    ).status,
    400,
  );
});
test('CORS does not grant access to an unlisted website', async () => {
  const response = await fixture().request('/v1/state', {
    method: 'OPTIONS',
    headers: { Origin: 'https://untrusted.example', 'Access-Control-Request-Method': 'PUT' },
  });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});
