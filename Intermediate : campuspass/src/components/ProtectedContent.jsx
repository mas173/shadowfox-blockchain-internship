export default function ProtectedContent({
  isAllowed,
  isLoading,
  fallback,
  children,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-700">
          Verifying membership...
        </p>
      </div>
    );
  }

  if (!isAllowed) return fallback ?? null;

  return <>{children}</>;
}
