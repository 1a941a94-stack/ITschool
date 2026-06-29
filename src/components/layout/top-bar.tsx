export function TopBar() {
  return (
    <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_10px_32px_-26px_rgba(15,23,42,0.6)] sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Центр IT Карьеры</p>
        <h1 className="text-base font-semibold sm:text-lg">Образовательная платформа</h1>
      </div>
      <div className="rounded-2xl bg-muted px-3 py-2 text-xs font-medium text-muted-foreground sm:text-sm">
        Premium EdTech Experience
      </div>
    </header>
  );
}
