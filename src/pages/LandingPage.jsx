import { HeroSection } from "../components/landing/HeroSection";
import { StatsSection } from "../components/landing/StatsSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { LearningPath } from "../components/landing/LearningPath";
import { SchemesSection } from "../components/landing/SchemesSection";
import { FAQSection } from "../components/landing/FAQSection";
import { Testimonials } from "../components/landing/Testimonials";

export const LandingPage = () => {
  return (
    <div>
      <div className="section-shell pt-0">
        <HeroSection />
      </div>
      <div className="section-shell">
        <StatsSection />
      </div>
      <div className="section-shell">
        <FeaturesSection />
      </div>
      <div className="section-shell">
        <HowItWorks />
      </div>
      <div className="section-shell">
        <LearningPath />
      </div>
      <div className="section-shell">
        <SchemesSection />
      </div>
      <div className="section-shell">
        <FAQSection />
      </div>
      <div className="section-shell pb-0">
        <Testimonials />
      </div>
    </div>
  );
};

