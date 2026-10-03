import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
export type Icon = React.ComponentProps<typeof Ionicons>['name'];
export const C = {
  bg: '#121212',
  paper: '#181818',
  ink: '#FFFFFF',
  muted: '#B3B3B3',
  green: '#1ED760',
  pale: '#233329',
  line: '#333333',
  orange: '#FFA42B',
  apricot: '#382A18',
  red: '#F3727F',
};
export function Glyph({
  name,
  size = 20,
  color = C.ink,
}: {
  name: Icon;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: Icon;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondaryButton,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      {icon && <Glyph name={icon} size={18} color={secondary ? C.ink : '#121212'} />}
      <Text style={[s.buttonText, secondary && { color: C.ink }]}>{label}</Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  numeric = false,
  secure = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  secure?: boolean;
}) {
  return (
    <View style={{ gap: 7, flex: 1 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#929B92"
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        autoCapitalize="none"
        autoCorrect={!secure}
        secureTextEntry={secure}
        style={s.input}
      />
    </View>
  );
}
export const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  layout: { flex: 1, flexDirection: 'row' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16 },
  sidebar: {
    width: 235,
    backgroundColor: '#181818',
    borderRightWidth: 1,
    borderColor: C.line,
    padding: 24,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12 },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 31, fontWeight: '700', letterSpacing: -1, color: C.ink },
  sidebarCaption: { fontSize: 12, letterSpacing: 1, color: C.muted, marginTop: 14 },
  navItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 9,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  navActive: { backgroundColor: C.pale },
  navText: { fontSize: 14, color: C.muted },
  badge: {
    marginLeft: 'auto',
    color: C.green,
    backgroundColor: '#233329',
    borderRadius: 6,
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sidebarNote: { backgroundColor: '#252525', borderRadius: 12, padding: 17, gap: 10 },
  noteTitle: { fontSize: 13, fontWeight: '600', color: C.green },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 25,
    paddingTop: 22,
    borderTopWidth: 1,
    borderColor: C.line,
  },
  avatar: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252525',
    borderRadius: 18,
  },
  topbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: C.line,
    backgroundColor: '#121212',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  connectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 7,
    backgroundColor: '#252525',
    borderRadius: 7,
  },
  dot: { height: 6, width: 6, borderRadius: 3 },
  tiny: { fontSize: 14, color: C.green },
  content: { width: '100%', maxWidth: 1230, alignSelf: 'center', paddingBottom: 90 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 29 },
  eyebrow: { fontSize: 12, letterSpacing: 1, fontWeight: '700', color: '#86917D' },
  title: { fontSize: 34, fontWeight: '600', letterSpacing: -1.3, color: C.ink },
  subtitle: { fontSize: 14, color: C.muted, lineHeight: 22 },
  small: { fontSize: 14, color: C.muted, lineHeight: 18 },
  label: { fontSize: 16, color: C.ink, fontWeight: '600' },
  button: {
    backgroundColor: C.green,
    borderRadius: 24,
    paddingHorizontal: 20,
    minHeight: 48,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#121212', fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#252525', borderWidth: 1, borderColor: '#444444' },
  stats: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  stat: {
    flex: 1,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 13,
    padding: 21,
    gap: 7,
  },
  statIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },
  statNumber: { fontSize: 30, fontWeight: '600', color: C.ink, letterSpacing: -1 },
  statUnit: { fontSize: 11, color: C.muted, fontWeight: '400', letterSpacing: 0 },
  columns: { flexDirection: 'row', gap: 20, marginBottom: 26 },
  card: {
    backgroundColor: C.paper,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 21,
    gap: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: C.ink, letterSpacing: -0.3 },
  count: {
    backgroundColor: '#252525',
    color: C.green,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#333333',
  },
  expiryTag: {
    fontSize: 14,
    color: C.orange,
    backgroundColor: C.apricot,
    padding: 7,
    borderRadius: 6,
    maxWidth: 110,
  },
  itemName: { fontSize: 16, fontWeight: '500', color: C.ink },
  miniShopping: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 13,
    gap: 12,
  },
  miniDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#BCCBAE' },
  sectionHeaderPlain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  link: { color: C.green, fontSize: 16, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 7,
    borderBottomWidth: 1,
    borderColor: '#333333',
  },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 13 },
  foodIcon: {
    height: 48,
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  empty: { padding: 30, gap: 16, alignItems: 'center' },
  emptySmall: { padding: 24, alignItems: 'center', gap: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 35,
    paddingBottom: 12,
  },
  mobileNav: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  mobileNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 5,
    borderRadius: 10,
  },
  mobileNavText: { fontSize: 14, color: C.muted },
  fab: {
    position: 'absolute',
    bottom: 92,
    right: 22,
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px #263A3225',
  },
  input: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 46,
    color: C.ink,
    fontSize: 14,
  },
  searchInput: { flex: 1, height: 48, color: C.ink, fontSize: 14 },
  chips: { gap: 8, paddingVertical: 20 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    minHeight: 44,
    backgroundColor: '#252525',
  },
  chipActive: { backgroundColor: C.pale, borderWidth: 1, borderColor: C.green },
  chipText: { fontSize: 14, color: C.green },
  filter: {
    borderBottomWidth: 2,
    borderColor: 'transparent',
    paddingBottom: 10,
    paddingHorizontal: 9,
  },
  shoppingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: C.line,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000BB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 510,
    maxHeight: '90%',
    backgroundColor: C.bg,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 18px 80px #00000020',
  },
  error: {
    color: C.red,
    fontSize: 13,
    lineHeight: 20,
    padding: 12,
    backgroundColor: '#382025',
    borderRadius: 8,
  },
  notice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#233329',
    borderRadius: 8,
    padding: 13,
    marginBottom: 18,
  },
});
