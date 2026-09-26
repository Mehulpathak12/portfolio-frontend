"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Lock, X, ShieldCheck, AlertCircle } from "lucide-react";

export default function SecretLoginModal() {
  const { loginModalOpen, setLoginModalOpen, login } = useAdmin();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const isEmail = identifier.includes("@");
    const payload = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    const res = await login(payload);
    setLoading(false);

    if (res.success) {
      setIdentifier("");
      setPassword("");
    } else {
      setError(res.error || "Invalid secret credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-8 border border-neutral-200/80 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setError(null);
            setLoginModalOpen(false);
          }}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-lg shadow-neutral-900/10">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Stealth Access</h2>
            <p className="text-xs text-neutral-500">Authorized personnel only</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/60 flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="mehulpathak48@gmail.com"
              className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Unlock Controls</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-neutral-400">
          Tip: You can press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-neutral-600">Ctrl+Shift+E</kbd> anytime to toggle this modal.
        </p>
      </div>
    </div>
  );
}
