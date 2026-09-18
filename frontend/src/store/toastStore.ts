import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

let toastId = 0;

interface ToastState {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, title, message, duration) => {
    const id = String(++toastId);
    set((state) => ({ toasts: [...state.toasts, { id, type, title, message, duration }] }));
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().addToast('success', title, message),
  error: (title: string, message?: string) =>
    useToastStore.getState().addToast('error', title, message),
  warning: (title: string, message?: string) =>
    useToastStore.getState().addToast('warning', title, message),
  info: (title: string, message?: string) =>
    useToastStore.getState().addToast('info', title, message),
};
