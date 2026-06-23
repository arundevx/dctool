"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Check } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

export default function TimestampClient() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedTimestamp, setConvertedTimestamp] = useState("");
  const [copiedTime, setCopiedTime] = useState(false);
  const [copiedTs, setCopiedTs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTimestamp(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputTimestamp(val);
    if (!val) { setConvertedDate(""); return; }
    const ts = parseInt(val, 10);
    if (!isNaN(ts)) {
      setConvertedDate(new Date(val.length > 10 ? ts : ts * 1000).toString());
    } else {
      setConvertedDate("Invalid Timestamp");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputDate(val);
    if (!val) { setConvertedTimestamp(""); return; }
    const date = new Date(val);
    setConvertedTimestamp(!isNaN(date.getTime()) ? Math.floor(date.getTime() / 1000).toString() : "Invalid Date string");
  };

  const handleCopy = (text: string, type: "time" | "ts") => {
    navigator.clipboard.writeText(text);
    if (type === "time") {
      setCopiedTime(true);
      setTimeout(() => setCopiedTime(false), 2000);
    } else {
      setCopiedTs(true);
      setTimeout(() => setCopiedTs(false), 2000);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Timestamp Converter")}
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and vice-versa."
      icon={<Clock className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="4xl"
      toolHref="/tools/developer/timestamp-converter"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="p-6 rounded-xl bg-muted/30 border border-black/10 dark:border-white/15 text-center">
          <p className="text-sm text-muted-foreground mb-2">Current Unix Timestamp</p>
          <code className="text-3xl font-mono font-bold">{currentTimestamp}</code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-xl border border-black/10 dark:border-white/15">
            <h2 className="font-semibold border-b pb-2">Timestamp → Date</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unix Timestamp</label>
              <Input placeholder="e.g. 1672531200" value={inputTimestamp} onChange={handleTimestampChange} className="font-mono h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Result</label>
                {convertedDate && convertedDate !== "Invalid Timestamp" && (
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(convertedDate, "time")}>
                    {copiedTime ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
              <p className={`text-sm p-3 rounded-lg bg-muted/50 min-h-[48px] ${convertedDate === "Invalid Timestamp" ? "text-destructive" : ""}`}>
                {convertedDate || "Waiting for input..."}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-5 rounded-xl border border-black/10 dark:border-white/15">
            <h2 className="font-semibold border-b pb-2">Date → Timestamp</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date / Time String</label>
              <Input placeholder="e.g. 2023-01-01 12:00:00" value={inputDate} onChange={handleDateChange} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Unix Timestamp (seconds)</label>
                {convertedTimestamp && convertedTimestamp !== "Invalid Date string" && (
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(convertedTimestamp, "ts")}>
                    {copiedTs ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
              <p className={`text-sm font-mono p-3 rounded-lg bg-muted/50 min-h-[48px] ${convertedTimestamp === "Invalid Date string" ? "text-destructive font-sans" : ""}`}>
                {convertedTimestamp || "Waiting for input..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
