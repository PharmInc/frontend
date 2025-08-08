"use client";

import React from 'react';
import { Search } from 'lucide-react';
import HeroSection from '../jobs/_components/HeroSection';
import JobList from '../jobs/_components/JobList';

const FindJobsPage = () => {
  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Find Jobs</h1>
        </div>
      </div>

      <HeroSection />

      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <JobList />
        </div>
      </div>
    </div>
  );
};

export default FindJobsPage;
