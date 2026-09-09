import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { AuthShell, BrandMark, GoogleButton, inputCls } from "./Login";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Sign up failed", description: err?.response?.data?.detail || "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <BrandMark />
      <div className="mt-8 rounded-xl border border-[#e6e6e6] bg-white p-8 shadow-soft">
        <h1 className="track-h2 text-center text-[26px] font-bold text-black">Get Notion free</h1>
        <p className="mt-1 text-center text-[14px] text-[#615d59]">Start building — no card required</p>

        <div className="mt-6"><GoogleButton /></div>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e6e6e6]" />
          <span className="text-[12px] uppercase tracking-wide text-[#a39e98]">or</span>
          <div className="h-px flex-1 bg-[#e6e6e6]" />
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputCls} />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className={inputCls} />
          <button disabled={busy} type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0075de] py-3 text-[16px] font-medium text-white transition-all hover:bg-[#005bab] active:scale-[0.98] disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#615d59]">
          Already have an account? <Link to="/login" className="font-medium text-[#0075de] hover:underline">Log in</Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default Signup;
