import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subtractAmount, dateInput, sampleState } from '../src/domain';
import { matchesIngredient } from '../src/catalog';
test('metric consumption converts compatible units without changing the stock unit', () => {
  const item = { ...sampleState().items[0], quantity: 2, unit: 'kg' };
  assert.equal(subtractAmount(item, 250, 'g').quantity, 1.75);
  assert.equal(item.quantity, 2);
  assert.equal(subtractAmount({ ...item, unit: 'l' }, 200, 'ml').quantity, 1.8);
  assert.throws(() => subtractAmount(item, 2500, 'g'));
  assert.throws(() => subtractAmount(item, 1, 'ml'));
  assert.throws(() => subtractAmount(item, -1, 'kg'));
  assert.throws(() => subtractAmount(item, NaN, 'kg'));
});
test('regional aliases find canonical ingredients without unrelated matches', () => {
  assert.equal(matchesIngredient('Toor dal', 'arhar'), true);
  assert.equal(matchesIngredient('Urad dal', 'ulundhu'), true);
  assert.equal(matchesIngredient('Milk', 'rice'), false);
  assert.equal(matchesIngredient('My homemade chutney', 'chutney'), true);
});
test('Indian date input preserves the day and month', () => {
  assert.equal(dateInput('03/10/2026'), '2026-10-03');
  assert.equal(dateInput('2026-10-03'), '2026-10-03');
});
