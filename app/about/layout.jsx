export const metadata = {
  title: "About | AskEnugu",
  description:
    "AskEnugu is an independent website that helps people find, understand and check government information in Enugu State.",
};

export default function AboutLayout({ children }) {
  return (
    <>
      <MobileBottomNav active="about" />
      {children}
    </>
  );
}
import MobileBottomNav from "@/components/MobileBottomNav";

