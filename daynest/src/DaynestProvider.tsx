import React, { createContext, useContext, useState } from 'react';
import { usePantry } from './storage';
import type { Connection } from './cloud';
type DaynestContext = ReturnType<typeof usePantry> & {
  connection: Connection | null;
  setConnection: React.Dispatch<React.SetStateAction<Connection | null>>;
};
const Context = createContext<DaynestContext | null>(null);
export function DaynestProvider({ children }: { children: React.ReactNode }) {
  const pantry = usePantry();
  const [connection, setConnection] = useState<Connection | null>(null);
  return (
    <Context.Provider value={{ ...pantry, connection, setConnection }}>{children}</Context.Provider>
  );
}
export function useDaynest() {
  const context = useContext(Context);
  if (!context) throw new Error('DaynestProvider is required.');
  return context;
}
