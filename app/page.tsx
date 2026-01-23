import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { DiscoverFundraisers } from "@/components/discover-fundraisers";
import { StatsSection } from "@/components/stats-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { Categories } from "@/components/categories";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <DiscoverFundraisers />
        <Categories />
        <StatsSection />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
