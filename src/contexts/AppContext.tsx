import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface DashboardStatus {
  hasProfile?: boolean;
  businessName?: string;
  onboardingCompleted?: boolean;
  checklist?: {
    hasLogo: boolean;
    hasServices: boolean;
    hasQr: boolean;
    hasReviewLink: boolean;
    isPublished: boolean;
  };
  stats?: {
    views: number;
    scans: number;
    reviews: number;
    leads: number;
  };
  subscription?: {
    plan?: string;
    isActive?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface AppContextType {
  user: User | null;
  userLoading: boolean;
  status: DashboardStatus | null;
  statusLoading: boolean;
  refreshUser: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  clearSession: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUser(json.data);
          // Sync with localStorage for any legacy pages/components
          localStorage.setItem('currentUser', JSON.stringify(json.data));
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Error fetching user', e);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/business/dashboard-status');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // Normalize status response (handle direct data or nested structure)
          setStatus(json.data || json);
        } else {
          setStatus(null);
        }
      } else {
        setStatus(null);
      }
    } catch (e) {
      console.error('Error fetching dashboard status', e);
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus(null);
    setSessionInitialized(false);
    localStorage.removeItem('currentUser');
  }, []);

  useEffect(() => {
    const isAppRoute = router.pathname.startsWith('/app') || router.pathname.startsWith('/admin');
    if (!isAppRoute) {
      // Reset state and initialization if leaving app routes
      setSessionInitialized(false);
      return;
    }

    if (!sessionInitialized) {
      setSessionInitialized(true);
      setUserLoading(true);
      setStatusLoading(true);
      refreshUser();
      refreshStatus();
    }
  }, [router.pathname, sessionInitialized, refreshUser, refreshStatus]);

  return (
    <AppContext.Provider
      value={{
        user,
        userLoading,
        status,
        statusLoading,
        refreshUser,
        refreshStatus,
        clearSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
