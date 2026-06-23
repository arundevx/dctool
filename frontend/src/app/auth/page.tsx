"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MonitorSmartphone, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [step, setStep] = useState<"email" | "login" | "register">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("limit") === "true") {
      toast.error("Guest usage limit reached. Please register to continue using tools.");
    }
  }, [searchParams]);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/check-email", { email });
      if (data.exists) {
        setStep("login");
      } else {
        setStep("register");
      }
    } catch (error) {
      toast.error("Failed to check email");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const endpoint = step === "login" ? "/auth/login" : "/auth/register";
      const payload = step === "login" 
        ? new URLSearchParams({ username: email, password })
        : { email, password };
        
      const { data } = await api.post(endpoint, payload);
      
      const userRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      
      setAuth(userRes.data, data.access_token);
      toast.success(step === "login" ? "Welcome back!" : "Account created successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-16 md:-mt-24 p-4 md:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative">
        
        {/* Abstract Background Shapes for Right Side (Form) */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-50 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Left Side: Branding & Illustration */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden">
          {/* Glass Overlay Elements */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 transform -rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center space-x-2 group w-max">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <MonitorSmartphone className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">DreamConsole</span>
            </Link>
          </div>

          <div className="relative z-10 my-auto">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Unlock Your <br /> Creative Power.
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-sm mb-12">
              Join thousands of developers and creators using our suite of 50+ ultra-lightweight tools.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                  <Zap className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lightning Fast</h3>
                  <p className="text-sm text-white/70">Processed instantly in-memory.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                  <ShieldCheck className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">100% Secure</h3>
                  <p className="text-sm text-white/70">Files are never permanently stored.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center relative z-10">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                <div className="bg-indigo-500/10 p-2 rounded-xl">
                  <MonitorSmartphone className="h-8 w-8 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">DreamConsole</span>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                {step === "email" ? "Welcome back" : step === "login" ? "Sign in" : "Create account"}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                {step === "email" 
                  ? "Enter your email to continue to DreamConsole" 
                  : step === "login" 
                    ? "Enter your password to access your account" 
                    : "Set a password to create your new account"}
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={handleCheckEmail} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 px-4 rounded-xl bg-muted/50 border-white/10 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all group" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  <span>Continue</span>
                  {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email Address</Label>
                  <div className="flex justify-between items-center px-4 py-3 border border-white/10 rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground">
                    <span className="truncate mr-4">{email}</span>
                    <button type="button" onClick={() => setStep("email")} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold text-xs uppercase tracking-wider shrink-0 transition-colors">
                      Change
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold flex items-center justify-between">
                    <span>Password</span>
                    {step === "login" && (
                      <span className="text-xs font-medium text-muted-foreground hover:text-indigo-600 cursor-pointer transition-colors">Forgot password?</span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 px-4 rounded-xl bg-muted/50 border-white/10 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  {step === "register" && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-fuchsia-500" /> Must be at least 6 characters.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all group" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  <span>{step === "login" ? "Sign In" : "Create Account"}</span>
                  {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            )}

            <div className="mt-10 text-center">
              <p className="text-xs text-muted-foreground font-medium">
                By continuing, you agree to our <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
