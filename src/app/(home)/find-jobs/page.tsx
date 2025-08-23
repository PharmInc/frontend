"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, MapPin, Building, DollarSign, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobList from '../jobs/_components/JobList';
import { listJobs, searchJobs } from '@/lib/api/services/job';
import { Job, JobSearchParams } from '@/lib/api/types';

const FindJobsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Filter states
  const [filters, setFilters] = useState<JobSearchParams>({
    location: 'all',
    category: 'all',
    experience_level: 'all',
    work_location: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc' as const,
    page: 1,
    limit: 10
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async (searchParams?: JobSearchParams) => {
    setLoading(true);
    try {
      let response;
      
      if (searchQuery.trim() || 
          (searchParams?.category && searchParams.category !== 'all') || 
          (searchParams?.location && searchParams.location !== 'all') || 
          (searchParams?.experience_level && searchParams.experience_level !== 'all') || 
          (searchParams?.work_location && searchParams.work_location !== 'all')) {
        // Use search API when there are search criteria
        const searchData: JobSearchParams = {
          ...filters,
          ...searchParams,
          title: searchQuery.trim() || undefined,
          location: searchParams?.location === 'all' ? undefined : searchParams?.location,
          category: searchParams?.category === 'all' ? undefined : searchParams?.category,
          experience_level: searchParams?.experience_level === 'all' ? undefined : searchParams?.experience_level,
          work_location: searchParams?.work_location === 'all' ? undefined : searchParams?.work_location,
          page: searchParams?.page || currentPage,
        };
        response = await searchJobs(searchData);
      } else {
        // Use list API for general listing
        response = await listJobs(
          searchParams?.page || currentPage,
          filters.limit || 10,
          undefined,
          true // only active jobs
        );
      }
      
      setJobs(response.data);
      setTotalPages(response.totalPages || 1);
      setTotalJobs(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof JobSearchParams, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchJobs({ ...newFilters, page: 1 });
  };

  const clearFilters = () => {
    const clearedFilters: JobSearchParams = {
      location: 'all',
      category: 'all',
      experience_level: 'all',
      work_location: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(1);
    fetchJobs(clearedFilters);
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Find Jobs</h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for jobs, titles, hospitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg font-sans"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8 h-12 font-sans">
                  Search Jobs
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 h-12 font-sans flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <Select value={filters.location || 'all'} onValueChange={(value) => handleFilterChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any location</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Category
                    </label>
                    <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any category</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                        <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Experience Level</label>
                    <Select value={filters.experience_level || 'all'} onValueChange={(value) => handleFilterChange('experience_level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any experience</SelectItem>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        <SelectItem value="Expert Level">Expert Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Work Type</label>
                    <Select value={filters.work_location || 'all'} onValueChange={(value) => handleFilterChange('work_location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-4 flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">Sort by:</label>
                      <Select value={filters.sortBy || 'created_at'} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at">Latest</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="ghost" onClick={clearFilters} className="font-sans">
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Jobs'}
              </h2>
              <p className="text-gray-600 mt-1">
                {loading ? 'Loading...' : `${totalJobs} job${totalJobs !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>

          {/* Job List */}
          <JobList 
            jobs={jobs} 
            loading={loading} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FindJobsPage;
