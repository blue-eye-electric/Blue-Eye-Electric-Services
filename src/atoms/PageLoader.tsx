const PageLoader = () => {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background text-primary">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default PageLoader;
