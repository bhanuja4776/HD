import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { updateMembershipStatus } from "../lib/userProfiles";
import { loadRazorpayScript } from "../utils/razorpay";

const RAZORPAY_KEY_ID = "rzp_test_SORiFwd4xumYCB";
const PREMIUM_AMOUNT_PAISE = 49900;

export const Membership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpgrade = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!user?.id) {
      setErrorMessage("Please login first to upgrade your membership.");
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    setLoading(true);

    // Razorpay trigger: load checkout script dynamically before opening payment popup.
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setErrorMessage("Unable to load Razorpay. Please try again.");
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: PREMIUM_AMOUNT_PAISE,
      currency: "INR",
      name: "AI Financial Sakhi",
      description: "Premium Membership Access",
      prefill: {
        email: user.email || ""
      },
      notes: {
        userId: user.id,
        plan: "premium"
      },
      handler: async () => {
        // Supabase membership update: mark user as premium only after successful payment callback.
        const { error } = await updateMembershipStatus({
          userId: user.id,
          email: user.email,
          status: "premium"
        });

        if (error) {
          setErrorMessage(`Payment succeeded but membership update failed: ${error.message}`);
          setLoading(false);
          return;
        }

        setSuccessMessage("Payment successful. Premium membership activated!");
        setLoading(false);
        navigate("/learning", { replace: true });
      },
      modal: {
        ondismiss: () => {
          setErrorMessage("Payment was cancelled. You can try again anytime.");
          setLoading(false);
        }
      },
      theme: {
        color: "#3A2E7C"
      }
    };

    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on("payment.failed", (response) => {
      const reason = response?.error?.description || "Payment failed. Please try again.";
      setErrorMessage(reason);
      setLoading(false);
    });

    razorpayInstance.open();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <section className="gradient-hero fin-glow relative overflow-hidden rounded-3xl p-6 text-white shadow-xl md:p-10">
        <div className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold md:text-4xl">
              Upgrade to Premium Membership
            </h1>
            <p className="text-sm text-white/90 md:text-base">
              Unlock exclusive financial learning modules designed to help you build confidence and make smarter money decisions.
            </p>
          </div>

          <div className="fin-card p-6 text-brand-blue shadow-2xl">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-blue/60">Premium Plan</p>
            <p className="mt-2 font-display text-4xl font-semibold">₹499</p>
            <p className="mt-1 text-xs text-brand-blue/60">One-time upgrade</p>
            <ul className="mt-4 space-y-2 text-sm text-brand-blue/80">
              <li>Exclusive learning modules</li>
              <li>Premium financial guidance content</li>
              <li>Priority access to new lessons</li>
            </ul>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary mt-6 w-full disabled:opacity-60"
            >
              {loading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>
      </section>

      {(errorMessage || successMessage) && (
        <div className="fin-card mt-4 p-4">
          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : (
            <p className="text-sm text-brand-green">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};