import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-project border border-lblue text-white',
  };

  return (
    <div
      className={`rounded-lg px-4 py-2 shadow-md transition-opacity duration-300 ${typeStyles[type]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-center text-sm md:text-base">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-xs font-bold leading-none hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
