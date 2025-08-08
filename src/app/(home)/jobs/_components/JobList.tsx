"use client";

import React from "react";
import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/api/types";

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  loading, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Transform API job data to display format
  const transformJobData = (job: Job): DisplayJob => {
    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return `${Math.floor(diffInSeconds / 604800)}w ago`;
    };

    return {
      jobTitle: job.title,
      location: job.location,
      hospital: job.institute_id || "Healthcare Institute", // This should be populated with actual institute name
      tags: [
        job.category,
        job.experience_level,
        job.work_location,
        ...(job.benefits ? job.benefits.split(", ").slice(0, 2) : [])
      ].filter(Boolean),
      salary: job.pay_range,
      timePosted: formatTimeAgo(job.created_at),
      jobType: job.work_location === "Remote" ? "Remote" : 
               job.work_location === "Hybrid" ? "Hybrid" : "Full-time"
    };
  };

  const displayJobs = jobs.map(transformJobData);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {displayJobs.length > 0 ? (
          displayJobs.map((job, idx) => (
            <JobCard
              key={`${jobs[idx].id}-${idx}`}
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
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 text-lg mb-2">No jobs found</div>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {displayJobs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-10 h-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="w-10 h-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
