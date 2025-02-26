import { useState } from 'react';
import Toast from '../ui/Toast';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function NewsletterForm() {
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

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email) {
      setMessage('⚠️ Please enter a valid email address.');
      setLoading(false);
      return;
    }

    addToast('⚠️ This feature is under development..', 'info');

    // try {
    //   const response = await fetch('/api/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     setMessage('🎉 Subscription successful!');
    //     setEmail('');
    //   } else {
    //     setMessage(data.error || '⚠️ Subscription failed.');
    //   }
    // } catch (error) {
    //   setMessage('❌ An error occurred. Please try again.');
    // }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="items-centerrounded-md flex w-full rounded-md bg-project"
      >
        <input
          type="email"
          className="w-full rounded-md border border-projectDesc bg-pblue px-4 py-2 text-projectDesc focus:outline-none focus:ring-2 focus:ring-lblue"
          placeholder="Enter your email"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <button
          type="submit"
          className="ml-2 rounded-lg bg-lblue px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-400 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && <p className="text-sm text-red-700">{message}</p>}
      <div className="fixed left-1/2 top-4 min-w-80 -translate-x-1/2 space-y-2">
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
