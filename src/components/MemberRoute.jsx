import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMembershipStatus } from "../lib/userProfiles";

export const MemberRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [membershipStatus, setMembershipStatus] = useState("free");
  const [membershipLoading, setMembershipLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkMembership = async () => {
      if (!user?.id) {
        if (isMounted) {
          setMembershipStatus("free");
          setMembershipLoading(false);
        }
        return;
      }

      setMembershipLoading(true);

      // Membership check logic:
      // read membership_status from the authenticated user's Supabase profile.
      const { status, error } = await getMembershipStatus(user.id);

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Failed to read membership status:", error);
        setMembershipStatus("free");
        setMembershipLoading(false);
        return;
      }

      setMembershipStatus(status);
      setMembershipLoading(false);
    };

    checkMembership();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  if (authLoading || membershipLoading) {
    return (
      <div className="surface-card mx-auto max-w-md p-6 text-center">
        <p className="text-sm text-brand-blue/70">Checking membership access...</p>
      </div>
    );
  }

  if (!user) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  // Only premium users can continue to protected member routes.
  if (membershipStatus !== "premium") {
    return <Navigate to="/membership" replace />;
  }

  return children;
};
