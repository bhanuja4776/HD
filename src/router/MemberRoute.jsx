import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile } from "../lib/userProfiles";

export const MemberRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [membershipStatus, setMembershipStatus] = useState("free");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMembership = async () => {
      if (!user?.id) {
        if (isMounted) {
          setMembershipStatus("free");
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);

      const { data, error } = await getUserProfile(user.id);

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Failed to load membership status:", error);
        setMembershipStatus("free");
        setProfileLoading(false);
        return;
      }

      // Membership defaults to free unless the profile explicitly marks premium.
      const nextStatus = data?.membership_status === "premium" ? "premium" : "free";
      setMembershipStatus(nextStatus);
      setProfileLoading(false);
    };

    loadMembership();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  if (authLoading || profileLoading) {
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

  if (membershipStatus !== "premium") {
    return <Navigate to="/membership" replace />;
  }

  return children;
};
