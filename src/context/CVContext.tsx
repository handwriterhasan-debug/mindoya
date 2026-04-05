import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CVData, defaultCVData } from '@/types/cv';
import { toast } from '@/hooks/use-toast';

interface CVContextType {
  data: CVData;
  updateData: (section: keyof CVData, value: any) => void;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  step: number;
  setStep: (s: number) => void;
  viewMode: 'animated' | 'static';
  setViewMode: (m: 'animated' | 'static') => void;
  history: CVData[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CVContext = createContext<CVContextType | null>(null);

export const useCVContext = () => {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCVContext must be used within CVProvider');
  return ctx;
};

interface CVProviderProps {
  children: React.ReactNode;
  initialData?: { fullName?: string; age?: string; country?: string; email?: string } | null;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children, initialData }) => {
  const [data, setData] = useState<CVData>(() => {
    const saved = localStorage.getItem('mindoya-cv');
    const base = saved ? JSON.parse(saved) : defaultCVData;
    if (initialData) {
      return {
        ...base,
        personal: {
          ...base.personal,
          fullName: initialData.fullName || base.personal.fullName,
          email: initialData.email || base.personal.email,
          location: initialData.country || base.personal.location,
        },
      };
    }
    return base;
  });
  const [step, setStep] = useState(0);
  const [viewMode, setViewMode] = useState<'animated' | 'static'>('static');
  const [history, setHistory] = useState<CVData[]>([]);
  const [future, setFuture] = useState<CVData[]>([]);
  const autoSaveRef = useRef<NodeJS.Timeout>();

  const updateData = useCallback((section: keyof CVData, value: any) => {
    setData(prev => {
      setHistory(h => [...h.slice(-9), prev]);
      setFuture([]);
      return { ...prev, [section]: value };
    });
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [data, ...f]);
    setHistory(h => h.slice(0, -1));
    setData(prev);
  }, [history, data]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, data]);
    setFuture(f => f.slice(1));
    setData(next);
  }, [future, data]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      localStorage.setItem('mindoya-cv', JSON.stringify(data));
      toast({ title: '✓ Progress Saved', duration: 2000 });
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [data]);

  // Save on change
  useEffect(() => {
    localStorage.setItem('mindoya-cv', JSON.stringify(data));
  }, [data]);

  return (
    <CVContext.Provider value={{
      data, updateData, setData, step, setStep,
      viewMode, setViewMode,
      history, undo, redo,
      canUndo: history.length > 0,
      canRedo: future.length > 0,
    }}>
      {children}
    </CVContext.Provider>
  );
};
