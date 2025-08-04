"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login, createUser, setAuthToken, register } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { AuthFormHeader, AuthFormTabs, SignInForm, SignUpForm } from "../_components";

export default function DoctorAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { fetchCurrentUser } = useUserStore();

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
    
    if (!firstName || !lastName || !email || !password || !location || !specialization) {
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
          specialization: specialization,
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
  };  const doctorSpecificFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select value={specialization} onValueChange={setSpecialization}>
          <SelectTrigger>
            <SelectValue placeholder="Select your specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="psychiatry">Psychiatry</SelectItem>
            <SelectItem value="surgery">Surgery</SelectItem>
            <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
            <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="number"
          placeholder="Years of practice"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Stethoscope}
        title="Doctor Portal"
        subtitle="Join our community of medical professionals"
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
            roleSpecificFields={doctorSpecificFields}
          />
        }
      />
    </div>
  );
}
