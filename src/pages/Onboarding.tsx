import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { userService, institutionService, userEducationService, userExperienceService } from "@/services";
import { tokenStorage } from "@/utils/tokenStorage";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Camera } from "lucide-react";

const Onboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // URL or base64 string

  // Institution
  const [institutionName, setInstitutionName] = useState("");
  const [institutionAbout, setInstitutionAbout] = useState("");
  const [institutionLocation, setInstitutionLocation] = useState("");
  const [institutionId, setInstitutionId] = useState<string | null>(null);

  // Education
  const [eduTitle, setEduTitle] = useState("");
  const [eduDescription, setEduDescription] = useState("");
  const [eduStartDate, setEduStartDate] = useState("");
  const [eduEndDate, setEduEndDate] = useState("");

  // Experience
  const [expTitle, setExpTitle] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user object and userId from tokenStorage
  const userObj = tokenStorage.getUser && tokenStorage.getUser();
  const userId =
    userObj?.userId ||
    userObj?.id ||
    (typeof userObj === "string" ? userObj : undefined);

  // Fetch user info on mount
  useEffect(() => {
    if (!userId) {
      toast({
        title: "No user found",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }
    setIsLoading(true);
    userService
      .getUserById(userId)
      .then((data) => {
        setProfile(data);
        setAbout(data.about || "");
        setLocation(data.location || "");
        setInterests(data.interests || "");
        setProfilePicture(data.profilePicture || "");
      })
      .catch((error) => {
        toast({
          title: "Failed to fetch profile",
          description: error.message || "Could not fetch your profile.",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  // Handle file input change (convert to base64 string for demo, or upload to server if you have an endpoint)
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userId) throw new Error("No user ID found");

      let createdInstitutionId = institutionId;

      // 1. Create institution if needed (only if user entered something)
      if (!createdInstitutionId && institutionName) {
        const institutionRes = await institutionService.createInstitution({
          name: institutionName,
          type: "institution",
          location: institutionLocation,
        });
        if (!institutionRes.id) {
          throw new Error("Institution creation failed: No ID returned.");
        }
        createdInstitutionId = institutionRes.id;
        setInstitutionId(createdInstitutionId);
      }

      // 2. POST education (only if user entered something)
      if (eduTitle || eduDescription || eduStartDate || eduEndDate) {
        await userEducationService.createUserEducation({
          title: eduTitle,
          description: eduDescription,
          startDate: eduStartDate ? new Date(eduStartDate).toISOString() : undefined,
          endDate: eduEndDate ? new Date(eduEndDate).toISOString() : undefined,
          institutionId: createdInstitutionId,
        });
      }

      // 3. POST experience (only if user entered something)
      if (expTitle || expDescription || expStartDate || expEndDate) {
        await userExperienceService.createUserExperience({
          title: expTitle,
          description: expDescription,
          startDate: expStartDate ? new Date(expStartDate).toISOString() : undefined,
          endDate: expEndDate ? new Date(expEndDate).toISOString() : undefined,
          institutionId: createdInstitutionId,
        });
      }

      // 4. Update user profile (local storage only, as your logic)
      const existingUser = tokenStorage.getUser() || {};
      const updatedUser = {
        ...existingUser,
        about,
        location,
        interests,
        profilePicture: profilePicture || existingUser.profilePicture,
        userId: existingUser.userId || profile?.userId,
        firstName: existingUser.firstName || profile?.firstName,
        lastName: existingUser.lastName || profile?.lastName,
        email: existingUser.email || profile?.email,
        specialization: existingUser.specialization || profile?.specialization,
      };
      tokenStorage.setUser(updatedUser);

      toast({
        title: "Profile updated successfully!",
        description: "You have completed onboarding. You can now proceed.",
      });

      navigate("/profile");
    } catch (error: any) {
      console.error("Profile creation error:", error);

      let errorMessage = "An error occurred while creating your profile";
      if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Profile creation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Tell us more about yourself to get the most out of PharmInc</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="profilePicture" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Profile Picture
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                disabled={isLoading}
                className="flex-1"
                onChange={handleProfilePicChange}
              />
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <Label htmlFor="about">About You</Label>
            <Textarea
              id="about"
              name="about"
              placeholder="Tell us about your professional background, interests, and what you're passionate about..."
              rows={4}
              disabled={isLoading}
              value={about}
              onChange={e => setAbout(e.target.value)}
            />
          </div>

          {/* Location Section */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="City, Country"
              disabled={isLoading}
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {/* Interests Section */}
          <div className="space-y-2">
            <Label htmlFor="interests">Professional Interests</Label>
            <Input
              id="interests"
              name="interests"
              placeholder="e.g., Cardiology research, Medical education, Healthcare technology"
              disabled={isLoading}
              value={interests}
              onChange={e => setInterests(e.target.value)}
            />
          </div>

          {/* Institution Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Institution</h2>
            <Label>Name</Label>
            <Input value={institutionName} onChange={e => setInstitutionName(e.target.value)} />
            <Label>About</Label>
            <Textarea value={institutionAbout} onChange={e => setInstitutionAbout(e.target.value)} />
            <Label>Location</Label>
            <Input value={institutionLocation} onChange={e => setInstitutionLocation(e.target.value)} />
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Education</h2>
            <Label>Title</Label>
            <Input value={eduTitle} onChange={e => setEduTitle(e.target.value)} />
            <Label>Description</Label>
            <Textarea value={eduDescription} onChange={e => setEduDescription(e.target.value)} />
            <Label>Start Date</Label>
            <Input type="date" value={eduStartDate} onChange={e => setEduStartDate(e.target.value)} />
            <Label>End Date</Label>
            <Input type="date" value={eduEndDate} onChange={e => setEduEndDate(e.target.value)} />
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">Experience</h2>
            <Label>Title</Label>
            <Input value={expTitle} onChange={e => setExpTitle(e.target.value)} />
            <Label>Description</Label>
            <Textarea value={expDescription} onChange={e => setExpDescription(e.target.value)} />
            <Label>Start Date</Label>
            <Input type="date" value={expStartDate} onChange={e => setExpStartDate(e.target.value)} />
            <Label>End Date</Label>
            <Input type="date" value={expEndDate} onChange={e => setExpEndDate(e.target.value)} />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Saving your profile..." : "Complete Profile"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
