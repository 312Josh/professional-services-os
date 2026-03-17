import { getCurrentAdmin, sanitizeRedirectPath } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const nextPath = sanitizeRedirectPath(typeof searchParams?.next === "string" ? searchParams.next : null);
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect(nextPath || "/dashboard");
  }

  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f35] via-[#162d4a] to-[#1a3550]" />
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(at 25% 75%, rgba(30,58,95,0.3) 0, transparent 50%), radial-gradient(at 75% 25%, rgba(212,175,55,0.1) 0, transparent 50%)" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#0f1f35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Attorney Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your firm dashboard</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">{error}</div>
          )}

          <form method="post" action="/api/login" className="space-y-4">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input name="email" type="email" required placeholder="you@firm.com" className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-slate-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:border-amber-300/40 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-slate-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-300/40 focus:border-amber-300/40 transition-all" />
            </div>
            <button type="submit" className="w-full bg-amber-400 hover:bg-amber-300 text-[#0f1f35] font-bold text-base py-3.5 rounded-xl shadow-lg shadow-amber-400/20 hover:shadow-amber-300/30 transition-all mt-2 cursor-pointer">
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Powered by <a href="https://cogrow.ai" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">CoGrow</a>
        </p>
      </div>
    </div>
  );
}
