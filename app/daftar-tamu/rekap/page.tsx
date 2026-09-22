import type { Metadata } from "next";
import RekapClient from "@/components/GuestList/RekapClient";
import { couple } from "@/lib/weddingData";

export const metadata: Metadata = {
  title: `Rekap Daftar Tamu — ${couple.bride.shortName} & ${couple.groom.shortName}`,
};

export default function RekapPage() {
  return <RekapClient />;
}
