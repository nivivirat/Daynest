import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Item, PantryState } from '../domain';
import { expiryLabel, iconFor, sampleState } from '../domain';
import { Button, C, Glyph, Icon, JarArt, s } from '../ui';
type Props = {
  state: PantryState;
  compact: boolean;
  openFilter: (v: string) => void;
  expiring: Item[];
  expired: Item[];
  low: Item[];
  pending: number;
  setEditor: (v: Item | 'new') => void;
  setTab: (v: 'Shopping') => void;
  itemRow: (v: Item) => React.ReactNode;
  setState: React.Dispatch<React.SetStateAction<PantryState>>;
  setNotice: (v: string) => void;
};
export function OverviewScreen({
  state,
  compact,
  openFilter,
  expiring,
  expired,
  low,
  pending,
  setEditor,
  setTab,
  itemRow,
  setState,
  setNotice,
}: Props) {
  return (
    <>
      <View style={s.hero}>
        <View style={{ flex: 1, gap: 12, paddingVertical: 8 }}>
          <View style={s.heroTag}>
            <Glyph name="sunny-outline" size={15} color={C.green} />
            <Text style={s.heroTagText}>A FRESH START</Text>
          </View>
          <Text style={[s.heroTitle, compact && { fontSize: 27 }]}>
            A happier kitchen{'\n'}starts here.
          </Text>
          <Text style={[s.subtitle, { maxWidth: 350, lineHeight: 22 }]}>
            Keep the good stuff fresh and the essentials stocked. We’ll help you keep track.
          </Text>
          <View style={{ alignSelf: 'flex-start', marginTop: 5 }}>
            <Button
              label="Explore your inventory"
              secondary
              icon="arrow-forward"
              onPress={() => openFilter('All items')}
            />
          </View>
        </View>
        {!compact && <JarArt />}
      </View>
      <View style={[s.stats, compact && { gap: 8 }]}>
        {[
          {
            n: state.items.length,
            title: 'In your kitchen',
            sub: 'items accounted for',
            icon: 'cube-outline' as Icon,
            color: C.green,
            bg: C.pale,
            filter: 'All items',
          },
          {
            n: expiring.length,
            title: 'Use soon',
            sub: 'within the next 3 days',
            icon: 'time-outline' as Icon,
            color: C.orange,
            bg: C.apricot,
            filter: 'Use soon',
          },
          {
            n: low.length,
            title: 'Running low',
            sub: 'ready for a top-up',
            icon: 'basket-outline' as Icon,
            color: '#6C6A90',
            bg: '#EEEDF6',
            filter: 'Low stock',
          },
        ].map((stat) => (
          <Pressable
            key={stat.title}
            accessibilityRole="button"
            accessibilityLabel={`${stat.n} ${stat.title}`}
            onPress={() => openFilter(stat.filter)}
            style={[s.stat, compact && { padding: 12 }]}
          >
            <View style={[s.statIcon, { backgroundColor: stat.bg }]}>
              <Glyph name={stat.icon} color={stat.color} />
            </View>
            <Text style={s.statNumber}>
              {stat.n}
              <Text style={s.statUnit}> items</Text>
            </Text>
            <Text style={[s.label, compact && { fontSize: 12 }]}>{stat.title}</Text>
            {!compact && <Text style={s.small}>{stat.sub}</Text>}
          </Pressable>
        ))}
      </View>
      <View style={[s.columns, compact && { flexDirection: 'column' }]}>
        <View style={[s.card, { flex: 1.4 }]}>
          <View style={s.sectionHeader}>
            <View style={s.row}>
              <Glyph name="time-outline" color={C.orange} />
              <Text style={s.sectionTitle}>A little attention</Text>
            </View>
            <Text style={s.count}>{expiring.length + expired.length}</Text>
          </View>
          <Text style={[s.small, { paddingHorizontal: 22, marginBottom: 12 }]}>
            Check dates before your next meal.
          </Text>
          {[...expired, ...expiring].slice(0, 4).map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.name}`}
              onPress={() => setEditor(item)}
              style={s.attentionRow}
            >
              <Text style={{ fontSize: 28 }}>{iconFor[item.category]}</Text>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.small}>
                  {item.quantity} {item.unit} · {item.location}
                </Text>
              </View>
              <Text style={s.expiryTag}>{expiryLabel(item.expires)}</Text>
            </Pressable>
          ))}
          {!expiring.length && !expired.length && (
            <View style={s.emptySmall}>
              <Glyph name="checkmark-circle-outline" color={C.green} size={28} />
              <Text style={s.small}>No items need attention right now.</Text>
            </View>
          )}
        </View>
        <View style={[s.card, { flex: 1 }]}>
          <View style={s.sectionHeader}>
            <View style={s.row}>
              <Glyph name="bag-handle-outline" />
              <Text style={s.sectionTitle}>Next shopping trip</Text>
            </View>
            <Text style={s.count}>{pending}</Text>
          </View>
          {state.shopping
            .filter((i) => !i.checked)
            .slice(0, 3)
            .map((item) => (
              <View key={item.id} style={s.miniShopping}>
                <View style={s.miniDot} />
                <Text style={s.itemName}>{item.name}</Text>
              </View>
            ))}
          {pending === 0 && (
            <Text style={[s.small, { padding: 22 }]}>
              Your list is clear. Add an essential when you need it.
            </Text>
          )}
          <View style={{ padding: 20, marginTop: 'auto' }}>
            <Button label="Open shopping list" secondary onPress={() => setTab('Shopping')} />
          </View>
        </View>
      </View>
      <View style={s.sectionHeaderPlain}>
        <Text style={s.sectionTitle}>On your shelves</Text>
        <Pressable accessibilityRole="button" onPress={() => openFilter('All items')}>
          <Text style={s.link}>View all →</Text>
        </Pressable>
      </View>
      {state.items.length ? (
        <View style={s.card}>{state.items.slice(0, 4).map(itemRow)}</View>
      ) : (
        <View style={[s.card, s.empty]}>
          <Text style={{ fontSize: 35 }}>🫙</Text>
          <Text style={s.sectionTitle}>Let’s stock your first shelf.</Text>
          <Text style={[s.subtitle, { textAlign: 'center' }]}>
            Add what’s in your kitchen, or explore with sample items.
          </Text>
          <View style={[s.row, { flexWrap: 'wrap', justifyContent: 'center' }]}>
            <Button label="Add your first item" icon="add" onPress={() => setEditor('new')} />
            <Button
              label="Try sample pantry"
              secondary
              onPress={() => {
                setState((previous) => {
                  const sample = sampleState();
                  return {
                    ...sample,
                    shopping: previous.shopping.length ? previous.shopping : sample.shopping,
                  };
                });
                setNotice('Sample items added. Edit them to make this pantry yours.');
              }}
            />
          </View>
        </View>
      )}
    </>
  );
}
