import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
}

interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  modals: Modal[];
  theme: 'light' | 'dark';
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => string;
  closeModal: (id: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      toasts: [],
      modals: [],
      theme: 'light',

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        // Auto remove toast after duration
        const duration = toast.duration || 3000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id: string) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      openModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newModal = { ...modal, id, isOpen: true };
        
        set((state) => ({ modals: [...state.modals, newModal] }));
        return id;
      },

      closeModal: (id: string) =>
        set((state) => ({
          modals: state.modals.filter((modal) => modal.id !== id),
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    { name: 'UIStore' }
  )
);

// Selectors
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectModals = (state: UIStore) => state.modals;
export const selectTheme = (state: UIStore) => state.theme;

