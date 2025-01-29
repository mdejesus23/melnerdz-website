import { useState } from 'preact/hooks';

interface NewsletterFormProps {}

export default function NewsletterForm({}: NewsletterFormProps) {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('🎉 Subscription successful!');
        setEmail('');
      } else {
        setMessage(data.error || '⚠️ Subscription failed.');
      }
    } catch (error) {
      setMessage('❌ An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div class="w-full">
      <form
        onSubmit={handleSubmit}
        class="items-centerrounded-md flex w-full rounded-lg bg-project p-2 shadow-projectCard"
      >
        <input
          type="email"
          class="w-full rounded-md border border-projectDesc bg-pblue px-4 py-2 text-projectDesc focus:outline-none focus:ring-2 focus:ring-lblue"
          placeholder="Enter your email"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
        />
        <button
          type="submit"
          class="ml-2 rounded-lg bg-lblue px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-400 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && <p class="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
