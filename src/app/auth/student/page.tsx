"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login, createUser, setAuthToken, register } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";

function StudentAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { fetchCurrentUser } = useUserStore();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "";

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { token } = await login({
        email: email,
        password: password,
        type: "user",
      });
      
      setAuthToken(token, "user");
      await fetchCurrentUser();
      
      router.push("/home");
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (loading) return;
    
    if (!firstName || !lastName || !email || !password || !location || !university || !degree) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    
    try {
      const status = await register({
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        type: "user",
      });
      
      if (status === 201) {
        const { token } = await login({
          email: email,
          password: password,
          type: "user",
        });
        
        setAuthToken(token, "user");
        
        await createUser({
          name: `${firstName} ${lastName}`,
          location: location,
          role: "user",
        });
        
        await fetchCurrentUser();
        
        router.push("/home");
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const studentSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="university">University/Institution</Label>
        <Input
          id="university"
          type="text"
          placeholder="Enter your university name"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Degree Program</Label>
        <Select value={degree} onValueChange={setDegree}>
          <SelectTrigger>
            <SelectValue placeholder="Select your degree program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mbbs">MBBS</SelectItem>
            <SelectItem value="md">MD</SelectItem>
            <SelectItem value="phd-medicine">PhD in Medicine</SelectItem>
            <SelectItem value="nursing">Nursing</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
            <SelectItem value="dentistry">Dentistry</SelectItem>
            <SelectItem value="veterinary">Veterinary Medicine</SelectItem>
            <SelectItem value="biomedical-engineering">Biomedical Engineering</SelectItem>
            <SelectItem value="public-health">Public Health</SelectItem>
            <SelectItem value="medical-research">Medical Research</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearOfStudy">Year of Study</Label>
        <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
          <SelectTrigger>
            <SelectValue placeholder="Select your year of study" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1st Year</SelectItem>
            <SelectItem value="2">2nd Year</SelectItem>
            <SelectItem value="3">3rd Year</SelectItem>
            <SelectItem value="4">4th Year</SelectItem>
            <SelectItem value="5">5th Year</SelectItem>
            <SelectItem value="6">6th Year</SelectItem>
            <SelectItem value="postgraduate">Postgraduate</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={GraduationCap}
        title="Student Portal"
        subtitle="Connect with peers and advance your medical education"
      />

      <AuthFormTabs
        signInContent={
          <SignInForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSignIn}
            loading={loading}
          />
        }
        signUpContent={
          <SignUpForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            location={location}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLocationChange={setLocation}
            onSubmit={handleSignUp}
            loading={loading}
            roleSpecificFields={studentSpecificFields}
          />
        }
        defaultTab={type === "signup" ? "signup" : "signin"}
      />
    </div>
  );
}

export default function StudentAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentAuthContent />
    </Suspense>
  );
}