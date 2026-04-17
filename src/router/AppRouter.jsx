import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { BudgetPage } from "../pages/BudgetPage";
import { SimulatorPage } from "../pages/SimulatorPage";
import { LearningPage } from "../pages/LearningPage";
import { SchemesPage } from "../pages/SchemesPage";
import { Membership } from "../pages/Membership";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MemberRoute } from "../components/MemberRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulator"
        element={
          <ProtectedRoute>
            <SimulatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning"
        element={
          // Membership route integration:
          // Learning page is accessible only for users whose membership_status is premium.
          <MemberRoute>
            <LearningPage />
          </MemberRoute>
        }
      />
      <Route
        path="/schemes"
        element={
          <ProtectedRoute>
            <SchemesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/membership" element={<Membership />} />
    </Routes>
  );
};

