import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { PantryState } from './domain';
import { stateSchema } from './schema';

const KEY = 'pantry.state.v1';
export function usePantry() {
  const [state, setState] = useState<PantryState>({ items: [], shopping: [] });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) setState(stateSchema.parse(JSON.parse(raw)));
        setReady(true);
      })
      .catch(() => {
        if (active)
          setError(
            'Could not read saved data. Reload the app to try again. Existing data has not been overwritten.',
          );
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(state)))
      .then(() => setError(''))
      .catch(() =>
        setError('Changes could not be saved on this device. Keep the app open and retry.'),
      );
  }, [state, ready]);
  return { state, setState, ready, error };
}
