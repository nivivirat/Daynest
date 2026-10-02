import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addShopping, consume, daysUntil, sampleState, validDate } from '../src/domain';
import { stateSchema } from '../src/schema';

test('expiry calculations use calendar days, not elapsed hours', () => {
  assert.equal(daysUntil('2026-10-03', new Date(2026, 9, 2, 23, 59)), 1);
  assert.equal(daysUntil('2026-10-01', new Date(2026, 9, 2, 0, 1)), -1);
  assert.equal(daysUntil(null), null);
  assert.equal(validDate('2026-02-29'), false);
  assert.equal(validDate('2028-02-29'), true);
  assert.equal(validDate('2026-13-01'), false);
});
test('consumption never makes inventory negative', () => {
  const item = { ...sampleState().items[0], quantity: 0.2 };
  assert.equal(consume(item).quantity, 0);
  assert.equal(item.quantity, 0.2);
});
test('shopping list deduplicates pending items but allows repurchase', () => {
  const state = addShopping({ items: [], shopping: [] }, ' Milk ');
  assert.equal(addShopping(state, 'milk').shopping.length, 1);
  state.shopping[0].checked = true;
  assert.equal(addShopping(state, 'Milk').shopping.length, 2);
});
test('shared schema rejects invalid quantities, dates, and duplicate identifiers', () => {
  const state = sampleState();
  assert.equal(stateSchema.safeParse(state).success, true);
  assert.equal(
    stateSchema.safeParse({ ...state, items: [{ ...state.items[0], quantity: -1 }] }).success,
    false,
  );
  assert.equal(
    stateSchema.safeParse({ ...state, items: [{ ...state.items[0], expires: '2026-02-30' }] })
      .success,
    false,
  );
  assert.equal(
    stateSchema.safeParse({ ...state, items: [state.items[0], state.items[0]] }).success,
    false,
  );
});
