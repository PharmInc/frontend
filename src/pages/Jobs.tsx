
import Navbar from "@/components/LandingNavbar";
import JobsLanding from "@/components/JobsLanding";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Navbar />
      <JobsLanding />
    </div>
  );
};

export default Index;