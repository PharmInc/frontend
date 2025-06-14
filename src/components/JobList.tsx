
import JobCard from "./JobCard";

const dummyJobs = [
  {
    jobTitle: "Cardiologist",
    location: "Mumbai, MH",
    hospital: "Apollo Hospital",
    tags: ["Full-time", "Residency Friendly"],
  },
  {
    jobTitle: "Family Medicine Physician",
    location: "Delhi, DL",
    hospital: "Fortis Healthcare",
    tags: ["Full-time", "Remote", "Residency Friendly"],
  },
  {
    jobTitle: "Pediatrician",
    location: "Bangalore, KA",
    hospital: "Manipal Hospital",
    tags: ["Full-time", "On-Site"],
  },
  {
    jobTitle: "Emergency Medicine Doctor",
    location: "Chennai, TN",
    hospital: "Global Hospitals",
    tags: ["Part-time", "Residency Friendly"],
  },
  {
    jobTitle: "Dermatologist",
    location: "Hyderabad, TS",
    hospital: "Yashoda Hospitals",
    tags: ["Full-time", "Remote"],
  },
  {
    jobTitle: "Internal Medicine",
    location: "Pune, MH",
    hospital: "Ruby Hall Clinic",
    tags: ["Full-time", "Residency Friendly", "On-Site"],
  },
  {
    jobTitle: "Anesthesiologist",
    location: "Kolkata, WB",
    hospital: "AMRI Hospitals",
    tags: ["Full-time", "On-Site"],
  },
  {
    jobTitle: "Psychiatrist",
    location: "Ahmedabad, GJ",
    hospital: "Sterling Hospitals",
    tags: ["Full-time", "Remote", "Residency Friendly"],
  },
  {
    jobTitle: "Radiologist",
    location: "Jaipur, RJ",
    hospital: "Narayana Health",
    tags: ["Full-time", "On-Site"],
  },
  {
    jobTitle: "Orthopedic Surgeon",
    location: "Lucknow, UP",
    hospital: "Medanta Hospital",
    tags: ["Full-time"],
  },
  {
    jobTitle: "Neurologist",
    location: "Chandigarh, CH",
    hospital: "PGIMER",
    tags: ["Full-time", "Residency Friendly"],
  },
  {
    jobTitle: "OB-GYN",
    location: "Indore, MP",
    hospital: "Choithram Hospital",
    tags: ["Part-time"],
  },
  {
    jobTitle: "Pathologist",
    location: "Nagpur, MH",
    hospital: "Wockhardt Hospitals",
    tags: ["Full-time", "On-Site"],
  },
  {
    jobTitle: "Endocrinologist",
    location: "Kochi, KL",
    hospital: "Aster Medcity",
    tags: ["Remote"],
  },
  {
    jobTitle: "General Surgeon",
    location: "Bhopal, MP",
    hospital: "AIIMS Bhopal",
    tags: ["Full-time", "On-Site"],
  },
  {
    jobTitle: "Nephrologist",
    location: "Surat, GJ",
    hospital: "Kiran Hospital",
    tags: ["Full-time"],
  },
  {
    jobTitle: "Urologist",
    location: "Patna, BR",
    hospital: "Paras HMRI Hospital",
    tags: ["Residency Friendly", "Full-time"],
  },
  {
    jobTitle: "Ophthalmologist",
    location: "Visakhapatnam, AP",
    hospital: "LV Prasad Eye Institute",
    tags: ["Full-time", "Remote"],
  },
];

const JobList = () => (
  <section className="max-w-3xl mx-auto px-4 py-8 flex flex-col bg-[#f3f7fb] rounded-2xl border border-[#e1e9f2] mt-10 shadow-sm">
    <h2 className="text-xl font-extrabold text-[#23497d] mb-4">Featured Doctor Jobs in India</h2>
    {dummyJobs.map((job, idx) => (
      <JobCard
        key={idx}
        jobTitle={job.jobTitle + " - " + job.hospital}
        location={job.location}
        hospital={job.hospital}
        tags={job.tags}
      />
    ))}
  </section>
);

export default JobList;