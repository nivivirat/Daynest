import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cloudRequest } from '../src/cloud';

test('cloud client surfaces conflicts without retrying or overwriting', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls++;
    return new Response('{}', { status: 409 });
  });
  await assert.rejects(
    () =>
      cloudRequest(
        { url: 'https://api.example.com', token: 'test' },
        { items: [], shopping: [] },
        1,
      ),
    /Another device/,
  );
  assert.equal(calls, 1);
});
test('cloud client validates cloud state before a caller can replace local data', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(JSON.stringify({ version: 1, state: { items: 'bad', shopping: [] } })),
  );
  await assert.rejects(() => cloudRequest({ url: 'https://api.example.com', token: 'test' }));
});
test('cloud client requires an explicit URL and access token', async () => {
  await assert.rejects(() => cloudRequest({ url: 'invalid', token: 'test' }), /API URL/);
  await assert.rejects(() => cloudRequest({ url: 'https://api.example.com', token: '' }), /token/);
});
