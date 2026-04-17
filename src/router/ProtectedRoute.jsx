import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = `${location.pathname}${location.search}${location.hash}`;
  const isAuthenticated = Boolean(session?.user);

  const handleLoginClick = () => {
    navigate("/login", { state: { from: redirectPath } });
  };

  if (loading) {
    return (
      <div className="surface-card mx-auto max-w-md p-6 text-center">
        <p className="text-sm text-brand-blue/70">Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="surface-card mx-auto max-w-md space-y-3 p-6 text-center">
        <h2 className="font-display text-xl text-brand-blue">Login required</h2>
        <p className="text-sm text-brand-blue/70">
          Please login to access this feature.
        </p>
        <button
          type="button"
          onClick={handleLoginClick}
          className="btn-primary inline-flex text-sm"
        >
          Login
        </button>
      </div>
    );
  }

  return children;
};
