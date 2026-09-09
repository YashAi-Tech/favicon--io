import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";

const HeartLogo = () => (
  <Link to="/" className="mx-auto flex w-fit items-center gap-2">
    <Heart className="h-8 w-8 fill-[url(#authgrad)] text-transparent" strokeWidth={0} />
    <svg width="0" height="0"><defs>
      <linearGradient id="authgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff7a2f" /><stop offset="50%" stopColor="#ff5b8a" /><stop offset="100%" stopColor="#a855f7" />
      </linearGradient></defs></svg>
    <span className="text-2xl font-semibold tracking-tight text-neutral-900">Lovable</span>
  </Link>
);

const GoogleButton = () => {
  const handleGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  return (
    <button
      onClick={handleGoogle}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white py-3 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
    >
      <svg className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  );
};

const AuthShell = ({ children }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="lov-blob animate-pulse-glow absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-300 via-rose-300 to-purple-300" />
    </div>
    <div className="w-full max-w-md">{children}</div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Login failed", description: err?.response?.data?.detail || "Check your credentials." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <HeartLogo />
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-center text-[14px] text-neutral-500">Log in to continue building</p>

        <div className="mt-6"><GoogleButton /></div>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-[12px] uppercase tracking-wide text-neutral-400">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none focus:border-neutral-900" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none focus:border-neutral-900" />
          <button disabled={busy} type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Log in
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-neutral-500">
          Don't have an account? <Link to="/signup" className="font-semibold text-neutral-900 hover:underline">Sign up</Link>
        </p>
      </div>
    </AuthShell>
  );
};

export { AuthShell, HeartLogo, GoogleButton };
export default Login;
