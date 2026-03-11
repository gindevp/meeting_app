import React, { createContext, useCallback, useContext, useState } from 'react';

type WebViewPathContextType = {
  path: string;
  setPath: (path: string) => void;
};

const WebViewPathContext = createContext<WebViewPathContextType | null>(null);

const TAB_PATHS = ['/', '/notifications', '/settings'] as const;

export function WebViewPathProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState('/login');
  return (
    <WebViewPathContext.Provider value={{ path, setPath }}>
      {children}
    </WebViewPathContext.Provider>
  );
}

export function useWebViewPath() {
  const ctx = useContext(WebViewPathContext);
  if (!ctx) throw new Error('useWebViewPath must be used within WebViewPathProvider');
  return ctx;
}

export { TAB_PATHS };
