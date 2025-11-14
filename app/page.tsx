import ScrollRevealSections from "./shared/components/ScrollRevealSections";
import Banner from "./ui/banner";


export default function Home() {
  return (
    <>
      <Banner />
      <main
        className="w-full"
        style={{ backgroundColor: "#FEFEFC" }}
      >
        <ScrollRevealSections />
      </main>
    </>
  );
}
