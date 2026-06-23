import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | DreamConsole',
  description: 'Learn about the DreamConsole project and the developers behind it.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">
          About Us
        </h1>
        <p className="text-lg text-muted-foreground">The story behind DreamConsole and the people who built it.</p>
      </div>
      
      <section className="mb-16 bg-card text-card-foreground border rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
          The DC Project
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            DreamConsole (DC) is a comprehensive suite of free, fast, and secure online tools designed to simplify everyday digital tasks. 
            Whether you are a developer, a designer, or an everyday user, our platform offers a wide array of utilities—from image format conversions and PDF manipulations to developer tools and SEO generators.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Our mission is to provide an all-in-one digital toolkit that respects your privacy and saves your time, delivering high-performance tools directly from your browser without any unnecessary hassle or hidden costs.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-8 text-primary text-center">Meet the Team</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Arun */}
          <div className="bg-card text-card-foreground border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-2xl font-bold mb-1">Arun</h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">Senior Developer</p>
            <p className="text-muted-foreground mb-8 flex items-center gap-2 text-sm bg-muted/50 w-fit px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Tamil Nadu, India
            </p>
            <div className="flex gap-4 mt-auto">
              <a href="https://linkedin.com/in/xarun" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 border rounded-lg px-4 py-2 hover:border-indigo-200 dark:hover:border-indigo-800 bg-background">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a href="https://instagram.com/xarun" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors flex items-center gap-2 border rounded-lg px-4 py-2 hover:border-fuchsia-200 dark:hover:border-fuchsia-800 bg-background">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>

          {/* Sajith */}
          <div className="bg-card text-card-foreground border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-2xl font-bold mb-1">Sajith</h3>
            <p className="text-fuchsia-600 dark:text-fuchsia-400 font-medium mb-4">Full Stack Developer</p>
            <p className="text-muted-foreground mb-8 flex items-center gap-2 text-sm bg-muted/50 w-fit px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Tamil Nadu, India
            </p>
            <div className="flex gap-4 mt-auto">
              <a href="https://linkedin.com/in/sajith_loopingstory" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 border rounded-lg px-4 py-2 hover:border-indigo-200 dark:hover:border-indigo-800 bg-background">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
