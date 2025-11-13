import Banner from "./ui/banner";
import ScrollRevealSections from "./components/ScrollRevealSections";

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
