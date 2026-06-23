"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { ALL_TOOLS } from "@/lib/tools";
import { Users, Activity, MousePointerClick } from "lucide-react";
import { toast } from "sonner";

interface StatsData {
  total_users: number;
  total_usages: number;
  top_tools: { tool_id: string; count: number }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const getToolName = (toolId: string) => {
    const tool = ALL_TOOLS.find((t) => t.href === toolId);
    return tool ? tool.title : toolId;
  };

  if (loading) {
    return <div className="text-muted-foreground text-center py-10">Loading statistics...</div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 dark:border-white/5 pb-6">
        <h2 className="text-xl font-bold">Platform Statistics</h2>
        <p className="text-muted-foreground text-sm mt-1">Overview of platform usage and user growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-indigo-500/20 p-4 rounded-full">
            <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Registered Users</p>
            <h3 className="text-3xl font-bold mt-1">{stats.total_users}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-fuchsia-500/20 p-4 rounded-full">
            <Activity className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Tool Executions</p>
            <h3 className="text-3xl font-bold mt-1">{stats.total_usages}</h3>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <MousePointerClick className="w-5 h-5 mr-2 text-indigo-500" />
          Top 10 Most Used Tools
        </h3>
        
        <div className="bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Tool Name</th>
                <th className="px-6 py-4 text-right">Executions</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_tools.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-muted-foreground">No usage data available yet.</td>
                </tr>
              ) : (
                stats.top_tools.map((tool, index) => (
                  <tr key={tool.tool_id} className="border-t border-black/5 dark:border-white/5">
                    <td className="px-6 py-4 font-medium text-muted-foreground">#{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{getToolName(tool.tool_id)}</td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">{tool.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
