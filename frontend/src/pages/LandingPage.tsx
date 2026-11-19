import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { HeroSection } from '@/components/sections/Hero';
import { CapabilitiesSection } from '@/components/sections/Capabilities';
import { HowItWorksSection } from '@/components/sections/HowItWorks';
import { FinalCTA, LandingFooter } from '@/components/sections/FinalCTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <LandingNavbar />
      <HeroSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
