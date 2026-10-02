import { z } from 'zod';
import { categories, locations, validDate } from './domain';

export const itemSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  category: z.enum(categories),
  location: z.enum(locations),
  quantity: z.number().finite().min(0).max(100000),
  unit: z.string().trim().min(1).max(30),
  lowAt: z.number().finite().min(0).max(100000),
  expires: z.string().refine(validDate, 'Use a real date in YYYY-MM-DD format').nullable(),
});
export const stateSchema = z
  .object({
    items: z.array(itemSchema).max(5000),
    shopping: z
      .array(
        z.object({
          id: z.string().min(1).max(100),
          name: z.string().trim().min(1).max(100),
          checked: z.boolean(),
        }),
      )
      .max(5000),
  })
  .refine(
    (s) =>
      new Set(s.items.map((i) => i.id)).size === s.items.length &&
      new Set(s.shopping.map((i) => i.id)).size === s.shopping.length,
    'Duplicate IDs are not allowed',
  );
