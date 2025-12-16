import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UserCards from "../components/UserCards";
import Stats from "../components/Stats";
import TrustedLogos from "../components/TrustedLogos";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#e879f9] via-[#a78bfa] to-[#60a5fa] p-6">
      <div className="rounded-[36px] bg-[#0b0f19] shadow-2xl overflow-hidden">
        <Navbar />
        <Hero />
        <UserCards />
        <Stats />
        <TrustedLogos />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
