import type { Metadata } from "next";
import Persiapan from "@/components/Persiapan/Persiapan";
import { couple } from "@/lib/weddingData";

export const metadata: Metadata = {
  title: `Persiapan Pernikahan — ${couple.bride.shortName} & ${couple.groom.shortName}`,
  description: `Checklist, rundown, kedatangan keluarga, dan anggaran persiapan pernikahan ${couple.bride.shortName} & ${couple.groom.shortName}.`,
};

export default function PersiapanPage() {
  return <Persiapan />;
}
