import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CVData } from '@/types/cv';

export type Plan = 'free' | 'pro' | 'premium';

export interface SavedCV {
  id: string;
  name: string;
  updatedAt: number;
  createdAt: number;
  data: CVData;
  thumbnail?: string;
}

export interface PlanLimits {
  maxCVs: number; // -1 = unlimited
  templates: 'starter' | 'all' | 'all-plus-exclusive';
  aiWriter: boolean;
  atsScore: boolean;
  premiumTemplates: boolean;
  watermark: boolean;
  prioritySupport: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxCVs: 2,
    templates: 'starter',
    aiWriter: false,
    atsScore: false,
    premiumTemplates: false,
    watermark: true,
    prioritySupport: false,
  },
  pro: {
    maxCVs: 5,
    templates: 'all',
    aiWriter: true,
    atsScore: true,
    premiumTemplates: false,
    watermark: false,
    prioritySupport: false,
  },
  premium: {
    maxCVs: -1,
    templates: 'all-plus-exclusive',
    aiWriter: true,
    atsScore: true,
    premiumTemplates: true,
    watermark: false,
    prioritySupport: true,
  },
};

// Pro-locked templates (exactly 3)
export const PRO_TEMPLATES = ['executive', 'creative', 'tech'];
// Premium-only exclusive templates (exactly 3)
export const PREMIUM_TEMPLATES = ['scifi', 'modernai', 'infographic'];
// Free-tier = everything else (6 templates)
export const FREE_TEMPLATES = ['modern', 'minimal', 'classic', 'magazine', 'twocolumn', 'gradient'];

interface PlanContextType {
  plan: Plan;
  setPlan: (p: Plan) => void;
  limits: PlanLimits;
  library: SavedCV[];
  saveCV: (name: string, data: CVData, id?: string) => { ok: boolean; id?: string; reason?: string };
  deleteCV: (id: string) => void;
  duplicateCV: (id: string) => void;
  getCV: (id: string) => SavedCV | undefined;
  canCreateNewCV: boolean;
  isTemplateLocked: (template: string) => boolean;
  showUpgrade: { open: boolean; reason?: string };
  openUpgrade: (reason?: string) => void;
  closeUpgrade: () => void;
}

const PlanContext = createContext<PlanContextType | null>(null);

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used inside PlanProvider');
  return ctx;
};

const LIB_KEY = 'mindoya-library';
const PLAN_KEY = 'mindoya-plan';

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlanState] = useState<Plan>(() => {
    try {
      const v = localStorage.getItem(PLAN_KEY) as Plan | null;
      return v && ['free', 'pro', 'premium'].includes(v) ? v : 'free';
    } catch { return 'free'; }
  });
  const [library, setLibrary] = useState<SavedCV[]>(() => {
    try {
      const raw = localStorage.getItem(LIB_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [showUpgrade, setShowUpgrade] = useState<{ open: boolean; reason?: string }>({ open: false });

  useEffect(() => { localStorage.setItem(PLAN_KEY, plan); }, [plan]);
  useEffect(() => { localStorage.setItem(LIB_KEY, JSON.stringify(library)); }, [library]);

  const limits = PLAN_LIMITS[plan];

  const setPlan = useCallback((p: Plan) => setPlanState(p), []);

  const openUpgrade = useCallback((reason?: string) => setShowUpgrade({ open: true, reason }), []);
  const closeUpgrade = useCallback(() => setShowUpgrade({ open: false }), []);

  const saveCV = useCallback((name: string, data: CVData, id?: string) => {
    let result: { ok: boolean; id?: string; reason?: string } = { ok: false };
    setLibrary(prev => {
      if (id) {
        const idx = prev.findIndex(c => c.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], name, data, updatedAt: Date.now() };
          result = { ok: true, id };
          return next;
        }
      }
      // new CV — check limit
      if (limits.maxCVs !== -1 && prev.length >= limits.maxCVs) {
        result = { ok: false, reason: 'limit' };
        return prev;
      }
      const newId = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      result = { ok: true, id: newId };
      return [
        { id: newId, name, data, createdAt: Date.now(), updatedAt: Date.now() },
        ...prev,
      ];
    });
    return result;
  }, [limits.maxCVs]);

  const deleteCV = useCallback((id: string) => {
    setLibrary(prev => prev.filter(c => c.id !== id));
  }, []);

  const duplicateCV = useCallback((id: string) => {
    setLibrary(prev => {
      const cv = prev.find(c => c.id === id);
      if (!cv) return prev;
      if (limits.maxCVs !== -1 && prev.length >= limits.maxCVs) {
        setShowUpgrade({ open: true, reason: 'limit' });
        return prev;
      }
      const newId = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      return [
        { ...cv, id: newId, name: `${cv.name} (Copy)`, createdAt: Date.now(), updatedAt: Date.now() },
        ...prev,
      ];
    });
  }, [limits.maxCVs]);

  const getCV = useCallback((id: string) => library.find(c => c.id === id), [library]);

  const canCreateNewCV = limits.maxCVs === -1 || library.length < limits.maxCVs;

  const isTemplateLocked = useCallback((template: string) => {
    if (plan === 'premium') return false;
    if (plan === 'pro') return PREMIUM_TEMPLATES.includes(template);
    // free
    return !FREE_TEMPLATES.includes(template);
  }, [plan]);

  return (
    <PlanContext.Provider value={{
      plan, setPlan, limits, library, saveCV, deleteCV, duplicateCV, getCV,
      canCreateNewCV, isTemplateLocked,
      showUpgrade, openUpgrade, closeUpgrade,
    }}>
      {children}
    </PlanContext.Provider>
  );
};
