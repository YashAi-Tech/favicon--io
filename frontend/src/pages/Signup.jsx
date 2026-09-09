import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { AuthShell, HeartLogo, GoogleButton } from "./Login";

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
      <HeartLogo />
      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold tracking-tight text-neutral-900">Create your account</h1>
        <p className="mt-1 text-center text-[14px] text-neutral-500">Start building for free — no card required</p>

        <div className="mt-6"><GoogleButton /></div>
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-[12px] uppercase tracking-wide text-neutral-400">or</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none focus:border-neutral-900" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none focus:border-neutral-900" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-[15px] outline-none focus:border-neutral-900" />
          <button disabled={busy} type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-neutral-500">
          Already have an account? <Link to="/login" className="font-semibold text-neutral-900 hover:underline">Log in</Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default Signup;
