import { supabase } from "./supabaseClient";

const PREMIUM_MEMBERSHIP = "premium";
const FREE_MEMBERSHIP = "free";

const normalizeMembershipStatus = (status) =>
  status === PREMIUM_MEMBERSHIP ? PREMIUM_MEMBERSHIP : FREE_MEMBERSHIP;

export const getUserProfile = async (userId) => {
  if (!supabase || !userId) {
    return { data: null, error: null };
  }

  return supabase
    .from("user_profiles")
    .select("id, age, monthly_income, occupation, membership_status")
    .eq("user_id", userId)
    .maybeSingle();
};

export const saveUserProfile = async ({
  userId,
  age,
  monthlyIncome,
  occupation,
  membershipStatus
}) => {
  if (!supabase || !userId) {
    return { data: null, error: null };
  }

  const payload = {
    user_id: userId,
    age,
    monthly_income: monthlyIncome,
    occupation
  };

  if (membershipStatus) {
    payload.membership_status = membershipStatus;
  }

  return supabase
    .from("user_profiles")
    .upsert(payload, {
      onConflict: "user_id"
    })
    .select("id, age, monthly_income, occupation, membership_status")
    .maybeSingle();
};

export const getMembershipStatus = async (userId) => {
  if (!supabase || !userId) {
    return { status: FREE_MEMBERSHIP, error: null };
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("membership_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { status: FREE_MEMBERSHIP, error };
  }

  return {
    status: normalizeMembershipStatus(data?.membership_status),
    error: null
  };
};

export const updateMembershipStatus = async ({ userId, email, status }) => {
  if (!supabase) {
    return {
      data: null,
      error: { message: "Supabase client is not configured." }
    };
  }

  if (!userId) {
    return {
      data: null,
      error: { message: "Missing user id for membership update." }
    };
  }

  const nextStatus = normalizeMembershipStatus(status);

  // First try updating an existing profile row.
  const { data: updatedRows, error: updateError } = await supabase
    .from("user_profiles")
    .update({ membership_status: nextStatus })
    .eq("user_id", userId)
    .select("id, membership_status");

  if (updateError) {
    return { data: null, error: updateError };
  }

  if (Array.isArray(updatedRows) && updatedRows.length > 0) {
    return { data: updatedRows[0], error: null };
  }

  // If profile row does not exist yet, create one with safe defaults.
  const fallbackOccupation = email ? `Member-${email.split("@")[0]}` : "Not specified";

  return supabase
    .from("user_profiles")
    .insert({
      user_id: userId,
      age: 18,
      monthly_income: 0,
      occupation: fallbackOccupation,
      membership_status: nextStatus
    })
    .select("id, membership_status")
    .maybeSingle();
};
