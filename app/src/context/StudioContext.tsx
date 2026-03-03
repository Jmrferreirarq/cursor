import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { StudioProfile } from '@/types';
import { DEFAULT_STUDIO_PROFILE } from '@/types';
import { localStorageService } from '@/services/localStorage';

interface StudioContextType {
  profile: StudioProfile;
  updateProfile: (patch: Partial<StudioProfile>) => void;
  updateSocial: (patch: Partial<StudioProfile['social']>) => void;
  resetProfile: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const svc = localStorageService;

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StudioProfile>(DEFAULT_STUDIO_PROFILE);

  useEffect(() => {
    try {
      const data = svc.load();
      if (data.studioProfile) setProfile(data.studioProfile);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      const existing = svc.load();
      svc.save({ ...existing, studioProfile: profile });
    } catch { /* ignore */ }
  }, [profile]);

  const updateProfile = useCallback((patch: Partial<StudioProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateSocial = useCallback((patch: Partial<StudioProfile['social']>) => {
    setProfile((prev) => ({ ...prev, social: { ...prev.social, ...patch } }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_STUDIO_PROFILE);
  }, []);

  const value = useMemo(() => ({ profile, updateProfile, updateSocial, resetProfile }), [profile, updateProfile, updateSocial, resetProfile]);

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider');
  return ctx;
}
