"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { login, createInstitution, setAuthToken, register } from "@/lib/api";
import { useInstitutionStore } from "@/store/institutionStore";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";

function InstitutionAuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [location, setLocation] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { fetchCurrentInstitution } = useInstitutionStore();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "";

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { token } = await login({
        email: email,
        password: password,
        type: "institution",
      });
      
      setAuthToken(token, "institution");
      
      await fetchCurrentInstitution();
      
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
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !location || !institutionName || !institutionType) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);

    try {
      const status = await register({
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        type: "institution",
      });

      if (status === 201) {
        const { token } = await login({
          email: email,
          password: password,
          type: "institution",
        });

        setAuthToken(token, "institution");

        const institutionResponse = await createInstitution({
          name: institutionName,
          location: location,
          type: institutionType,
        });

        await fetchCurrentInstitution();

        router.push(`/institute/${institutionResponse.id}`);
      } else {
        alert("Institution registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Institution registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const institutionSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="institutionName">Institution Name</Label>
        <Input
          id="institutionName"
          placeholder="Hospital/Clinic name"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="institutionType">Institution Type</Label>
        <Select value={institutionType} onValueChange={setInstitutionType}>
          <SelectTrigger>
            <SelectValue placeholder="Select institution type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="research-center">Research Center</SelectItem>
            <SelectItem value="university">Medical University</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="laboratory">Laboratory</SelectItem>
            <SelectItem value="nursing-home">Nursing Home</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your institution"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={3}
        />
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Building}
        title="Institution Portal"
        subtitle="Register your medical institution"
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
            roleSpecificFields={institutionSpecificFields}
          />
        }
        defaultTab={type === "signup" ? "signup" : "signin"}
        hideSignup={true}
      />
    </div>
  );
}

export default function InstitutionAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstitutionAuthContent />
    </Suspense>
  );
}
