import { useUIStore, selectToasts } from '@/store/useUIStore';

const toastStyles = {
  success: 'bg-emerald-600 text-white border-emerald-700',
  error: 'bg-red-600 text-white border-red-700',
  info: 'bg-blue-600 text-white border-blue-700',
  warning: 'bg-amber-600 text-white border-amber-700',
};

export default function Toaster() {
  const toasts = useUIStore(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg border shadow-lg ${toastStyles[toast.type]}`}
          role="alert"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
