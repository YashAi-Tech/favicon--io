import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const { completeGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash || window.location.hash;
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;

    if (!sessionId) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        await completeGoogle(sessionId);
        window.history.replaceState(null, "", "/dashboard");
        navigate("/dashboard");
      } catch (e) {
        setError(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    })();
  }, [completeGoogle, navigate, location.hash]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      <p className="text-[15px] text-neutral-500">
        {error ? "Sign-in failed, redirecting..." : "Signing you in..."}
      </p>
    </div>
  );
};

export default AuthCallback;
