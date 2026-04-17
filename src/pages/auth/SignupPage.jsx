import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";

export const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");
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
    const { data, error: signUpError } = await signup({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId && supabase) {
      const { error: profileError } = await supabase.from("users").insert({
        id: userId,
        name,
        email,
        income: income ? Number(income) : null,
        goal: goal || null
      });

      if (profileError) {
        setError(`Account created, but profile setup failed: ${profileError.message}`);
      }
    }

    setLoading(false);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleSignup = async () => {
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
        <h1 className="font-display text-2xl text-brand-blue">
          Start your financial journey
        </h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Create an account to learn, track your budget, and practice investing
          with AI guidance.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="surface-panel space-y-4 p-6"
      >
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading || loading}
          className="btn-secondary w-full rounded-xl py-2.5 disabled:opacity-60"
        >
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
        <div className="flex items-center gap-2 text-[11px] text-brand-blue/50">
          <span className="h-px flex-1 bg-primary-purple/15" />
          <span>or sign up with email</span>
          <span className="h-px flex-1 bg-primary-purple/15" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-blue/80">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || googleLoading}
            className="input-field"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-blue/80">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
            className="input-field"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-blue/80">
            Password
          </label>
          <input
            type="password"
            placeholder="Choose a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            className="input-field"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-blue/80">
              Monthly income (optional)
            </label>
            <input
              type="number"
              placeholder="₹"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              disabled={loading || googleLoading}
              className="input-field"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-blue/80">
              Main financial goal (optional)
            </label>
            <input
              type="text"
              placeholder="E.g. build emergency fund"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={loading || googleLoading}
              className="input-field"
            />
          </div>
        </div>
        {error ? (
          <p className="text-[11px] text-red-500 mt-1">{error}</p>
        ) : (
          <p className="text-[11px] text-brand-blue/60 mt-1">
            By creating an account, you agree to our terms and privacy policy.
          </p>
        )}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary w-full mt-2 text-sm disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading || googleLoading}
          className="btn-secondary w-full rounded-xl py-2 disabled:opacity-60"
        >
          Login
        </button>
      </form>
    </div>
  );
};

