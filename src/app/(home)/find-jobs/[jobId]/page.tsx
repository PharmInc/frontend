"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Building2, Clock, DollarSign, Users, Briefcase, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useJobStore } from '@/store';
import { Job, Institution } from '@/lib/api/types';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

const JobDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  
  const { fetchSingleJob } = useJobStore();
  const [job, setJob] = useState<JobWithInstitution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      if (jobId) {
        setLoading(true);
        const jobData = await fetchSingleJob(jobId);
        setJob(jobData);
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, fetchSingleJob]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = () => {
    // TODO: Implement job application logic
    console.log('Apply to job:', job?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900 font-sans">Job Details</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900 font-sans">Job Details</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Job not found</div>
            <p className="text-gray-500">The job you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => router.back()}
              className="mt-4"
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const benefits = job.benefits ? job.benefits.split(', ') : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Job Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Building2 size={20} />
                    <span className="text-lg font-medium">
                      {job.institution?.name || "Healthcare Institute"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span>{job.pay_range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-400" />
                      <span>{job.work_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>{job.experience_level}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {job.category}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {job.role}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {job.work_location}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                    <Clock size={14} />
                    <span>Posted {formatTimeAgo(job.created_at)}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Calendar size={14} />
                    <span>Posted on {formatDate(job.created_at)}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 lg:w-48">
                  <Button 
                    onClick={handleApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Job Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role</span>
                      <span className="font-medium">{job.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{job.experience_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Type</span>
                      <span className="font-medium">{job.work_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{job.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary</span>
                      <span className="font-medium">{job.pay_range}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {job.institution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About the Company</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {job.institution.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {job.institution.type}
                      </p>
                      {job.institution.bio && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {job.institution.bio}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {job.institution.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{job.institution.location}</span>
                        </div>
                      )}
                      {job.institution.employees_count && (
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span>{job.institution.employees_count} employees</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{benefit.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="lg:hidden">
                <Button 
                  onClick={handleApply}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  size="lg"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
