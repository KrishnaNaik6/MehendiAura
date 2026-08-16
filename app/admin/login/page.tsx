"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { signInAdmin } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await signInAdmin(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        toast.error("Login Failed", { description: res.error });
      } else {
        toast.success("Welcome back! Redirecting to admin dashboard...");
        router.push(redirectTo);
      }
    } catch {
      setErrorMsg("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col justify-between p-4 sm:p-6 text-cream-100 selection:bg-gold-500 selection:text-white">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-cream-300 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-brand-900/90 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6 text-brand-950" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">
            Admin Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-cream-300">
            Sign in to manage Mehendi services, jewellery rental catalog, and business settings.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3.5 flex items-start gap-3 text-red-300 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mehendiaura.com"
                className="w-full pl-10 pr-4 py-3 bg-brand-950/80 border border-gold-500/30 rounded-xl text-sm text-cream-100 placeholder-cream-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-brand-950/80 border border-gold-500/30 rounded-xl text-sm text-cream-100 placeholder-cream-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Access Admin Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-brand-800 text-xs text-cream-400 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Supabase Authentication Enabled</span>
          </div>
          <p className="text-[11px] leading-relaxed text-cream-300/80">
            Only authorized administrator emails configured in Supabase Auth can log into the CMS dashboard.
          </p>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-cream-400/60 py-2">
        © {new Date().getFullYear()} MehendiAura. Protected Administrator System.
      </div>
    </div>
  );
}
