import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";
import { Job, Institution } from '@/lib/api/types';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

type JobCardProps = {
  job: JobWithInstitution;
};

const JobCard = ({ job }: JobCardProps) => {
  const router = useRouter();

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

  const handleCardClick = () => {
    router.push(`/find-jobs/${job.id}`);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/find-jobs/${job.id}`);
  };

  const tags = [
    job.category,
    job.experience_level,
    job.work_location,
    ...(job.benefits ? job.benefits.split(", ").slice(0, 2) : [])
  ].filter(Boolean);

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:border-blue-200 cursor-pointer"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors font-sans">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-600">
              <Building2 size={16} />
              <span className="text-sm">{job.institution?.name || "Healthcare Institute"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{job.pay_range}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatTimeAgo(job.created_at)}</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {job.work_location === "Remote" ? "Remote" : 
               job.work_location === "Hybrid" ? "Hybrid" : "Full-time"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="outline"
                className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                +{tags.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button 
            size="sm" 
            onClick={handleApplyClick}
            className="font-medium px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
