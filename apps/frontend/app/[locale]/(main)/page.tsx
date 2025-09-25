import HeroCarousel from "./components/HeroCarousel";
import WhyUsSection from "./components/WhyUsSection";
import ServicesGrid from "./components/ServicesGrid";
import StaffSection from "./components/StaffSection";
import LatestArticlesSection from "./components/LatestArticles";
import TestimonialsSection from "./components/TestimonialsSection";
import ClientsCarousel from "./components/ClientCarousel";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <WhyUsSection />
      <ServicesGrid />
      <StaffSection />
      <LatestArticlesSection />
      <TestimonialsSection />
      <ClientsCarousel />
    </main>
  );
}
