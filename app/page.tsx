import HeroSection from '@/components/landing/Home';
import NavbarComponent from '@/components/landing/NavbarComponent';
import FeatureSection from '@/components/landing/FeatureSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarComponent />
      <HeroSection />
      <FeatureSection />
    </div>
  );
}
