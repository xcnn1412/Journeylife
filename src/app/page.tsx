import { Hero, Nav } from "@/components/Nav";
import {
  Clients,
  Contact,
  Destinations,
  Footer,
  Marquee,
  Process,
  Relief,
  Services,
  SocialProof,
  Why,
} from "@/components/sections";
import { RevealObserver } from "@/lib/site-context";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <Nav />

      <main>
        {/* Lead — first impression */}
        <Hero />

        {/* Trust — proof, pain-relief, geographic reach */}
        <SocialProof />
        <Relief />
        <Marquee />

        {/* Offer — what we do, where we go, how we work */}
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
