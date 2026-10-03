import type { Category, Location } from './domain';
export type Staple = {
  name: string;
  aliases: string[];
  category: Category;
  unit: string;
  location: Location;
};
export const staples: Staple[] = [
  {
    name: 'Rice',
    aliases: ['chawal', 'arisi'],
    category: 'Grains',
    unit: 'kg',
    location: 'Pantry',
  },
  {
    name: 'Atta',
    aliases: ['wheat flour', 'godhumai'],
    category: 'Grains',
    unit: 'kg',
    location: 'Pantry',
  },
  {
    name: 'Toor dal',
    aliases: ['arhar', 'tur dal', 'thuvaram paruppu'],
    category: 'Protein',
    unit: 'kg',
    location: 'Pantry',
  },
  {
    name: 'Urad dal',
    aliases: ['ulundhu', 'black gram'],
    category: 'Protein',
    unit: 'g',
    location: 'Pantry',
  },
  {
    name: 'Moong dal',
    aliases: ['mung', 'pasi paruppu'],
    category: 'Protein',
    unit: 'g',
    location: 'Pantry',
  },
  {
    name: 'Jeera',
    aliases: ['cumin', 'seeragam'],
    category: 'Other',
    unit: 'g',
    location: 'Pantry',
  },
  {
    name: 'Haldi',
    aliases: ['turmeric', 'manjal'],
    category: 'Other',
    unit: 'g',
    location: 'Pantry',
  },
  {
    name: 'Cooking oil',
    aliases: ['tel', 'ennai'],
    category: 'Other',
    unit: 'l',
    location: 'Pantry',
  },
  { name: 'Ghee', aliases: ['nei'], category: 'Dairy & eggs', unit: 'g', location: 'Pantry' },
  {
    name: 'Milk',
    aliases: ['doodh', 'paal'],
    category: 'Dairy & eggs',
    unit: 'l',
    location: 'Fridge',
  },
  {
    name: 'Curd',
    aliases: ['dahi', 'thayir'],
    category: 'Dairy & eggs',
    unit: 'g',
    location: 'Fridge',
  },
  {
    name: 'Idli / dosa batter',
    aliases: ['maavu', 'batter'],
    category: 'Grains',
    unit: 'kg',
    location: 'Fridge',
  },
  {
    name: 'Coriander',
    aliases: ['dhaniya leaves', 'kothamalli'],
    category: 'Produce',
    unit: 'bunch',
    location: 'Fridge',
  },
  {
    name: 'Tomatoes',
    aliases: ['tamatar', 'thakkali'],
    category: 'Produce',
    unit: 'kg',
    location: 'Fridge',
  },
  {
    name: 'Onions',
    aliases: ['pyaz', 'vengayam'],
    category: 'Produce',
    unit: 'kg',
    location: 'Pantry',
  },
  {
    name: 'Eggs',
    aliases: ['anda', 'muttai'],
    category: 'Dairy & eggs',
    unit: 'pcs',
    location: 'Fridge',
  },
];
export const units = ['g', 'kg', 'ml', 'l', 'pcs', 'packs', 'bunch', 'dozen'];
export function matchesIngredient(name: string, query: string): boolean {
  const clean = query.trim().toLowerCase();
  if (name.toLowerCase().includes(clean)) return true;
  return staples.some(
    (s) => s.name.toLowerCase() === name.toLowerCase() && s.aliases.some((a) => a.includes(clean)),
  );
}
