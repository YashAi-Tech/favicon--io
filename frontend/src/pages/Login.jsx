import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import Logo from "../components/Logo";

const BrandMark = () => (
  <Link to="/" className="mx-auto flex w-fit items-center gap-2">
    <Logo size={30} />
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
      className="flex w-full items-center justify-center gap-3 rounded-md border border-[#e6e6e6] bg-white py-3 text-[15px] font-medium text-black transition-colors hover:bg-[#faf8f5]"
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
  <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-5 py-16">
    <div className="w-full max-w-md">{children}</div>
  </div>
);

const inputCls =
  "w-full rounded-[4px] border border-[#dddddd] px-3 py-2.5 text-[15px] text-black outline-none transition-shadow focus:border-[#f9540b] focus:shadow-soft";

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
      <BrandMark />
      <div className="mt-8 rounded-xl border border-[#e6e6e6] bg-white p-8 shadow-soft">
        <h1 className="track-h2 text-center text-[26px] font-bold text-black">Log in</h1>
        <p className="mt-1 text-center text-[14px] text-[#615d59]">Welcome back to your workspace</p>

        <div className="mt-6"><GoogleButton /></div>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e6e6e6]" />
          <span className="text-[12px] uppercase tracking-wide text-[#a39e98]">or</span>
          <div className="h-px flex-1 bg-[#e6e6e6]" />
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputCls} />
          <button disabled={busy} type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f9540b] py-3 text-[16px] font-medium text-white transition-all hover:bg-[#d9430a] active:scale-[0.98] disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Log in
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#615d59]">
          Don't have an account? <Link to="/signup" className="font-medium text-[#f9540b] hover:underline">Sign up</Link>
        </p>
      </div>
    </AuthShell>
  );
};

export { AuthShell, BrandMark, GoogleButton, inputCls };
export default Login;
