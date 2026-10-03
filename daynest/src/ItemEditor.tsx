import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { categories, Category, dateInput, id, Item, locations, Location } from './domain';
import { staples, units } from './catalog';
import { itemSchema } from './schema';
import { Button, Field, Glyph, s } from './ui';
export function ItemEditor({
  item,
  initialName = '',
  onSave,
  onClose,
  onDelete,
}: {
  item: Item | null;
  initialName?: string;
  onSave: (item: Item) => void;
  onClose: () => void;
  onDelete: (item: Item) => void;
}) {
  const [name, setName] = useState(item?.name ?? initialName);
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1));
  const preset = staples.find((s) => s.name.toLowerCase() === initialName.toLowerCase());
  const [unit, setUnit] = useState(item?.unit ?? preset?.unit ?? 'kg');
  const [category, setCategory] = useState<Category>(
    item?.category ?? preset?.category ?? 'Produce',
  );
  const [location, setLocation] = useState<Location>(
    item?.location ?? preset?.location ?? 'Pantry',
  );
  const [expires, setExpires] = useState(
    item?.expires ? item.expires.split('-').reverse().join('/') : '',
  );
  const [lowAt, setLowAt] = useState(String(item?.lowAt ?? 0));
  const [details, setDetails] = useState(Boolean(item));
  const [error, setError] = useState('');
  function save() {
    if (!quantity.trim() || !lowAt.trim()) {
      setError('Enter a quantity and low-stock threshold.');
      return;
    }
    const result = itemSchema.safeParse({
      id: item?.id ?? id(),
      name,
      quantity: Number(quantity),
      unit,
      category,
      location,
      expires: dateInput(expires) || null,
      lowAt: Number(lowAt),
    });
    if (!result.success) {
      setError(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'));
      return;
    }
    onSave(result.data);
  }
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.overlay}
      >
        <View style={s.dialog}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>{item ? 'Edit kitchen item' : 'Add to your kitchen'}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close item form"
              style={s.iconButton}
              onPress={onClose}
            >
              <Glyph name="close" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 24, gap: 20 }}
          >
            <Field
              label="Item name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Atta, milk, toor dal"
            />
            {!item && (
              <View style={{ gap: 10 }}>
                <Text style={s.small}>Indian kitchen essentials � tap to fill</Text>
                <View style={[s.row, { flexWrap: 'wrap' }]}>
                  {staples
                    .filter(
                      (staple) =>
                        !name ||
                        staple.name.toLowerCase().includes(name.toLowerCase()) ||
                        staple.aliases.some((alias) => alias.includes(name.toLowerCase())),
                    )
                    .slice(0, 8)
                    .map((staple) => (
                      <Pressable
                        key={staple.name}
                        accessibilityRole="button"
                        style={s.chip}
                        onPress={() => {
                          setName(staple.name);
                          setUnit(staple.unit);
                          setCategory(staple.category);
                          setLocation(staple.location);
                          setQuantity(staple.unit === 'g' ? '250' : '1');
                        }}
                      >
                        <Text style={s.chipText}>{staple.name}</Text>
                      </Pressable>
                    ))}
                </View>
              </View>
            )}
            <View style={s.row}>
              <Field label="Quantity" value={quantity} onChangeText={setQuantity} numeric />
              <Field
                label="Unit"
                value={unit}
                onChangeText={setUnit}
                placeholder="kg, g, l, pieces"
              />
            </View>
            <View style={[s.row, { flexWrap: 'wrap' }]}>
              {units.map((u) => (
                <Pressable
                  key={u}
                  accessibilityRole="button"
                  accessibilityState={{ selected: unit === u }}
                  style={[s.chip, unit === u && s.chipActive]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={s.chipText}>{u}</Text>
                </Pressable>
              ))}
            </View>
            <Button
              label={details ? 'Hide optional details' : 'Set location, date & low-stock alert'}
              secondary
              onPress={() => setDetails(!details)}
            />
            <Text style={s.small}>
              Stored in {location}. Dates are optional; use the date on your package.
            </Text>
            {details && (
              <>
                <Text style={s.label}>Category</Text>
                <View style={[s.row, { flexWrap: 'wrap', marginTop: -10 }]}>
                  {categories.map((c) => (
                    <Pressable
                      key={c}
                      accessibilityRole="button"
                      accessibilityState={{ selected: c === category }}
                      onPress={() => setCategory(c)}
                      style={[s.chip, c === category && s.chipActive]}
                    >
                      <Text style={[s.chipText, c === category && { color: 'white' }]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={s.label}>Storage location</Text>
                <View style={[s.row, { flexWrap: 'wrap', marginTop: -10 }]}>
                  {locations.map((l) => (
                    <Pressable
                      key={l}
                      accessibilityRole="button"
                      accessibilityState={{ selected: l === location }}
                      onPress={() => setLocation(l)}
                      style={[s.chip, l === location && s.chipActive]}
                    >
                      <Text style={[s.chipText, l === location && { color: 'white' }]}>{l}</Text>
                    </Pressable>
                  ))}
                </View>
                <Field
                  label="Expiry date (optional)"
                  value={expires}
                  onChangeText={setExpires}
                  placeholder="DD/MM/YYYY"
                />
                <Field label="Low-stock threshold" value={lowAt} onChangeText={setLowAt} numeric />
                <Text style={s.small}>
                  An item is low in stock when its quantity reaches this amount.
                </Text>
              </>
            )}
            {error !== '' && (
              <Text accessibilityRole="alert" style={s.error}>
                {error}
              </Text>
            )}
            <Button
              label={item ? 'Save changes' : 'Add to my kitchen'}
              onPress={save}
              icon="checkmark"
            />
            {item && <Button label="Remove item" secondary onPress={() => onDelete(item)} />}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
