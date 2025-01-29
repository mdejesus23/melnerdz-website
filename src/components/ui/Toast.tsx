import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  onClose,
}: ToastProps): JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'rounded-md bg-project border border-lblue text-white',
  };

  return (
    <div
      class={`rounded-lg px-4 py-2 shadow-md transition-opacity duration-300 ${typeStyles[type]}`}
    >
      <div class="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          class="ml-4 text-lg font-bold leading-none hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
