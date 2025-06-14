
import Navbar from "@/components/LandingNavbar";
import JobPostingForm from "@/components/JobPostingForm";

const PostJob = () => {
  return (
    <div className="min-h-screen w-full bg-[#f3f7fb]">
      <Navbar />
      <main className="py-8 px-4">
        <JobPostingForm />
      </main>
    </div>
  );
};

export default PostJob;