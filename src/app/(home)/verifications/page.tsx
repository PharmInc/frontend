"use client"
// TODO - REMOVE HARDCODED STUFF

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/store'
import { getAuthToken } from '@/lib/api/utils'

// Validation schema
const verificationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  medicalRegistrationNumber: z.string().min(1, "Medical registration number is required"),
  yearOfAdmission: z.string().min(4, "Year of admission is required").max(4, "Year must be 4 digits"),
  stateCouncil: z.string().min(1, "State council is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  emailId: z.string().email("Please enter a valid email address"),
})

type VerificationFormData = z.infer<typeof verificationSchema>

// Mock data for previous verification requests
interface VerificationRequest {
  id: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  name: string
  medicalRegistrationNumber: string
  stateCouncil: string
  remarks?: string
}

const mockVerificationRequests: VerificationRequest[] = [
]

const VerificationPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("submit")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { currentUser, fetchCurrentUser, loading: userLoading } = useUserStore()

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      medicalRegistrationNumber: "",
      yearOfAdmission: "",
      stateCouncil: "",
      phoneNumber: "",
      emailId: "",
    },
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (token) {
        setIsAuthenticated(true)
        if (!currentUser && !userLoading) {
          await fetchCurrentUser()
        }
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [currentUser, fetchCurrentUser, userLoading])

  const onSubmit = async (data: VerificationFormData) => {
    try {
      console.log("Verification form data:", data)
      // TODO: Implement API call to submit verification data
      alert("Verification request submitted successfully!")
      form.reset()
      setActiveTab("history") // Switch to history tab after successful submission
    } catch (error) {
      console.error("Error submitting verification:", error)
      alert("Failed to submit verification request. Please try again.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'under_review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      under_review: 'outline',
    } as const

    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      under_review: 'Under Review',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
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
            <Shield className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Please log in to access verification.</div>
        </div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const yearOptions: string[] = []
  for (let year = currentYear; year >= 1950; year--) {
    yearOptions.push(year.toString())
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Verification</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="p-4 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 border border-gray-200 rounded-full p-1">
            <TabsTrigger 
              value="submit" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4" />
              <span>Submit Request</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center space-x-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4" />
              <span>Request History</span>
              {mockVerificationRequests.length > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {mockVerificationRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Submit Request Tab */}
        <TabsContent value="submit" className="flex-1">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    Medical Verification Request
                  </CardTitle>
                  <CardDescription className="text-center">
                    Please provide your medical credentials to get verified on our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Date of Birth Field */}
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Medical Registration Number Field */}
                      <FormField
                        control={form.control}
                        name="medicalRegistrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Registration Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your medical registration number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Year of Admission Field */}
                      <FormField
                        control={form.control}
                        name="yearOfAdmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year of Admission *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year of admission" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {yearOptions.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* State Council Field */}
                      <FormField
                        control={form.control}
                        name="stateCouncil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State Medical Council *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your state medical council name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone Number Field */}
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="Enter your phone number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email ID Field */}
                      <FormField
                        control={form.control}
                        name="emailId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email address" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? "Submitting..." : "Submit Verification Request"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Request History Tab */}
        <TabsContent value="history" className="flex-1">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Request History</h2>
                <p className="text-gray-600">View the status and details of your previous verification requests</p>
              </div>
              
              {mockVerificationRequests.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Shield className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No verification requests yet</h3>
                    <p className="text-gray-400 text-center max-w-sm mb-4">
                      You haven't submitted any verification requests. Click on "Submit Request" to get started.
                    </p>
                    <Button onClick={() => setActiveTab("submit")} variant="outline">
                      Submit Your First Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockVerificationRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <h3 className="font-semibold text-lg">{request.name}</h3>
                              <p className="text-sm text-gray-600">
                                Submitted on {new Date(request.submittedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Registration Number</p>
                            <p className="text-sm text-gray-900">{request.medicalRegistrationNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">State Council</p>
                            <p className="text-sm text-gray-900">{request.stateCouncil}</p>
                          </div>
                        </div>

                        {request.remarks && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm font-medium text-red-800 mb-1">Remarks:</p>
                            <p className="text-sm text-red-700">{request.remarks}</p>
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700">
                              Your request is being reviewed. We'll notify you once there's an update.
                            </p>
                          </div>
                        )}

                        {request.status === 'approved' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-700">
                              Congratulations! Your verification has been approved. You now have a verified badge on your profile.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default VerificationPage