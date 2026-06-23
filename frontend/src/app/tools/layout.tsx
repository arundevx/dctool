export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="container mx-auto px-4 md:px-8 mt-12 mb-4 max-w-4xl">
        <div className="bg-gradient-to-r from-amber-100/50 to-amber-50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl p-3 text-center shadow-sm">
          <span className="text-sm text-amber-900 dark:text-amber-200 font-medium flex items-center justify-center gap-2">
            <span>☕ Enjoying our free tools?</span>
            <a href="https://buymeacoffee.com/arun_0" target="_blank" rel="noopener noreferrer" className="underline decoration-amber-500/50 hover:decoration-amber-500 hover:text-amber-700 dark:hover:text-amber-100 font-bold transition-all">
              Buy me a coffee!
            </a>
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
