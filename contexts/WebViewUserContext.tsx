import React, { createContext, useContext, useState, useCallback } from 'react';

type WebViewUserContextType = {
  isAdmin: boolean;
  setAuthorities: (authorities: string[]) => void;
  clearAuthorities: () => void;
};

const WebViewUserContext = createContext<WebViewUserContextType | null>(null);

const ROLE_ADMIN = 'ROLE_ADMIN';

export function WebViewUserProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const setAuthorities = useCallback((authorities: string[]) => {
    // Tránh flicker: không ghi đè bằng [] khi đang trên trang private (web remount gửi [] trước khi getAccount xong).
    // Chỉ cập nhật khi có danh sách thật; việc clear (logout) xử lý ở EmbedWebView khi URL là public path.
    if (Array.isArray(authorities) && authorities.length > 0) {
      setIsAdmin(authorities.includes(ROLE_ADMIN));
    }
  }, []);

  const clearAuthorities = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <WebViewUserContext.Provider value={{ isAdmin, setAuthorities, clearAuthorities }}>
      {children}
    </WebViewUserContext.Provider>
  );
}

export function useWebViewUser() {
  const ctx = useContext(WebViewUserContext);
  if (!ctx) throw new Error('useWebViewUser must be used within WebViewUserProvider');
  return ctx;
}
