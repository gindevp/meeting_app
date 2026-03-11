import React, { createContext, useCallback, useContext, useState } from 'react';

type NavVisibilityContextType = {
  showNav: boolean;
  setShowNavFromUrl: (url: string) => void;
};

const NavVisibilityContext = createContext<NavVisibilityContextType | null>(null);

export function NavVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(false);

  const setShowNavFromUrl = useCallback((url: string) => {
    if (isPublicPath(url)) {
      setShowNav(false);
      return;
    }
    try {
      const pathname = new URL(url).pathname;
      if (pathname === '/' || pathname === '') {
        setShowNav(true);
        return;
      }
    } catch {
      setShowNav(false);
      return;
    }
    setShowNav(true);
  }, []);

  return (
    <NavVisibilityContext.Provider value={{ showNav, setShowNavFromUrl }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  const ctx = useContext(NavVisibilityContext);
  if (!ctx) throw new Error('useNavVisibility must be used within NavVisibilityProvider');
  return ctx;
}

/** Trang công khai (chưa đăng nhập): ẩn nav + theme */
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/activate'];

export function isPublicPath(url: string): boolean {
  try {
    const path = new URL(url).pathname;
    return PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '?') || path.startsWith(p + '#'));
  } catch {
    return true;
  }
}
