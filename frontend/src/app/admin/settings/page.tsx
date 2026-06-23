"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [globalGuestLimit, setGlobalGuestLimit] = useState(3);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/admin/settings");
      setRegistrationEnabled(data.registration_enabled);
      setGlobalGuestLimit(data.global_guest_limit);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", {
        registration_enabled: registrationEnabled,
        global_guest_limit: globalGuestLimit,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 dark:border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold">Global Site Settings</h2>
          <p className="text-muted-foreground text-sm mt-1">Configure platform rules and limits</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white hover:bg-indigo-700">
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6 max-w-xl">
        <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">User Registration</Label>
            <p className="text-sm text-muted-foreground">Allow new users to sign up for accounts</p>
          </div>
          <Switch 
            checked={registrationEnabled}
            onCheckedChange={setRegistrationEnabled}
          />
        </div>

        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 space-y-4">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Global Guest Limit</Label>
            <p className="text-sm text-muted-foreground">Maximum total tool uses for unregistered IP addresses before blocking</p>
          </div>
          <Input 
            type="number" 
            min="0"
            value={globalGuestLimit}
            onChange={(e) => setGlobalGuestLimit(parseInt(e.target.value) || 0)}
            className="w-full max-w-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
