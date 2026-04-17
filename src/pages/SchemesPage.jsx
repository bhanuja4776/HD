import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, saveUserProfile } from "../lib/userProfiles";

const GOVERNMENT_SCHEMES = [
  {
    name: "Sukanya Samriddhi Yojana",
    description:
      "Small savings scheme focused on long-term financial security for the girl child.",
    min_age: 18,
    max_age: 50,
    income_limit: 100000,
    occupation: "Any"
  },
  {
    name: "PM Mudra Yojana",
    description:
      "Collateral-free business loans for micro and small enterprises, including women-led ventures.",
    min_age: 18,
    max_age: 65,
    income_limit: 120000,
    occupation: "Self-employed"
  },
  {
    name: "Stand-Up India Scheme",
    description:
      "Bank loan support for women entrepreneurs starting greenfield enterprises.",
    min_age: 18,
    max_age: 65,
    income_limit: 150000,
    occupation: "Self-employed"
  },
  {
    name: "Mahila Samman Savings Certificate",
    description:
      "Government-backed savings option for women with fixed returns over a short tenure.",
    min_age: 18,
    max_age: 70,
    income_limit: 200000,
    occupation: "Any"
  },
  {
    name: "PM Jan Dhan Yojana",
    description:
      "Financial inclusion scheme offering basic zero-balance bank accounts and direct benefit support.",
    min_age: 10,
    max_age: 80,
    income_limit: 50000,
    occupation: "Any"
  }
];

const normalizeProfileInput = ({ age, monthlyIncome, occupation }) => {
  const parsedAge = Number(age);
  const parsedIncome = Number(monthlyIncome);

  if (!occupation || !Number.isFinite(parsedAge) || !Number.isFinite(parsedIncome)) {
    return null;
  }

  if (parsedAge <= 0 || parsedIncome < 0) {
    return null;
  }

  return {
    age: parsedAge,
    monthlyIncome: parsedIncome,
    occupation
  };
};

const findMatchingSchemes = ({ age, monthlyIncome, occupation }) => {
  const normalizedProfile = normalizeProfileInput({
    age,
    monthlyIncome,
    occupation
  });

  if (!normalizedProfile) {
    return [];
  }

  const { age: parsedAge, monthlyIncome: parsedIncome } = normalizedProfile;

  return GOVERNMENT_SCHEMES.filter((scheme) => {
    const ageMatch = parsedAge >= scheme.min_age && parsedAge <= scheme.max_age;
    const incomeMatch = parsedIncome <= scheme.income_limit;
    const occupationMatch =
      scheme.occupation === "Any" ||
      scheme.occupation.toLowerCase() === occupation.toLowerCase();

    return ageMatch && incomeMatch && occupationMatch;
  }).map((scheme) => {
    const ageReason = `Age ${parsedAge} fits ${scheme.min_age}-${scheme.max_age} years`;
    const incomeReason = `Monthly income Rs. ${parsedIncome} is within the limit of Rs. ${scheme.income_limit}`;
    const occupationReason =
      scheme.occupation === "Any"
        ? "Open to all occupations"
        : `Occupation match: ${occupation}`;

    return {
      ...scheme,
      reason: `${ageReason}; ${incomeReason}; ${occupationReason}.`
    };
  });
};

export const SchemesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [age, setAge] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [loadingSavedProfile, setLoadingSavedProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSavedProfile = async () => {
      if (authLoading || !user) {
        return;
      }

      setLoadingSavedProfile(true);
      setProfileError("");

      const { data, error } = await getUserProfile(user.id);
      if (!isMounted) {
        return;
      }

      if (error) {
        setProfileError("Could not load your saved profile right now.");
        setLoadingSavedProfile(false);
        return;
      }

      if (data) {
        setAge(data.age != null ? String(data.age) : "");
        setMonthlyIncome(
          data.monthly_income != null ? String(data.monthly_income) : ""
        );
        setOccupation(data.occupation || "");
      }

      setLoadingSavedProfile(false);
    };

    loadSavedProfile();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const handleFindSchemes = async () => {
    setProfileSaved(false);
    setProfileError("");

    const matches = findMatchingSchemes({
      age,
      monthlyIncome,
      occupation
    });

    setMatchedSchemes(matches);
    setHasSearched(true);

    if (!user) {
      return;
    }

    const normalizedProfile = normalizeProfileInput({
      age,
      monthlyIncome,
      occupation
    });

    if (!normalizedProfile) {
      return;
    }

    setSavingProfile(true);

    const { error } = await saveUserProfile({
      userId: user.id,
      age: normalizedProfile.age,
      monthlyIncome: normalizedProfile.monthlyIncome,
      occupation: normalizedProfile.occupation
    });

    if (error) {
      setProfileError("Could not save your profile right now.");
      setSavingProfile(false);
      return;
    }

    setSavingProfile(false);
    setProfileSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-blue md:text-3xl">
          Government scheme finder
        </h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Discover government schemes you might be eligible for based on a few simple
          details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="surface-panel space-y-3 p-6">
          <h2 className="text-sm font-semibold text-brand-blue">Your profile</h2>
          <div className="space-y-2 text-sm">
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Monthly income (₹)"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="input-field"
            />
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="input-field"
            >
              <option value="">Occupation</option>
              <option value="Homemaker">Homemaker</option>
              <option value="Student">Student</option>
              <option value="Salaried">Salaried</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleFindSchemes}
            disabled={savingProfile}
            className="btn-primary w-full text-sm mt-1"
          >
            {savingProfile ? "Saving profile..." : "Find matching schemes"}
          </button>
          {loadingSavedProfile && (
            <p className="text-[11px] text-brand-blue/60 mt-1">
              Loading your saved profile...
            </p>
          )}
          {profileSaved && (
            <p className="text-[11px] text-green-600 mt-1">
              Profile saved for your next visit.
            </p>
          )}
          {profileError && (
            <p className="text-[11px] text-red-500 mt-1">{profileError}</p>
          )}
        </section>

        <section className="surface-panel space-y-3 p-6">
          <h2 className="text-sm font-semibold text-brand-blue">Suggested schemes</h2>
          {!hasSearched && (
            <div className="border border-dashed border-primary-purple/20 rounded-xl p-4 text-xs text-brand-blue/50 text-center">
              No suggestions yet. Enter your details and run the finder to see demo
              schemes here.
            </div>
          )}

          {hasSearched && matchedSchemes.length === 0 && (
            <div className="border border-dashed border-primary-purple/20 rounded-xl p-4 text-sm text-brand-blue/70 text-center">
              No schemes found for your profile.
            </div>
          )}

          {hasSearched && matchedSchemes.length > 0 && (
            <div className="space-y-3">
              {matchedSchemes.map((scheme) => (
                <article
                  key={scheme.name}
                  className="surface-card space-y-2 rounded-xl p-6"
                >
                  <h3 className="text-sm font-semibold text-brand-blue">{scheme.name}</h3>
                  <p className="text-xs text-brand-blue/70">{scheme.description}</p>
                  <p className="text-xs text-brand-blue/60">Why it matched: {scheme.reason}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

