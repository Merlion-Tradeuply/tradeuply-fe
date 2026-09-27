export default function ClientAreaLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading client area"
      className="mt-[7.5rem] min-h-screen min-w-0 overflow-x-clip bg-[#f4f8f6] pb-14 sm:mt-[8.5rem] sm:pb-20 lg:mt-36"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-5 px-3 pt-5 sm:px-6 sm:pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-7 lg:px-8">
        <div className="h-28 animate-pulse rounded-[1.5rem] bg-[var(--color-ink)] lg:h-96" />
        <section className="min-w-0">
          <div className="h-4 w-24 animate-pulse rounded-full bg-emerald-200" />
          <div className="mt-4 h-10 w-56 max-w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-slate-200" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="h-64 animate-pulse rounded-[1.7rem] bg-white shadow-sm" />
            <div className="h-64 animate-pulse rounded-[1.7rem] bg-white shadow-sm" />
          </div>
        </section>
      </div>
    </main>
  );
}
