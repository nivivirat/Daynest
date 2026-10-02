import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { Item } from '../domain';
import { locations } from '../domain';
import { Button, C, Glyph, s } from '../ui';
type Props = {
  query: string;
  setQuery: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  filtered: Item[];
  itemRow: (v: Item) => React.ReactNode;
  setEditor: (v: 'new') => void;
};
export function InventoryScreen({
  query,
  setQuery,
  location,
  setLocation,
  filter,
  setFilter,
  filtered,
  itemRow,
  setEditor,
}: Props) {
  return (
    <>
      <View style={[s.input, s.row, { paddingVertical: 0 }]}>
        <Glyph name="search-outline" color={C.muted} />
        <TextInput
          accessibilityLabel="Search inventory"
          placeholder="Find something in your kitchen…"
          value={query}
          onChangeText={setQuery}
          style={s.searchInput}
          placeholderTextColor={C.muted}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {['All', ...locations].map((l) => (
          <Pressable
            key={l}
            accessibilityRole="button"
            accessibilityState={{ selected: location === l }}
            onPress={() => setLocation(l)}
            style={[s.chip, location === l && s.chipActive]}
          >
            <Text style={[s.chipText, location === l && { color: 'white' }]}>
              {l === 'All' ? 'All locations' : l}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={[s.row, { flexWrap: 'wrap', marginBottom: 18 }]}>
        {['All items', 'Use soon', 'Low stock', 'Expired'].map((f) => (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === f }}
            onPress={() => setFilter(f)}
            style={[s.filter, filter === f && { borderBottomColor: C.green }]}
          >
            <Text
              style={{
                color: filter === f ? C.green : C.muted,
                fontWeight: filter === f ? '700' : '400',
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[s.small, { marginBottom: 12 }]}>
        {filtered.length} items · Tap an item to edit · Minus uses one unit
      </Text>
      <View style={s.card}>
        {filtered.length ? (
          filtered.map(itemRow)
        ) : (
          <View style={s.empty}>
            <Glyph name="file-tray-outline" size={32} color={C.muted} />
            <Text style={s.sectionTitle}>Nothing on this shelf yet.</Text>
            <Text style={s.small}>Add an item or try another filter.</Text>
            <Button label="Add item" icon="add" onPress={() => setEditor('new')} />
          </View>
        )}
      </View>
    </>
  );
}
