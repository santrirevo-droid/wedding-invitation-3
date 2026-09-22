import type { Metadata } from "next";
import Itinerary from "@/components/Persiapan/Itinerary";
import { couple, venue } from "@/lib/weddingData";

export const metadata: Metadata = {
  title: `Itinerary Keluarga — ${couple.bride.shortName} & ${couple.groom.shortName}`,
  description: `Kedatangan, penginapan, dan rute perjalanan keluarga selama di ${venue.location}.`,
};

export default function ItineraryPage() {
  return <Itinerary />;
}
