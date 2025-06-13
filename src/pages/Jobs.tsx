import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Search, Building, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Navbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

const healthcareJobs = [
  {
    title: "Senior Consultant - Cardiology",
    hospital: "All India Institute of Medical Sciences (AIIMS)",
    location: "New Delhi, India",
    type: "Full-time",
    description: "Lead the cardiology department with a team of specialists, manage patient care, and mentor junior doctors.",
    posted: "2 days ago"
  },
  {
    title: "General Physician",
    hospital: "Apollo Hospitals",
    location: "Chennai, India",
    type: "Full-time",
    description: "Provide comprehensive primary care, diagnose and treat a wide range of medical conditions.",
    posted: "1 week ago"
  },
  {
    title: "Neurologist",
    hospital: "National Institute of Mental Health and Neurosciences (NIMHANS)",
    location: "Bengaluru, India",
    type: "Contract",
    description: "Specialize in the diagnosis and treatment of neurological disorders, participate in clinical research.",
    posted: "3 days ago"
  },
  {
    title: "Surgeon",
    hospital: "Christian Medical College (CMC)",
    location: "Vellore, India",
    type: "Full-time",
    description: "Perform a variety of surgical procedures, supervise surgical teams, and ensure patient safety.",
    posted: "5 days ago"
  },
  {
    title: "Pediatrician",
    hospital: "Kasturba Medical College (KMC)",
    location: "Manipal, India",
    type: "Full-time",
    description: "Provide expert care for children, manage pediatric wards, and collaborate with multidisciplinary teams.",
    posted: "Just now"
  },
  {
    title: "Emergency Medicine Specialist",
    hospital: "Sir Ganga Ram Hospital",
    location: "New Delhi, India",
    type: "Full-time",
    description: "Lead the emergency department, manage acute cases, and coordinate with critical care teams.",
    posted: "1 day ago"
  }
];

const Jobs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 hero-gradient">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                Find Your Perfect Healthcare Job
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Connect with top Indian medical institutions offering roles tailored for healthcare professionals like you.
              </p>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Search by keyword, title, or skill" 
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                      type="text" 
                      placeholder="Hospital or location" 
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue"
                    />
                  </div>
                  <Button className="bg-medical-blue hover:bg-medical-blue/90 shrink-0">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Popular Healthcare Job Categories</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="bg-medical-lightBlue rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-medical-blue/20 flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6 text-medical-blue" />
                </div>
                <h3 className="font-medium">Physician</h3>
                <p className="text-sm text-gray-500">142 positions</p>
              </motion.div>
              
              <motion.div 
                className="bg-medical-lightBlue rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-medical-blue/20 flex items-center justify-center mb-3">
                  <Building className="h-6 w-6 text-medical-blue" />
                </div>
                <h3 className="font-medium">Surgery</h3>
                <p className="text-sm text-gray-500">98 positions</p>
              </motion.div>
              
              <motion.div 
                className="bg-medical-lightBlue rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-medical-blue/20 flex items-center justify-center mb-3">
                  <Hospital className="h-6 w-6 text-medical-blue" />
                </div>
                <h3 className="font-medium">Pediatrics</h3>
                <p className="text-sm text-gray-500">76 positions</p>
              </motion.div>
              
              <motion.div 
                className="bg-medical-lightBlue rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-medical-blue/20 flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-medical-blue" />
                </div>
                <h3 className="font-medium">Research</h3>
                <p className="text-sm text-gray-500">53 positions</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Featured Healthcare Jobs */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold">Featured Healthcare Jobs</h2>
              <Button variant="outline" className="text-medical-blue border-medical-blue hover:bg-medical-lightBlue">
                View All Positions
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthcareJobs.map((job, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col card-hover">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Hospital className="h-4 w-4 mr-1" /> {job.hospital} • {job.location}
                          </CardDescription>
                        </div>
                        <span className="bg-medical-lightBlue text-medical-blue text-xs px-2 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{job.description}</p>
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-gray-500">Posted {job.posted}</span>
                      <Button className="bg-medical-blue hover:bg-medical-blue/90">Apply Now</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
