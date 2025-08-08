import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";

type JobCardProps = {
  jobTitle: string;
  location: string;
  hospital: string;
  tags: string[];
  salary?: string;
  timePosted?: string;
  jobType?: string;
};

const JobCard = ({ 
  jobTitle, 
  location, 
  hospital, 
  tags,
  salary = "Competitive",
  timePosted = "2 days ago",
  jobType = "Full-time"
}: JobCardProps) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:border-blue-200">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors font-sans">
            {jobTitle}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <Building2 size={16} />
            <span className="text-sm">{hospital}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} />
            <span>{salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{timePosted}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            {jobType}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
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
          className="font-medium px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          Apply Now
        </Button>
      </div>
    </div>
  </div>
);

export default JobCard;
