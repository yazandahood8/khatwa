export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <span className="grid h-16 w-16 animate-float place-items-center rounded-2xl bg-primary font-display text-4xl font-bold text-primary-foreground shadow-glow-primary">
          خ
        </span>
        <p className="font-display text-lg font-bold text-muted-foreground">جارٍ التحميل…</p>
      </div>
    </main>
  );
}
