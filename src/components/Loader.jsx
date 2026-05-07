const Loader = () => {
  return (
    <div className="mt-40 flex w-full flex-col items-center justify-center gap-4">
      <div className="size-16 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.2)]" />
      <p className="text-sm font-medium text-slate-500">Loading workspace</p>
    </div>
  );
};

export default Loader;
