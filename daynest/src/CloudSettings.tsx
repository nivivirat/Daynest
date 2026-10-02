import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { cloudRequest, Connection } from './cloud';
import { PantryState } from './domain';
import { Button, Field, Glyph, s } from './ui';
export type Confirm = { title: string; body: string; action: () => void };
type Props = {
  state: PantryState;
  onLoad: (s: PantryState) => void;
  connection: Connection | null;
  onConnect: (c: Connection | null) => void;
  onConfirm: (c: Confirm) => void;
};
export function CloudSettings({ state, onLoad, connection, onConnect, onConfirm }: Props) {
  const [url, setUrl] = useState(
    connection?.url ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001',
  );
  const [token, setToken] = useState(connection?.token ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function load() {
    setBusy(true);
    setMessage('');
    try {
      const result = await cloudRequest({ url, token });
      onLoad(result.state);
      onConnect({ url, token, version: result.version });
      setMessage('Cloud pantry loaded. Save to Neon after making changes.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not connect.');
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setMessage('');
    try {
      let version = connection?.version;
      if (version === undefined) {
        const remote = await cloudRequest({ url, token });
        if (remote.version !== 0 || remote.state.items.length || remote.state.shopping.length) {
          setMessage(
            'This server already has a pantry. Load it before saving to avoid overwriting another device’s changes.',
          );
          return;
        }
        version = remote.version;
      }
      const result = await cloudRequest({ url, token }, state, version);
      onConnect({ url, token, version: result.version });
      setMessage('Your pantry is saved in Neon.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 20 }}>
      <View style={[s.card, { padding: 24, gap: 16 }]}>
        <View style={s.row}>
          <Glyph name="phone-portrait-outline" />
          <Text style={s.sectionTitle}>Your pantry lives here</Text>
        </View>
        <Text style={s.subtitle}>
          Changes are saved on this device. Connect cloud storage to keep a copy of your pantry in
          Neon.
        </Text>
        <Text style={s.small}>Daynest 0.1 · Kitchen inventory and shopping lists</Text>
      </View>
      <View style={[s.card, { padding: 24, gap: 18 }]}>
        <View style={s.row}>
          <Glyph name="cloud-outline" />
          <Text style={s.sectionTitle}>Connect to Neon</Text>
        </View>
        <Text style={s.subtitle}>
          Enter your Daynest API URL and personal access token. The token is kept only for this app
          session.
        </Text>
        <Field
          label="API URL"
          value={url}
          onChangeText={(v) => {
            setUrl(v);
            onConnect(null);
          }}
          placeholder="https://your-api.example.com"
        />
        <Field
          label="Personal API token"
          value={token}
          onChangeText={(v) => {
            setToken(v);
            onConnect(null);
          }}
          secure
        />
        <Text style={s.small}>
          Loading replaces this device’s pantry. Saving uploads your current inventory and shopping
          list. Cloud sync is manual.
        </Text>
        <View style={[s.row, { flexWrap: 'wrap' }]}>
          <Button
            label={busy ? 'Working…' : 'Load from Neon'}
            secondary
            disabled={busy || !token.trim()}
            onPress={() =>
              onConfirm({
                title: 'Load your cloud pantry?',
                body: 'This replaces the inventory and shopping list on this device with the version in Neon. A new server starts with an empty pantry.',
                action: () => {
                  void load();
                },
              })
            }
          />
          <Button
            label="Save to Neon"
            disabled={busy || !token.trim()}
            onPress={() => {
              void save();
            }}
          />
        </View>
        {message !== '' && (
          <Text accessibilityRole="alert" style={[s.small, { lineHeight: 21 }]}>
            {message}
          </Text>
        )}
      </View>
      <View style={[s.card, { padding: 24, gap: 12 }]}>
        <Text style={s.sectionTitle}>A focused first chapter</Text>
        <Text style={s.subtitle}>
          Your kitchen is just the beginning. Receipt scanning, AI actions, medicine tracking, and
          scheduled notifications are planned for later versions.
        </Text>
      </View>
    </View>
  );
}
