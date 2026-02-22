'use client';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <h2>Page Error</h2>
      <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
        {error.message}
      </pre>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#666', fontSize: '12px' }}>
        {error.stack}
      </pre>
      <p>Digest: {error.digest}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
