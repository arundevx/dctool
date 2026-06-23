import { GlobalSearch } from "@/components/layout/global-search";

export function HomeHeroSearch() {
  return (
    <div className="w-full max-w-xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both flex justify-center px-4">
      <GlobalSearch hero />
    </div>
  );
}
