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

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Please enter an email address.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    return null;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setMessage('');

    const validationError = validateEmail(email);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);

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
            className="bg-bg-secondary/60 focus:border-accent/50 focus:ring-accent/20 w-full rounded-xl border border-border px-5 py-3.5 text-white placeholder-text-muted backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 dark:text-black"
            placeholder="Enter your email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
        </div>
        <button
          type="submit"
          className="group relative overflow-hidden rounded-xl bg-accent px-6 py-3.5 font-medium text-bg-primary transition-all duration-300 hover:shadow-glow disabled:opacity-50"
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
          <div className="absolute inset-0 -translate-x-full bg-accent-light transition-transform duration-300 group-hover:translate-x-0" />
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
      <p className="mt-4 text-xs text-text-muted">
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
