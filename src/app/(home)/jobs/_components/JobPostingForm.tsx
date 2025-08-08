"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import React from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const jobCategories = ["Doctor", "Nurse", "Intern", "Dentist", "Orthodontist", "Surgeon", "Other"];
const benefits = ["Health Insurance", "Travel Allowance", "Housing", "Paid Time Off", "Bonuses"];
const skills = ["Patient Care", "Medical-Surgical", "Emergency Medicine", "Communication Skills", "Electronic Health Records (EHR)"];

const jobPostingSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  jobDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  salary: z.string().min(1, { message: "Salary is required." }),
  workingHours: z.string().min(1, { message: "Working hours are required." }),
  benefits: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one benefit." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  jobCategory: z.string({ message: "Please select a job category." }),
  skills: z.array(z.string()).refine((value) => value.length > 0, { message: "Select at least one skill." }),
  eligibility: z.string().min(10, { message: "Eligibility must be at least 10 characters." }),
});

type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

const JobPostingForm = () => {
  const router = useRouter();
  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      salary: "",
      workingHours: "",
      benefits: [],
      location: "",
      skills: [],
      eligibility: "",
    },
  });

  async function onSubmit(data: JobPostingFormValues) {
    try {
      const payload = {
        title: data.jobTitle,
        description: data.jobDescription,
        payRange: data.salary,
        workingHours: data.workingHours,
        benefits: data.benefits.join(', '),
        location: data.location,
        category: data.jobCategory,
        skills: data.skills.join(', '),
        eligibility: data.eligibility,
      };

      // await jobApiClient.post("/private/job", payload);
      toast.success("Job posted successfully!");
      form.reset();
      
      // Optionally redirect to jobs page
      // router.push('/jobs');
    } catch (error: any) {
      toast.error("Failed to post job: " + (error.message || "Unknown error"));
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Post a Job</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create New Job Posting
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the form below to post a job opening and attract top healthcare talent.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Job Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Senior Cardiologist" 
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Mumbai, Maharashtra" 
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the role, responsibilities, and what makes this position unique..."
                            className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Salary / Pay Range</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., ₹15-25 LPA" 
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Working Hours</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 9 AM - 5 PM, 6 days a week" 
                              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jobCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Job Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="benefits"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Benefits Offered</FormLabel>
                          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {benefits.map((benefit) => (
                              <FormField
                                key={benefit}
                                control={form.control}
                                name="benefits"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(benefit)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, benefit])
                                            : field.onChange(field.value?.filter((value) => value !== benefit));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-gray-700">{benefit}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Required Skills</FormLabel>
                          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {skills.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, skill])
                                            : field.onChange(field.value?.filter((value) => value !== skill));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-gray-700">{skill}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Eligibility Criteria</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specify required qualifications, experience, certifications, etc."
                            className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Posting Job..." : "Post Job"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
