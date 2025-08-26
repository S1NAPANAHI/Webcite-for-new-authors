const OrnateDivider = () => (
  <div className="relative flex items-center justify-center my-12">
    <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
    <svg width="80" height="32" viewBox="0 0 80 32" className="mx-4 text-amber-500">
      <path d="M8 16L16 8L24 16L32 8L40 16L48 8L56 16L64 8L72 16" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="16" cy="8" r="2" fill="currentColor" />
      <circle cx="40" cy="16" r="2" fill="currentColor" />
      <circle cx="64" cy="8" r="2" fill="currentColor" />
    </svg>
    <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
  </div>
);

export { OrnateDivider };