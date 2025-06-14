import Navbar from "@/components/LandingNavbar";
import HeroSection from "@/components/HeroSection";
import JobList from "@/components/JobList";

const FindJobs = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <HeroSection />
      <JobList />
    </div>
  );
};

export default FindJobs;