"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, AlertCircle, MessageCircle, CheckCircle } from "lucide-react";
import { Job, Institution } from '@/lib/api/types';

interface JobWithInstitution extends Job {
  institution?: Institution;
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobWithInstitution;
}

export default function JobApplicationModal({ 
  isOpen, 
  onClose, 
  job 
}: JobApplicationModalProps) {
  const router = useRouter();

  const handleAgree = () => {
    const applicationMessage = `Hi! I'm interested in applying for the ${job.title} position at ${job.institution?.name || 'your organization'}. 

I would like to learn more about this opportunity and discuss how my qualifications align with your requirements. Could we schedule a time to discuss this role further?

Thank you for considering my application.

Best regards`;
    
    const encodedMessage = btoa(applicationMessage);
    
    const instituteId = job.institute_id || job.institution?.id;
    
    router.push(`/messages?user=${instituteId}&message=${encodedMessage}`);
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Apply for Job
          </DialogTitle>
          <DialogDescription>
            Connect with the hiring team to express your interest in this position.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Building2 size={14} />
              <span>{job.institution?.name || "Healthcare Institute"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign size={12} />
                <span>{job.pay_range}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Information Sharing Agreement
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  By applying, you agree to share your profile information with {job.institution?.name || 'the hiring organization'} and allow them to contact you regarding this position.
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>Your profile and contact information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>Your professional experience and qualifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>Direct messaging capabilities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAgree}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Agree & Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
