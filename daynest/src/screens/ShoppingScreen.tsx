import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { Item, PantryState } from '../domain';

import { Button, C, Glyph, s } from '../ui';
type Props = {
  state: PantryState;
  setState: React.Dispatch<React.SetStateAction<PantryState>>;
  shoppingName: string;
  setShoppingName: (v: string) => void;
  addToList: (v: string) => void;
  pending: number;
  low: Item[];
};
export function ShoppingScreen({
  state,
  setState,
  shoppingName,
  setShoppingName,
  addToList,
  pending,
  low,
}: Props) {
  return (
    <>
      <View style={[s.row, { marginBottom: 22 }]}>
        <TextInput
          accessibilityLabel="Shopping item"
          placeholder="What do you need?"
          value={shoppingName}
          onChangeText={setShoppingName}
          onSubmitEditing={() => {
            addToList(shoppingName);
            setShoppingName('');
          }}
          style={[s.input, { flex: 1 }]}
          maxLength={100}
        />
        <Button
          label="Add"
          icon="add"
          disabled={!shoppingName.trim()}
          onPress={() => {
            addToList(shoppingName);
            setShoppingName('');
          }}
        />
      </View>
      <View style={s.card}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Your shopping list</Text>
          <Text style={s.count}>{pending} left</Text>
        </View>
        {state.shopping.map((item) => (
          <View style={s.shoppingRow} key={item.id}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
              accessibilityLabel={item.name}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  shopping: prev.shopping.map((i) =>
                    i.id === item.id ? { ...i, checked: !i.checked } : i,
                  ),
                }))
              }
              style={[s.row, { flex: 1, minHeight: 44 }]}
            >
              <View
                style={[
                  s.checkbox,
                  item.checked && { backgroundColor: C.green, borderColor: C.green },
                ]}
              >
                {item.checked && <Glyph name="checkmark" size={16} color="white" />}
              </View>
              <Text
                style={[
                  s.itemName,
                  item.checked && { textDecorationLine: 'line-through', color: C.muted },
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from shopping list`}
              style={s.iconButton}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  shopping: prev.shopping.filter((i) => i.id !== item.id),
                }))
              }
            >
              <Glyph name="close-outline" color={C.muted} />
            </Pressable>
          </View>
        ))}
        {!state.shopping.length && (
          <View style={s.empty}>
            <Glyph name="bag-check-outline" size={36} color={C.green} />
            <Text style={s.subtitle}>A fresh list for your next trip.</Text>
          </View>
        )}
      </View>
      {state.shopping.some((i) => i.checked) && (
        <View style={{ alignSelf: 'flex-start', marginTop: 16 }}>
          <Button
            label="Clear checked items"
            secondary
            onPress={() =>
              setState((prev) => ({
                ...prev,
                shopping: prev.shopping.filter((i) => !i.checked),
              }))
            }
          />
        </View>
      )}
      {low.length > 0 && (
        <View style={[s.card, { marginTop: 24, padding: 22, gap: 16 }]}>
          <Text style={s.sectionTitle}>Running low at home</Text>
          <Text style={s.subtitle}>Add these to your next trip.</Text>
          {low.map((item) => (
            <View key={item.id} style={s.row}>
              <Text style={[s.itemName, { flex: 1 }]}>{item.name}</Text>
              <Button label="Add to list" secondary onPress={() => addToList(item.name)} />
            </View>
          ))}
        </View>
      )}
    </>
  );
}
