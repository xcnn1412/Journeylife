import { Hero, Nav } from "@/components/Nav";
import {
  Clients,
  Contact,
  Destinations,
  Footer,
  LuckyDraw,
  Marquee,
  Pillars,
  Portfolio,
  Process,
  Registration,
  Services,
  TrustBar,
  Why,
} from "@/components/sections";
import { StickyCTA } from "@/components/StickyCTA";
import { RevealObserver } from "@/lib/site-context";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* Lead — first impression */}
        <Hero />

        {/* Trust — credentials band */}
        <TrustBar />

        {/* Offer — what we do, proof of work, geographic reach */}
        <Pillars />
        <Portfolio />
        <Registration />
        <LuckyDraw />
        <Marquee />

        {/* Offer detail — formats, routes, destinations, process */}
        <Why />
        <Services />
        <Destinations />
        <Process />

        {/* Conversion — testimonials + brief form */}
        <Clients />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
