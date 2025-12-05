import { useState } from 'react';
import Toast from '../ui/Toast';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function NewsletterForm({
  workerEndpoint,
}: {
  workerEndpoint: string;
}) {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email) {
      setMessage('⚠️ Please enter a valid email address.');
      setLoading(false);
      return;
    }

    const response = await fetch(workerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      addToast('Newsletter subscription failed. Please try again.', 'error');
      setLoading(false);
      return;
    }

    addToast('Subscribed successfully. Thank you!', 'success');
    setEmail('');
    setLoading(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="email"
            className="w-full rounded-xl border border-[rgba(168,162,158,0.15)] bg-[rgba(12,10,9,0.6)] px-5 py-3.5 text-[#fafaf9] placeholder-[#a8a29e] transition-all duration-300 focus:border-[#f59e0b]/50 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20"
            placeholder="Enter your email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
        </div>
        <button
          type="submit"
          className="group relative overflow-hidden rounded-xl bg-[#f59e0b] px-6 py-3.5 font-medium text-[#0c0a09] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
          disabled={loading}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Subscribing...
              </>
            ) : (
              <>
                Subscribe
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-[#fbbf24] transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
      <p className="mt-4 text-xs text-[#a8a29e]">
        By subscribing, you agree to receive occasional updates. Unsubscribe
        anytime.
      </p>
      <div className="fixed left-1/2 top-4 z-50 min-w-80 -translate-x-1/2 space-y-2">
        {toasts.map(({ id, message, type }) => (
          <Toast
            key={id}
            message={message}
            type={type}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </div>
  );
}
