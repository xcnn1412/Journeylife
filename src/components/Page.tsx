"use client";
import { Nav, Hero } from "@/components/Nav";
import { SocialProof, Relief, Stats, Why, Services, Destinations, Process, Clients, Contact, Footer } from "@/components/Sections";
import { useReveal } from "@/lib/site-context";

export function Page() {
  useReveal();
  return (
    <>
      <Nav />
      <Hero />
      <SocialProof />
      <Relief />
      <Stats />
      <Why />
      <Services />
      <Destinations />
      <Process />
      <Clients />
      <Contact />
      <Footer />
    </>
  );
}
