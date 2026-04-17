import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const redirectTo = location.state?.from || "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await login({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    const { error: googleError } = await loginWithGoogle();
    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
      return;
    }

    setGoogleLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-blue">Welcome to Aarvika</h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Log in to continue your financial journey with Aarvika.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="surface-panel space-y-4 p-6"
      >
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="btn-secondary w-full rounded-xl py-2.5 disabled:opacity-60"
        >
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
        <div className="flex items-center gap-2 text-[11px] text-brand-blue/50">
          <span className="h-px flex-1 bg-primary-purple/15" />
          <span>or continue with email</span>
          <span className="h-px flex-1 bg-primary-purple/15" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-blue/80">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-blue/80">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 text-sm disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="btn-secondary w-full rounded-xl py-2"
        >
          Sign Up
        </button>
        <p className="text-[11px] text-brand-blue/60 text-center mt-2">
          New here? Sign up to start learning, budgeting, and simulating safely.
        </p>
      </form>
    </div>
  );
};

