import NavBar from "@/components/landing/NavBar";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProcessSection from "@/components/landing/ProcessSection";
import ServicesSection from "@/components/landing/ServicesSection";
import TeamSection from "@/components/landing/TeamSection";
import TechnologySection from "@/components/landing/TechnologySection";

import styles from "@/components/landing/landing.module.css";

export default async function Home() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TechnologySection />
        <ProcessSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
