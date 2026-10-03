export const categories = ['Produce', 'Dairy & eggs', 'Grains', 'Protein', 'Other'] as const;
export const locations = ['Fridge', 'Pantry', 'Freezer'] as const;
export type Category = (typeof categories)[number];
export type Location = (typeof locations)[number];
export type Item = {
  id: string;
  name: string;
  category: Category;
  location: Location;
  quantity: number;
  unit: string;
  lowAt: number;
  expires: string | null;
};
export type ShoppingItem = { id: string; name: string; checked: boolean };
export type PantryState = { items: Item[]; shopping: ShoppingItem[] };

export const iconFor: Record<Category, string> = {
  Produce: '🥬',
  'Dairy & eggs': '🥛',
  Grains: '🌾',
  Protein: '🥚',
  Other: '🫙',
};
export function id() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
export function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00`);
  return !Number.isNaN(d.getTime()) && dayKey(d) === value;
}
export function daysUntil(value: string | null, now = new Date()): number | null {
  if (!value || !validDate(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  return Math.round(
    (Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000,
  );
}
export function expiryLabel(value: string | null): string {
  const days = daysUntil(value);
  if (days === null) return 'No expiry set';
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `Expires in ${days} days`;
}
export function consume(item: Item, amount = 1): Item {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a positive amount.');
  return { ...item, quantity: Math.max(0, Math.round((item.quantity - amount) * 1000) / 1000) };
}
export function subtractAmount(item: Item, amount: number, unit: string): Item {
  const factors: Record<string, number> = { g: 1, kg: 1000, ml: 1, l: 1000 };
  const group = (u: string) =>
    ['g', 'kg'].includes(u) ? 'mass' : ['ml', 'l'].includes(u) ? 'volume' : u;
  if (group(unit) !== group(item.unit)) throw new Error('Choose a compatible unit.');
  const converted = (amount * (factors[unit] ?? 1)) / (factors[item.unit] ?? 1);
  if (!Number.isFinite(converted) || converted <= 0 || converted > item.quantity)
    throw new Error('Enter an amount within your available stock.');
  return consume(item, converted);
}
export function dateInput(value: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value.trim();
}
export function addShopping(state: PantryState, name: string): PantryState {
  const clean = name.trim();
  if (
    !clean ||
    state.shopping.some((i) => !i.checked && i.name.toLowerCase() === clean.toLowerCase())
  )
    return state;
  return { ...state, shopping: [...state.shopping, { id: id(), name: clean, checked: false }] };
}
export function sampleState(): PantryState {
  const date = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return dayKey(d);
  };
  return {
    items: [
      {
        id: id(),
        name: 'Coriander',
        category: 'Produce',
        location: 'Fridge',
        quantity: 1,
        unit: 'bunch',
        lowAt: 0,
        expires: date(1),
      },
      {
        id: id(),
        name: 'Curd',
        category: 'Dairy & eggs',
        location: 'Fridge',
        quantity: 2,
        unit: 'packs',
        lowAt: 1,
        expires: date(3),
      },
      {
        id: id(),
        name: 'Tomatoes',
        category: 'Produce',
        location: 'Fridge',
        quantity: 1,
        unit: 'kg',
        lowAt: 0,
        expires: date(5),
      },
      {
        id: id(),
        name: 'Milk',
        category: 'Dairy & eggs',
        location: 'Fridge',
        quantity: 1,
        unit: 'l',
        lowAt: 1,
        expires: date(7),
      },
      {
        id: id(),
        name: 'Rice',
        category: 'Grains',
        location: 'Pantry',
        quantity: 2,
        unit: 'kg',
        lowAt: 0.5,
        expires: date(90),
      },
      {
        id: id(),
        name: 'Atta',
        category: 'Grains',
        location: 'Pantry',
        quantity: 2,
        unit: 'kg',
        lowAt: 3,
        expires: null,
      },
    ],
    shopping: [
      { id: id(), name: 'Toor dal', checked: false },
      { id: id(), name: 'Cooking oil', checked: false },
    ],
  };
}
