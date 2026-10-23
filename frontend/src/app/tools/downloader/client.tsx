"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Syne, DM_Sans } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Download,
  Headphones,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "@/lib/axios";
import { getFilenameFromResponse, parseApiBlobError } from "@/lib/api";
import { cn } from "@/lib/utils";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-dl-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dl-body",
});

interface FormatInfo {
  format_id: string;
  ext: string;
  resolution: string;
  label: string;
  kind: "video" | "audio";
  filesize: number;
  filesize_label?: string | null;
  recommended?: boolean;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader?: string;
  extractor?: string;
  webpage_url?: string;
  view_count?: number | null;
  has_ffmpeg?: boolean;
  formats: FormatInfo[];
}

function formatDuration(seconds: number) {
  if (!seconds || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(n?: number | null) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export default function DownloaderClient() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");

  const videoFormats = useMemo(
    () => info?.formats.filter((f) => f.kind === "video") ?? [],
    [info]
  );
  const audioFormats = useMemo(
    () => info?.formats.filter((f) => f.kind === "audio") ?? [],
    [info]
  );
  const visibleFormats = activeTab === "video" ? videoFormats : audioFormats;

  const fetchInfo = async () => {
    if (!url.trim()) return;

    setFetchingInfo(true);
    setError(null);
    setInfo(null);

    try {
      const response = await api.post("/downloader/info", { url: url.trim() });
      setInfo(response.data);
      setActiveTab("video");
    } catch (err: unknown) {
      const message = await parseApiBlobError(err);
      setError(message || "Failed to fetch media info. Check the URL and try again.");
    } finally {
      setFetchingInfo(false);
    }
  };

  const handleDownload = async (formatId: string) => {
    setDownloadingFormat(formatId);
    setError(null);

    try {
      const response = await api.post(
        "/downloader/download",
        { url: url.trim(), format_id: formatId },
        { responseType: "blob", timeout: 600_000 }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      const fallbackExt = formatId.includes("mp3") ? "mp3" : formatId.includes("m4a") ? "m4a" : "mp4";
      link.setAttribute(
        "download",
        getFilenameFromResponse(response, `${info?.title || "download"}.${fallbackExt}`)
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: unknown) {
      const message = await parseApiBlobError(err);
      setError(message || "Download failed. The file may be too large or temporarily unavailable.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div
      className={cn(
        display.variable,
        body.variable,
        "dl-root dark min-h-screen text-[#e8ecef] antialiased"
      )}
      style={{ fontFamily: "var(--font-dl-body), system-ui, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#06080b]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_15%_-10%,rgba(45,212,168,0.16),transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(56,120,180,0.14),transparent_50%),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(20,40,60,0.5),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06080b]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white/80"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">DreamConsole</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2dd4a8]/15 text-[#2dd4a8] ring-1 ring-[#2dd4a8]/25">
                <Clapperboard className="h-4 w-4" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-dl-display), sans-serif" }}
                >
                  Pulse Downloader
                </p>
                <p className="text-[11px] text-white/35">Powered by yt-dlp</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/35">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4a8]" />
              Online
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#2dd4a8]/80">
            Universal media fetch
          </p>
          <h1
            className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-dl-display), sans-serif" }}
          >
            Pulse{" "}
            <span className="bg-gradient-to-r from-[#2dd4a8] to-[#5ec8ff] bg-clip-text text-transparent">
              Downloader
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Paste any video or audio URL. Extract the best quality streams, merge with ffmpeg, and
            download in one click.
          </p>

          <form
            className="mt-10"
            onSubmit={(e) => {
              e.preventDefault();
              fetchInfo();
            }}
          >
            <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-colors focus-within:border-[#2dd4a8]/40 focus-within:bg-white/[0.045] sm:flex-row sm:items-stretch sm:p-2">
              <input
                className="h-14 flex-1 bg-transparent px-4 text-base text-white placeholder:text-white/30 outline-none sm:text-lg"
                placeholder="https://youtube.com/watch?v=… or any supported URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={fetchingInfo || !url.trim()}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#2dd4a8] px-7 text-base font-semibold text-[#04120e] transition hover:bg-[#4ae0b8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {fetchingInfo ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {!info && !fetchingInfo && (
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Best stream merge",
                  body: "Picks highest video + audio and merges to MP4 when ffmpeg is available.",
                },
                {
                  icon: Headphones,
                  title: "Audio extraction",
                  body: "Pull clean M4A or convert to MP3 192kbps without the video track.",
                },
                {
                  icon: Sparkles,
                  title: "1000+ sites",
                  body: "YouTube, TikTok, X, Instagram, Vimeo, Reddit, and everything yt-dlp supports.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
                  style={{ animationDelay: `${150 + i * 80}ms` }}
                >
                  <item.icon className="mb-4 h-5 w-5 text-[#2dd4a8]" />
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: "var(--font-dl-display), sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{item.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {info && (
          <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] animate-in fade-in slide-in-from-bottom-5 duration-500">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-video bg-black/50">
                  {info.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={info.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <Clapperboard className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium tabular-nums text-white">
                    {formatDuration(info.duration)}
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <h2
                    className="text-lg font-semibold leading-snug text-white"
                    style={{ fontFamily: "var(--font-dl-display), sans-serif" }}
                  >
                    {info.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-white/40">
                    {info.uploader && (
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1">
                        {info.uploader}
                      </span>
                    )}
                    {info.extractor && (
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 uppercase tracking-wide">
                        {info.extractor}
                      </span>
                    )}
                    {formatViews(info.view_count) && (
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1">
                        {formatViews(info.view_count)}
                      </span>
                    )}
                  </div>
                  {info.has_ffmpeg && (
                    <p className="flex items-center gap-1.5 text-xs text-[#2dd4a8]/80">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ffmpeg merge enabled
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h3
                    className="text-2xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-dl-display), sans-serif" }}
                  >
                    Choose quality
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    Best quality merges video + audio automatically.
                  </p>
                </div>
                <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                  {(
                    [
                      ["video", "Video", videoFormats.length],
                      ["audio", "Audio", audioFormats.length],
                    ] as const
                  ).map(([key, label, count]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        "rounded-lg px-3.5 py-1.5 text-sm font-medium transition",
                        activeTab === key
                          ? "bg-white/10 text-white"
                          : "text-white/40 hover:text-white/70"
                      )}
                    >
                      {label}
                      <span className="ml-1.5 tabular-nums text-white/30">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {visibleFormats.map((format) => {
                  const isDownloading = downloadingFormat === format.format_id;
                  const busy = downloadingFormat !== null;
                  return (
                    <div
                      key={format.format_id}
                      className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 transition hover:border-white/15 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            format.kind === "audio"
                              ? "bg-sky-400/10 text-sky-300"
                              : "bg-[#2dd4a8]/10 text-[#2dd4a8]"
                          )}
                        >
                          {format.kind === "audio" ? (
                            <Headphones className="h-5 w-5" />
                          ) : (
                            <Clapperboard className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">{format.label}</p>
                            {format.recommended && (
                              <span className="rounded border border-[#2dd4a8]/30 bg-[#2dd4a8]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2dd4a8]">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-white/35">
                            <span className="uppercase">{format.ext}</span>
                            {format.filesize_label ? ` · ${format.filesize_label}` : ""}
                            {" · "}
                            {format.resolution}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDownload(format.format_id)}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white transition hover:border-[#2dd4a8]/40 hover:bg-[#2dd4a8]/15 hover:text-[#2dd4a8] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Downloading…
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}

                {visibleFormats.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-white/35">
                    No {activeTab} formats available for this URL.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
