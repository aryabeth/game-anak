export function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main id="main" className={`mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-4 pb-12 sm:px-6 ${className}`}>
      {children}
    </main>
  );
}
