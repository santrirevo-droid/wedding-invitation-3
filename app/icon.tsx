import { renderMonogramIcon } from "@/lib/monogramIcon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return renderMonogramIcon(size.width);
}
