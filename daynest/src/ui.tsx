import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
export type Icon = React.ComponentProps<typeof Ionicons>['name'];
export const C = {
  bg: '#F7F8F2',
  paper: '#FFFFFF',
  ink: '#223E31',
  muted: '#788279',
  green: '#38634A',
  pale: '#EAF0E5',
  line: '#E5E9DF',
  orange: '#A85B31',
  apricot: '#FBEDDE',
  red: '#A44239',
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
      {icon && <Glyph name={icon} size={18} color={secondary ? C.green : 'white'} />}
      <Text style={[s.buttonText, secondary && { color: C.green }]}>{label}</Text>
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
export function JarArt() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={s.art}>
      <View style={s.artCircle} />
      <View style={s.shelf} />
      <View
        style={[
          s.jar,
          {
            left: 18,
            bottom: 24,
            height: 91,
            width: 65,
            backgroundColor: '#E6D1AA',
            transform: [{ rotate: '-7deg' }],
          },
        ]}
      >
        <View style={s.lid} />
        <Text style={s.jarSymbol}>🌾</Text>
        <View style={s.jarLabel}>
          <Text style={s.jarLabelText}>GRAINS</Text>
        </View>
      </View>
      <View
        style={[
          s.jar,
          { left: 90, bottom: 23, height: 124, width: 76, backgroundColor: '#C6D3AC' },
        ]}
      >
        <View style={[s.lid, { backgroundColor: '#42684B' }]} />
        <Text style={[s.jarSymbol, { fontSize: 34 }]}>🌿</Text>
        <View style={s.jarLabel}>
          <Text style={s.jarLabelText}>FRESH</Text>
        </View>
      </View>
      <View
        style={[
          s.jar,
          {
            left: 172,
            bottom: 22,
            height: 72,
            width: 58,
            backgroundColor: '#DDA981',
            transform: [{ rotate: '8deg' }],
          },
        ]}
      >
        <View style={s.lid} />
        <Text style={[s.jarSymbol, { fontSize: 22 }]}>🫘</Text>
      </View>
      <Text style={{ position: 'absolute', top: 12, right: 5, fontSize: 22, color: '#76936B' }}>
        ✦
      </Text>
    </View>
  );
}
export const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  layout: { flex: 1, flexDirection: 'row' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16 },
  sidebar: {
    width: 235,
    backgroundColor: '#FDFEF9',
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
  sidebarCaption: { fontSize: 8, letterSpacing: 1.8, color: C.muted, marginTop: 14 },
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
    backgroundColor: '#DFE9D8',
    borderRadius: 6,
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sidebarNote: { backgroundColor: '#EFF3E8', borderRadius: 12, padding: 17, gap: 10 },
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
    backgroundColor: '#E8EDDD',
    borderRadius: 18,
  },
  topbar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FBFCF7',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  connectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 7,
    backgroundColor: '#EFF2E9',
    borderRadius: 7,
  },
  dot: { height: 6, width: 6, borderRadius: 3 },
  tiny: { fontSize: 10, color: C.green },
  content: { width: '100%', maxWidth: 1230, alignSelf: 'center', paddingBottom: 90 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 29 },
  eyebrow: { fontSize: 9, letterSpacing: 2, fontWeight: '700', color: '#86917D' },
  title: { fontSize: 34, fontWeight: '600', letterSpacing: -1.3, color: C.ink },
  subtitle: { fontSize: 14, color: C.muted, lineHeight: 22 },
  small: { fontSize: 12, color: C.muted, lineHeight: 18 },
  label: { fontSize: 14, color: C.ink, fontWeight: '600' },
  button: {
    backgroundColor: C.green,
    borderRadius: 9,
    paddingHorizontal: 17,
    minHeight: 44,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 13, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#F6F8F1', borderWidth: 1, borderColor: '#D4DFCC' },
  hero: {
    backgroundColor: '#E9EFDF',
    borderWidth: 1,
    borderColor: '#E0E7D5',
    borderRadius: 17,
    padding: 28,
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 15,
    marginBottom: 23,
  },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroTagText: { color: C.green, fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    color: '#2E5038',
    fontWeight: '600',
    letterSpacing: -0.8,
  },
  art: { width: 250, minHeight: 200, alignSelf: 'center' },
  artCircle: {
    width: 205,
    height: 205,
    borderRadius: 103,
    backgroundColor: '#DCE6CA',
    position: 'absolute',
    left: 22,
    top: 0,
  },
  shelf: {
    position: 'absolute',
    width: 240,
    height: 9,
    backgroundColor: '#B5BA96',
    bottom: 14,
    borderRadius: 5,
  },
  jar: {
    position: 'absolute',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF80',
  },
  lid: {
    position: 'absolute',
    top: -9,
    left: -2,
    right: -2,
    height: 16,
    backgroundColor: '#A68C62',
    borderRadius: 5,
  },
  jarSymbol: { fontSize: 28, marginBottom: 8 },
  jarLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FCF9EBC9',
    borderRadius: 3,
  },
  jarLabelText: { fontSize: 7, letterSpacing: 1.5, color: '#64734F', fontWeight: '700' },
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
    backgroundColor: '#F0F3EB',
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
    borderColor: '#F0F2ED',
  },
  expiryTag: {
    fontSize: 10,
    color: C.orange,
    backgroundColor: C.apricot,
    padding: 7,
    borderRadius: 6,
    maxWidth: 110,
  },
  itemName: { fontSize: 14, fontWeight: '500', color: C.ink },
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
  link: { color: C.green, fontSize: 12, fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 7,
    borderBottomWidth: 1,
    borderColor: '#F0F2ED',
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
    backgroundColor: '#FDFEF9',
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
  mobileNavText: { fontSize: 10, color: C.muted },
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DAE1D5',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 46,
    color: C.ink,
    fontSize: 14,
  },
  searchInput: { flex: 1, height: 48, color: C.ink, fontSize: 14 },
  chips: { gap: 8, paddingVertical: 20 },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#EBEFE5' },
  chipActive: { backgroundColor: C.green },
  chipText: { fontSize: 12, color: C.green },
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
    borderColor: '#CBD5C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#172C2766',
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
    backgroundColor: '#FFF0EC',
    borderRadius: 8,
  },
  notice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E7EEDD',
    borderRadius: 8,
    padding: 13,
    marginBottom: 18,
  },
});
