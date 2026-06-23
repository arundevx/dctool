"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DownloadCloud, Video, Download, Loader2, Music } from "lucide-react";
import axios from "axios";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { API_URL, getFilenameFromResponse } from "@/lib/api";

interface FormatInfo {
  format_id: string;
  ext: string;
  resolution: string;
  label: string;
  filesize: number;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  formats: FormatInfo[];
}

export default function DownloaderClient() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    if (!url.trim()) return;
    
    setFetchingInfo(true);
    setError(null);
    setInfo(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/downloader/info`, { url });
      setInfo(response.data);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to fetch video information. Ensure the URL is valid.");
      }
    } finally {
      setFetchingInfo(false);
    }
  };

  const handleDownload = async (formatId: string) => {
    setDownloadingFormat(formatId);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/downloader/download`,
        { url, format_id: formatId },
        { responseType: "blob" }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        getFilenameFromResponse(response, `${info?.title || "video"}.mp4`)
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      setError("Download failed. The file may be too large or the format is no longer available.");
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(
        CATEGORY_META.downloader.label,
        CATEGORY_META.downloader.href,
        "Video Downloader"
      )}
      title="Online Video Downloader"
      description="Download videos and audio from hundreds of supported websites. Fast, high-quality, and completely free."
      icon={<DownloadCloud className="h-10 w-10 text-indigo-500" />}
      colorTheme="indigo"
      privacyMode="server"
      maxWidth="5xl"
    >
        <div className="glass-panel rounded-3xl overflow-hidden mb-8 p-8 md:p-12 border-white/5">
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              className="h-16 text-lg glass-panel border-white/10 rounded-2xl flex-1 px-6 bg-black/20 focus-visible:ring-violet-500" 
              placeholder="Paste video URL here (YouTube, Twitter, TikTok, etc...)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInfo()}
            />
            <Button 
              size="lg" 
              className="h-16 px-10 text-lg rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-[0_0_30px_-10px_rgba(139,92,246,0.5)] transition-all hover:scale-105 border-0 gap-3 whitespace-nowrap" 
              onClick={fetchInfo}
              disabled={fetchingInfo || !url.trim()}
            >
              {fetchingInfo ? (
                <><Loader2 className="h-6 w-6 animate-spin" /> Fetching...</>
              ) : (
                <><DownloadCloud className="h-6 w-6" /> Extract Links</>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 text-destructive text-center font-medium rounded-xl border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        {info && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="col-span-1">
              <div className="glass-panel rounded-3xl p-6 border-white/5 flex flex-col items-center text-center sticky top-8">
                {info.thumbnail ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/10">
                    <img src={info.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-xl mb-4 bg-black/40 border border-white/10 flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <h3 className="font-bold text-lg line-clamp-2 mb-2">{info.title}</h3>
                <span className="text-sm text-muted-foreground bg-white/5 px-4 py-1 rounded-full">{Math.floor(info.duration / 60)}:{String(info.duration % 60).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Download className="h-6 w-6 text-violet-400" /> Available Formats
              </h3>
              
              <div className="space-y-3">
                {info.formats.map((format, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${format.label.includes("Audio") ? "bg-fuchsia-500/10 text-fuchsia-400" : "bg-violet-500/10 text-violet-400"}`}>
                        {format.label.includes("Audio") ? <Music className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{format.label.split(' - ')[0]} <span className="text-muted-foreground text-sm uppercase tracking-wider ml-2">{format.ext}</span></div>
                        <div className="text-sm text-muted-foreground mt-1">{format.label.split(' - ').slice(1).join(' - ')}</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full sm:w-auto glass-button rounded-xl px-6 h-12 text-base border-violet-500/30 hover:border-violet-500/50"
                      onClick={() => handleDownload(format.format_id)}
                      disabled={downloadingFormat !== null}
                    >
                      {downloadingFormat === format.format_id ? (
                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Downloading...</>
                      ) : (
                        <><Download className="h-5 w-5 mr-2" /> Download</>
                      )}
                    </Button>
                  </div>
                ))}
                
                {info.formats.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground glass-panel rounded-2xl border-white/5">
                    No downloadable formats found for this URL.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!info && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col items-center text-center">
              <div className="bg-purple-500/10 p-4 rounded-2xl mb-6">
                <Video className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">100+ Supported Sites</h3>
              <p className="text-muted-foreground">Download from YouTube, Instagram, X (Twitter), Facebook, TikTok, Reddit, Vimeo, and many more.</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col items-center text-center">
              <div className="bg-fuchsia-500/10 p-4 rounded-2xl mb-6">
                <Download className="h-8 w-8 text-fuchsia-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Quality & Fast</h3>
              <p className="text-muted-foreground">Extract the highest available resolutions (up to 4K) or strip the audio instantly into high-quality MP3/M4A.</p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col items-center text-center">
              <div className="bg-violet-500/10 p-4 rounded-2xl mb-6">
                <DownloadCloud className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Free, No Ads</h3>
              <p className="text-muted-foreground">No hidden fees, no annoying popups, and no watermarks. A clean, premium experience forever.</p>
            </div>
          </div>
        )}
    </ToolLayout>
  );
}
