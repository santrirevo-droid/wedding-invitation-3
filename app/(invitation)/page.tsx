import Acara from "@/components/Acara";
import Footer from "@/components/Footer";
import Gift from "@/components/Gift";
import Hero from "@/components/Hero";
import Mempelai from "@/components/Mempelai";
import OpeningQuote from "@/components/OpeningQuote";
import OurStory from "@/components/OurStory";
import RSVP from "@/components/RSVP";
import Wishes from "@/components/Wishes";

/**
 * No separators between sections: every section now opens with its own
 * drawn flourish under the heading, so the standalone dividers the template
 * used to stack between them just doubled the ornament. The rhythm comes
 * from the shared py-28 and the repeated masthead instead.
 */
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <OpeningQuote />
      <Mempelai />
      <OurStory />
      <Acara />
      <RSVP />
      <Gift />
      <Wishes />
      <Footer />
    </main>
  );
}
