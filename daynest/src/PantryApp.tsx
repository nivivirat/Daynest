import { OverviewScreen } from './screens/OverviewScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addShopping, consume, daysUntil, expiryLabel, iconFor, Item } from './domain';
import { useDaynest } from './DaynestProvider';
import { CloudSettings, Confirm } from './CloudSettings';
import { ItemEditor } from './ItemEditor';
import { Button, C, Glyph, Icon, s } from './ui';

type Tab = 'Overview' | 'Inventory' | 'Shopping' | 'Settings';
const navigation: { name: Tab; icon: Icon }[] = [
  { name: 'Overview', icon: 'grid-outline' },
  { name: 'Inventory', icon: 'file-tray-stacked-outline' },
  { name: 'Shopping', icon: 'bag-handle-outline' },
  { name: 'Settings', icon: 'options-outline' },
];
export default function Pantry({ tab }: { tab: Tab }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const routes = {
    Overview: '/',
    Inventory: '/inventory',
    Shopping: '/shopping',
    Settings: '/settings',
  } as const;
  const setTab = (next: Tab) => router.navigate(routes[next]);
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const compact = width < 620;
  const { state, setState, ready, error: storageError, connection, setConnection } = useDaynest();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All');
  const filter = params.filter ?? 'All items';
  const setFilter = (value: string) => router.setParams({ filter: value });
  const [editor, setEditor] = useState<Item | 'new' | null>(null);
  const [shoppingName, setShoppingName] = useState('');
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const pending = state.shopping.filter((i) => !i.checked).length;
  const expiring = state.items.filter(
    (i) =>
      i.quantity > 0 &&
      daysUntil(i.expires) !== null &&
      daysUntil(i.expires)! >= 0 &&
      daysUntil(i.expires)! <= 3,
  );
  const expired = state.items.filter(
    (i) => i.quantity > 0 && daysUntil(i.expires) !== null && daysUntil(i.expires)! < 0,
  );
  const low = state.items.filter((i) => i.quantity <= i.lowAt);
  const filtered = state.items.filter(
    (i) =>
      (!query || i.name.toLowerCase().includes(query.toLowerCase())) &&
      (location === 'All' || i.location === location) &&
      (filter === 'All items' ||
        (filter === 'Use soon' && expiring.some((e) => e.id === i.id)) ||
        (filter === 'Low stock' && i.quantity <= i.lowAt) ||
        (filter === 'Expired' && expired.some((e) => e.id === i.id))),
  );
  function addToList(name: string) {
    if (!name.trim()) return;
    setState((prev) => addShopping(prev, name));
    setNotice(`${name.trim()} is on your shopping list.`);
  }
  function openFilter(value: string) {
    setLocation('All');
    setQuery('');
    router.navigate({ pathname: '/inventory', params: { filter: value } });
  }
  const nav = (mobile = false) =>
    navigation.map((n) => (
      <Pressable
        key={n.name}
        accessibilityRole="button"
        accessibilityState={{ selected: tab === n.name }}
        accessibilityLabel={n.name}
        onPress={() => {
          setTab(n.name);
          setNotice('');
        }}
        style={[
          mobile ? s.mobileNavItem : s.navItem,
          tab === n.name && (mobile ? { backgroundColor: C.pale } : s.navActive),
        ]}
      >
        <Glyph name={n.icon} color={tab === n.name ? C.green : C.muted} size={mobile ? 21 : 19} />
        <Text
          style={[
            mobile ? s.mobileNavText : s.navText,
            tab === n.name && { color: C.green, fontWeight: '700' },
          ]}
        >
          {n.name}
        </Text>
        {!mobile && n.name === 'Shopping' && pending > 0 && <Text style={s.badge}>{pending}</Text>}
      </Pressable>
    ));
  const itemRow = (item: Item) => (
    <View key={item.id} style={[s.itemRow, compact && { paddingHorizontal: 12 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${item.name}`}
        onPress={() => setEditor(item)}
        style={s.itemMain}
      >
        <View
          style={[
            s.foodIcon,
            {
              backgroundColor:
                item.category === 'Produce'
                  ? '#EDF1E5'
                  : item.category === 'Grains'
                    ? '#F6EEDF'
                    : '#EEF0F5',
            },
          ]}
        >
          <Text style={{ fontSize: 25 }}>{iconFor[item.category]}</Text>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={s.itemName}>{item.name}</Text>
          <Text style={s.small}>
            {item.quantity} {item.unit} · {item.location}
          </Text>
          {compact && (
            <Text style={[s.small, { color: C.orange }]}>{expiryLabel(item.expires)}</Text>
          )}
        </View>
      </Pressable>
      {!compact && (
        <View style={{ width: 150 }}>
          <Text
            style={[
              s.small,
              {
                color:
                  daysUntil(item.expires) !== null && daysUntil(item.expires)! <= 3
                    ? C.orange
                    : C.muted,
              },
            ]}
          >
            {expiryLabel(item.expires)}
          </Text>
          {item.quantity <= item.lowAt && (
            <Text style={[s.small, { color: C.orange, marginTop: 5 }]}>Low stock</Text>
          )}
        </View>
      )}
      <Pressable
        disabled={item.quantity === 0}
        accessibilityRole="button"
        accessibilityLabel={`Use one ${item.unit} of ${item.name}`}
        onPress={() =>
          setState((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.id === item.id ? consume(i) : i)),
          }))
        }
        style={[s.iconButton, { opacity: item.quantity === 0 ? 0.3 : 1 }]}
      >
        <Glyph name="remove" size={18} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to shopping list`}
        onPress={() => addToList(item.name)}
        style={s.iconButton}
      >
        <Glyph name="bag-add-outline" size={18} />
      </Pressable>
    </View>
  );
  if (!ready)
    return (
      <SafeAreaView style={[s.app, s.center]}>
        <StatusBar style="dark" />
        {storageError ? (
          <Text style={s.error}>{storageError}</Text>
        ) : (
          <>
            <ActivityIndicator color={C.green} />
            <Text style={s.small}>Opening Daynest…</Text>
          </>
        )}
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={s.app}>
      <StatusBar style="dark" />
      <View style={s.layout}>
        {wide && (
          <View style={s.sidebar}>
            <View style={s.brand}>
              <View style={s.brandMark}>
                <Glyph name="leaf-outline" color="white" size={23} />
              </View>
              <Text style={s.brandText}>
                daynest<Text style={{ color: '#85A374' }}>.</Text>
              </Text>
            </View>
            <Text style={s.sidebarCaption}>YOUR EVERYDAY, A LITTLE EASIER</Text>
            <View style={{ gap: 9, marginTop: 37 }}>{nav()}</View>
            <View style={{ flex: 1 }} />
            <View style={s.sidebarNote}>
              <Glyph name="leaf-outline" color={C.green} />
              <Text style={s.noteTitle}>Less waste. More ease.</Text>
              <Text style={s.small}>Good things start with knowing what you have.</Text>
            </View>
            <View style={s.profile}>
              <View style={s.avatar}>
                <Text style={{ color: C.green, fontWeight: '700' }}>H</Text>
              </View>
              <View>
                <Text style={s.label}>My household</Text>
                <Text style={s.small}>Personal kitchen</Text>
              </View>
            </View>
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={[s.topbar, { paddingHorizontal: compact ? 20 : 36 }]}>
            <View style={s.row}>
              <Glyph name={wide ? 'home-outline' : 'leaf-outline'} size={17} color={C.muted} />
              <Text style={s.small}>{wide ? 'My household' : 'Daynest'}</Text>
              <Text style={{ color: '#C0C8BC' }}>/</Text>
              <Text style={[s.small, { color: C.ink }]}>
                {tab === 'Overview' ? 'Kitchen' : tab}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open storage settings"
              onPress={() => setTab('Settings')}
              style={s.connectionPill}
            >
              <View style={[s.dot, { backgroundColor: connection ? '#588360' : '#B7A37B' }]} />
              <Text style={s.tiny}>{connection ? 'Neon connected' : 'On this device'}</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={[s.content, { padding: compact ? 20 : 36 }]}>
            <View style={s.pageHeader}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={s.eyebrow}>YOUR EVERYDAY, SIMPLIFIED</Text>
                <Text style={[s.title, compact && { fontSize: 31 }]}>
                  {tab === 'Overview'
                    ? 'A little order. A lot of ease.'
                    : tab === 'Inventory'
                      ? 'Your kitchen, in view.'
                      : tab === 'Shopping'
                        ? 'A thoughtful little list.'
                        : 'Make yourself at home.'}
                </Text>
                <Text style={s.subtitle}>
                  {tab === 'Overview'
                    ? 'Know what you have. Make the most of it.'
                    : tab === 'Inventory'
                      ? 'Everything on your shelves, all in one place.'
                      : tab === 'Shopping'
                        ? 'The things you need, ready for your next trip.'
                        : 'Your data, your household, your way.'}
                </Text>
              </View>
              {!compact && (tab === 'Overview' || tab === 'Inventory') && (
                <Button label="Add item" icon="add" onPress={() => setEditor('new')} />
              )}
            </View>
            {storageError !== '' && (
              <Text accessibilityRole="alert" style={s.error}>
                {storageError}
              </Text>
            )}
            {notice !== '' && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss message"
                onPress={() => setNotice('')}
                style={s.notice}
              >
                <Glyph name="checkmark-circle-outline" color={C.green} />
                <Text style={{ flex: 1, color: C.green }}>{notice}</Text>
                <Glyph name="close" size={16} />
              </Pressable>
            )}
            {tab === 'Overview' && (
              <OverviewScreen
                state={state}
                compact={compact}
                openFilter={openFilter}
                expiring={expiring}
                expired={expired}
                low={low}
                pending={pending}
                setEditor={setEditor}
                setTab={setTab}
                itemRow={itemRow}
                setState={setState}
                setNotice={setNotice}
              />
            )}
            {tab === 'Inventory' && (
              <InventoryScreen
                query={query}
                setQuery={setQuery}
                location={location}
                setLocation={setLocation}
                filter={filter}
                setFilter={setFilter}
                filtered={filtered}
                itemRow={itemRow}
                setEditor={setEditor}
              />
            )}
            {tab === 'Shopping' && (
              <ShoppingScreen
                state={state}
                setState={setState}
                shoppingName={shoppingName}
                setShoppingName={setShoppingName}
                addToList={addToList}
                pending={pending}
                low={low}
              />
            )}
            {tab === 'Settings' && (
              <CloudSettings
                state={state}
                onLoad={setState}
                connection={connection}
                onConnect={setConnection}
                onConfirm={setConfirm}
              />
            )}
            <View style={s.footer}>
              <Glyph name="leaf-outline" size={14} color={C.muted} />
              <Text style={s.small}>A little less waste. A little more room to live.</Text>
            </View>
          </ScrollView>
          {compact && (tab === 'Overview' || tab === 'Inventory') && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add item"
              onPress={() => setEditor('new')}
              style={s.fab}
            >
              <Glyph name="add" color="white" size={28} />
            </Pressable>
          )}
          {!wide && <View style={s.mobileNav}>{nav(true)}</View>}
        </View>
      </View>
      {editor !== null && (
        <ItemEditor
          item={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
          onSave={(item) => {
            setState((prev) => ({
              ...prev,
              items: prev.items.some((i) => i.id === item.id)
                ? prev.items.map((i) => (i.id === item.id ? item : i))
                : [...prev.items, item],
            }));
            setEditor(null);
            setNotice(`${item.name} saved to your kitchen.`);
          }}
          onDelete={(item) => {
            setEditor(null);
            setConfirm({
              title: `Remove ${item.name}?`,
              body: 'This removes the item from your inventory.',
              action: () => {
                setState((prev) => ({
                  ...prev,
                  items: prev.items.filter((i) => i.id !== item.id),
                }));
              },
            });
          }}
        />
      )}
      <Modal
        visible={confirm !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(null)}
      >
        <View style={s.overlay}>
          <View style={[s.dialog, { padding: 28, gap: 20 }]}>
            <Text style={s.sectionTitle}>{confirm?.title}</Text>
            <Text style={s.subtitle}>{confirm?.body}</Text>
            <View style={[s.row, { justifyContent: 'flex-end' }]}>
              <Button label="Cancel" secondary onPress={() => setConfirm(null)} />
              <Button
                label="Continue"
                onPress={() => {
                  const action = confirm?.action;
                  setConfirm(null);
                  action?.();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
