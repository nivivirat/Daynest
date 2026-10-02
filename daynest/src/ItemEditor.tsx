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
import { categories, Category, id, Item, locations, Location } from './domain';
import { itemSchema } from './schema';
import { Button, Field, Glyph, s } from './ui';
export function ItemEditor({
  item,
  onSave,
  onClose,
  onDelete,
}: {
  item: Item | null;
  onSave: (item: Item) => void;
  onClose: () => void;
  onDelete: (item: Item) => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1));
  const [unit, setUnit] = useState(item?.unit ?? 'pcs');
  const [category, setCategory] = useState<Category>(item?.category ?? 'Produce');
  const [location, setLocation] = useState<Location>(item?.location ?? 'Fridge');
  const [expires, setExpires] = useState(item?.expires ?? '');
  const [lowAt, setLowAt] = useState(String(item?.lowAt ?? 0));
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
      expires: expires.trim() || null,
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
            <Text style={s.sectionTitle}>
              {item ? 'A little update' : 'Something for your shelf'}
            </Text>
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
              placeholder="e.g. Oat milk"
            />
            <View style={s.row}>
              <Field label="Quantity" value={quantity} onChangeText={setQuantity} numeric />
              <Field
                label="Unit"
                value={unit}
                onChangeText={setUnit}
                placeholder="kg, cartons, pieces"
              />
            </View>
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
              placeholder="YYYY-MM-DD"
            />
            <Field label="Low-stock threshold" value={lowAt} onChangeText={setLowAt} numeric />
            <Text style={s.small}>
              An item is low in stock when its quantity reaches this amount.
            </Text>
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
