"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { ALL_TOOLS } from "@/lib/tools";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

export default function ToolsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // tool_id (href) -> settings
  const [toolSettings, setToolSettings] = useState<Record<string, { is_enabled: boolean; guest_limit: number | "" }>>({});

  useEffect(() => {
    fetchToolSettings();
  }, []);

  const fetchToolSettings = async () => {
    try {
      const { data } = await api.get("/admin/tools");
      const settingsMap: Record<string, { is_enabled: boolean; guest_limit: number | "" }> = {};
      
      // Initialize with defaults for all frontend tools
      ALL_TOOLS.forEach(tool => {
        settingsMap[tool.href] = { is_enabled: true, guest_limit: "" };
      });
      
      // Override with DB settings
      data.forEach((setting: any) => {
        if (settingsMap[setting.tool_id]) {
          settingsMap[setting.tool_id] = {
            is_enabled: setting.is_enabled,
            guest_limit: setting.guest_limit === null ? "" : setting.guest_limit
          };
        }
      });
      
      setToolSettings(settingsMap);
    } catch (error) {
      toast.error("Failed to load tool settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTool = async (toolId: string) => {
    setSaving(toolId);
    try {
      const settings = toolSettings[toolId];
      await api.put(`/admin/tools${toolId}`, {
        is_enabled: settings.is_enabled,
        guest_limit: settings.guest_limit === "" ? null : parseInt(settings.guest_limit as string)
      });
      toast.success("Tool settings updated");
    } catch (error) {
      toast.error("Failed to update tool");
    } finally {
      setSaving(null);
    }
  };

  const handleSettingChange = (toolId: string, key: "is_enabled" | "guest_limit", value: any) => {
    setToolSettings(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [key]: value
      }
    }));
  };

  const filteredTools = ALL_TOOLS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-muted-foreground text-center py-10">Loading tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 dark:border-white/5 pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Tool Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Enable/disable tools and set custom guest limits</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/5 dark:bg-white/5 border-white/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTools.map((tool) => {
          const settings = toolSettings[tool.href];
          if (!settings) return null;

          return (
            <div key={tool.href} className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-base">{tool.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${settings.is_enabled ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}`}>
                    {settings.is_enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <Switch 
                  checked={settings.is_enabled}
                  onCheckedChange={(val) => handleSettingChange(tool.href, "is_enabled", val)}
                />
              </div>

              <div className="flex items-end justify-between mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="space-y-1 w-1/2">
                  <Label className="text-xs text-muted-foreground">Custom Guest Limit</Label>
                  <Input 
                    type="number"
                    min="0"
                    placeholder="Global default"
                    value={settings.guest_limit}
                    onChange={(e) => handleSettingChange(tool.href, "guest_limit", e.target.value)}
                    className="h-8 text-sm bg-transparent"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateTool(tool.href)}
                  disabled={saving === tool.href}
                  className="bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                >
                  {saving === tool.href && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                  Save
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
