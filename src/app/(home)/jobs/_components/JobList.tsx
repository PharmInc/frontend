"use client";

import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiJob {
  id: string;
  title: string;
  description: string;
  payRange: string;
  benefits: string;
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  instituteId: string;
  instituteName: string;
  instituteLocation: string;
}

interface DisplayJob {
  jobTitle: string;
  location: string;
  hospital: string;
  tags: string[];
  salary?: string;
  timePosted?: string;
  jobType?: string;
}

const JobList = () => {
  const [jobs, setJobs] = useState<DisplayJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data for demo purposes
  const sampleJobs: DisplayJob[] = [
    {
      jobTitle: "Senior Cardiologist",
      location: "Mumbai, Maharashtra",
      hospital: "Apollo Hospitals",
      tags: ["Cardiology", "Senior Level", "Emergency Care", "Surgery"],
      salary: "₹15-25 LPA",
      timePosted: "1 day ago",
      jobType: "Full-time"
    },
    {
      jobTitle: "ICU Nurse",
      location: "Delhi, NCR",
      hospital: "Max Healthcare",
      tags: ["Critical Care", "ICU", "Emergency", "Ventilator Care"],
      salary: "₹8-12 LPA",
      timePosted: "2 days ago",
      jobType: "Full-time"
    },
    {
      jobTitle: "Clinical Pharmacist",
      location: "Bangalore, Karnataka",
      hospital: "Fortis Healthcare",
      tags: ["Pharmacy", "Clinical", "Drug Safety", "Patient Care"],
      salary: "₹6-10 LPA",
      timePosted: "3 days ago",
      jobType: "Full-time"
    },
    {
      jobTitle: "Pediatric Surgeon",
      location: "Chennai, Tamil Nadu",
      hospital: "Dr. Mehta's Hospitals",
      tags: ["Pediatrics", "Surgery", "Neonatal", "Specialist"],
      salary: "₹20-30 LPA",
      timePosted: "5 days ago",
      jobType: "Full-time"
    }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setJobs(sampleJobs);
          setLoading(false);
        }, 1000);

        // Actual API call would be:
        // const response = await jobApiClient.get<ApiJob[]>("/public/job");
        // const mappedJobs = response.map((job) => ({
        //   jobTitle: job.title,
        //   location: job.location,
        //   hospital: job.instituteName,
        //   tags: [
        //     ...(job.benefits ? job.benefits.split(", ") : []),
        //     job.category,
        //   ],
        //   salary: job.payRange,
        //   timePosted: "Recently posted",
        //   jobType: "Full-time"
        // }));
        // setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-14"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 font-sans">
            Featured Healthcare Jobs
          </h2>
          <p className="text-gray-600 text-sm">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <SortAsc size={16} />
            Sort
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job, idx) => (
            <JobCard
              key={idx}
              jobTitle={job.jobTitle}
              location={job.location}
              hospital={job.hospital}
              tags={job.tags}
              salary={job.salary}
              timePosted={job.timePosted}
              jobType={job.jobType}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No jobs found</div>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {jobs.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" className="px-8">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
