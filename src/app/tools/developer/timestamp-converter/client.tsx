"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Check } from "lucide-react";

export default function TimestampClient() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState<string>("");
  const [inputDate, setInputDate] = useState<string>("");
  
  const [convertedDate, setConvertedDate] = useState<string>("");
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>("");

  const [copiedTime, setCopiedTime] = useState(false);
  const [copiedTs, setCopiedTs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputTimestamp(val);
    if (!val) {
      setConvertedDate("");
      return;
    }
    const ts = parseInt(val, 10);
    if (!isNaN(ts)) {
      // Handle both seconds and milliseconds
      const date = new Date(val.length > 10 ? ts : ts * 1000);
      setConvertedDate(date.toString());
    } else {
      setConvertedDate("Invalid Timestamp");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputDate(val);
    if (!val) {
      setConvertedTimestamp("");
      return;
    }
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString());
    } else {
      setConvertedTimestamp("Invalid Date string");
    }
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
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
          <Clock className="h-8 w-8 text-purple-500" />
          Unix Timestamp Converter
        </h1>
        <p className="text-muted-foreground">Convert Unix timestamps to dates and vice-versa.</p>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg border mb-8 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">Current Unix Timestamp</p>
        <div className="flex items-center gap-4">
          <code className="text-3xl font-mono font-bold bg-background px-4 py-2 rounded-md border shadow-sm">
            {currentTimestamp}
          </code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timestamp to Date */}
        <div className="space-y-4 bg-background p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-2">Timestamp to Date</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Unix Timestamp</label>
            <Input 
              placeholder="e.g. 1672531200" 
              value={inputTimestamp}
              onChange={handleTimestampChange}
              className="font-mono"
            />
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Result (Local Time)</label>
              {convertedDate && convertedDate !== "Invalid Timestamp" && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(convertedDate, "time")}>
                  {copiedTime ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
              )}
            </div>
            <div className="min-h-[40px] p-2 bg-muted/50 rounded border flex items-center">
              <span className={convertedDate === "Invalid Timestamp" ? "text-destructive" : ""}>
                {convertedDate || "Waiting for input..."}
              </span>
            </div>
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="space-y-4 bg-background p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-2">Date to Timestamp</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date / Time String</label>
            <Input 
              placeholder="e.g. 2023-01-01 12:00:00" 
              value={inputDate}
              onChange={handleDateChange}
            />
            <p className="text-xs text-muted-foreground">Accepts most common date formats (ISO, RFC, etc).</p>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Unix Timestamp (Seconds)</label>
              {convertedTimestamp && convertedTimestamp !== "Invalid Date string" && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(convertedTimestamp, "ts")}>
                  {copiedTs ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
              )}
            </div>
            <div className="min-h-[40px] p-2 bg-muted/50 rounded border flex items-center font-mono text-lg">
              <span className={convertedTimestamp === "Invalid Date string" ? "text-destructive font-sans text-base" : ""}>
                {convertedTimestamp || "Waiting for input..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
