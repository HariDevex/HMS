import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { currentUser } from '../data/mock';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [role, setRole] = useState(currentUser.role);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pushToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(
    () => ({ toasts, pushToast, dismissToast, role, setRole, sidebarOpen, setSidebarOpen }),
    [toasts, pushToast, dismissToast, role, sidebarOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
