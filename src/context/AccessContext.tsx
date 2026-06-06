import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AccessContextType {
  unlocked: boolean;
  unlock: (method: string) => void;
  lock: () => void;
  unlockedAt: number | null;
  method: string | null;
}

const AccessContext = createContext<AccessContextType | null>(null);
const KEY = 'mindoya-access-unlocked';
const METHOD_KEY = 'mindoya-access-method';
const AT_KEY = 'mindoya-access-at';

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  });
  const [method, setMethod] = useState<string | null>(() => {
    try { return localStorage.getItem(METHOD_KEY); } catch { return null; }
  });
  const [unlockedAt, setUnlockedAt] = useState<number | null>(() => {
    try { const v = localStorage.getItem(AT_KEY); return v ? parseInt(v, 10) : null; } catch { return null; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, unlocked ? '1' : '0');
      if (method) localStorage.setItem(METHOD_KEY, method); else localStorage.removeItem(METHOD_KEY);
      if (unlockedAt) localStorage.setItem(AT_KEY, String(unlockedAt)); else localStorage.removeItem(AT_KEY);
    } catch {}
  }, [unlocked, method, unlockedAt]);

  const unlock = useCallback((m: string) => {
    setUnlocked(true);
    setMethod(m);
    setUnlockedAt(Date.now());
  }, []);

  const lock = useCallback(() => {
    setUnlocked(false);
    setMethod(null);
    setUnlockedAt(null);
  }, []);

  return (
    <AccessContext.Provider value={{ unlocked, unlock, lock, unlockedAt, method }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error('useAccess must be inside AccessProvider');
  return ctx;
};
