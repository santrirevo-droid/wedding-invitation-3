import type { Metadata } from "next";
import Persiapan from "@/components/Persiapan/Persiapan";
import { couple } from "@/lib/weddingData";

export const metadata: Metadata = {
  title: `Persiapan Pernikahan — ${couple.groom.shortName} & ${couple.bride.shortName}`,
  description: `Checklist, rundown, kedatangan keluarga, dan anggaran persiapan pernikahan ${couple.groom.shortName} & ${couple.bride.shortName}.`,
};

export default function PersiapanPage() {
  return <Persiapan />;
}
