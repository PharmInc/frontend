import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Institution } from "@/types/api";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  userService,
  institutionService,
  userEducationService as userEducationService,
  userExperienceService as userExperienceService,
} from "@/services";
import { tokenStorage } from "@/utils/tokenStorage";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Camera, User as UserIcon } from "lucide-react"; // <-- IMPORTANT: Use UserIcon for the icon

const Onboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<User | Institution | null>(null);

  // Common state for all users
  const [profilePicture, setProfilePicture] = useState(""); // <-- NOTE: Fixed state name

  // Doctor/Healthcare state
  const [about, setAbout] = useState("");
  const [location, set2Location] = useState("");
  const [interests, setInterests] = useState("");

  // Institution state
  const [institutionName, setInstitutionName] = useState("");
  const [institutionAbout, setInstitutionAbout] = useState("");
  const [institutionLocation, setInstitutionLocation] = useState("");
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [areaOfExpertise, setAreaOfExpertise] = useState("");

  // Education state
  const [eduTitle, setEduTitle] = useState("");
  const [eduDescription, setEduDescription] = useState("");
  const [eduStartDate, setEduStartDate] = useState("");
  const [eduEndDate, setEduEndDate] = useState("");

  // Experience state
  const [expTitle, setExpTitle] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, set2ExpEndDate] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user object and userId from tokenStorage
  const userObj = tokenStorage.getUser && tokenStorage.getUser();
  const userType = userObj?.type || profile?.type;
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
        set2Location(data.location || "");
        setInterests(data.interests || "");
        setProfilePicture(data.profilePicture || "");
        // Prefill institution fields if user is an institution
        if (data.type === "institution") {
          setBio(data.bio || "");
          setContactEmail(data.contact_email || "");
          setContactNumber(data.contact_number || "");
          setEmployeesCount(data.employees_count || "");
          setAreaOfExpertise(data.area_of_expertise || "");
          setInstitutionName(data.name || "");
          setInstitutionAbout(data.about || "");
          setInstitutionLocation(data.location || "");
        }
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

  // Handle file input change (convert to base64 string for demo)
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

      // 1. Create institution if needed (only if user is an institution)
      if (userType === "institution" && institutionName) {
        const institutionRes = await institutionService.createInstitution({
          name: institutionName,
          type: "institution",
          location: institutionLocation,
          bio,
          about: institutionAbout,
          contact_email: contactEmail,
          contact_number: contactNumber,
          employees_count: employeesCount,
          area_of_expertise: areaOfExpertise,
        });
        if (!institutionRes.id) {
          throw new Error("Institution creation failed: No ID returned.");
        }
        createdInstitutionId = institutionRes.id;
        setInstitutionId(createdInstitutionId);
      }

      // 2. POST education (only if user is not an institution)
      if (
        userType !== "institution" &&
        (eduTitle || eduDescription || eduStartDate || eduEndDate)
      ) {
        await userEducationService.createUserEducation({
          title: eduTitle,
          description: eduDescription,
          startDate: eduStartDate ? new Date(eduStartDate).toISOString() : undefined,
          endDate: eduEndDate ? new Date(eduEndDate).toISOString() : undefined,
          institutionId: createdInstitutionId,
        });
      }

      // 3. POST experience (only if user is not an institution)
      if (
        userType !== "institution" &&
        (expTitle || expDescription || expStartDate || expEndDate)
      ) {
        await userExperienceService.createUserExperience({
          title: expTitle,
          description: expDescription,
          startDate: expStartDate ? new Date(expStartDate).toISOString() : undefined,
          endDate: expEndDate ? new Date(expEndDate).toISOString() : undefined,
          institutionId: createdInstitutionId,
        });
      }

      // 4. Update user profile
      const existingUser = tokenStorage.getUser() || {};
      const updatedUser = {
        ...existingUser,
        about: userType === "institution" ? institutionAbout : about,
        location: userType === "institution" ? institutionLocation : location,
        interests,
        profilePicture: profilePicture || existingUser.profilePicture,
        userId: existingUser.userId || profile?.userId,
        firstName: existingUser.firstName || profile?.firstName,
        lastName: existingUser.lastName || profile?.lastName,
        email: existingUser.email || profile?.email,
        specialization: existingUser.specialization || profile?.specialization,
        // Institution-specific fields
        ...(userType === "institution"
          ? {
              bio,
              contact_email: contactEmail,
              contact_number: contactNumber,
              employees_count: employeesCount,
              area_of_expertise: areaOfExpertise,
            }
          : {}),
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
              <UserIcon className="h-8 w-8 text-blue-600" /> // <-- IMPORTANT: Use UserIcon, not User
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Tell us more about yourself to get the most out of PharmInc
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
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
                  <UserIcon className="h-8 w-8 text-gray-400" /> // <-- IMPORTANT: Use UserIcon, not User
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

          {/* Conditional Fields */}
          {userType === "institution" ? (
            <>
              {/* Institution Name */}
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Institution Name"
                  disabled={isLoading}
                />
              </div>
              {/* Institution Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={institutionLocation}
                  onChange={(e) => setInstitutionLocation(e.target.value)}
                  placeholder="City, Country"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief introduction about your institution"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>About</Label>
                <Textarea
                  value={institutionAbout}
                  onChange={(e) => setInstitutionAbout(e.target.value)}
                  placeholder="Detailed description about your institution"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@institution.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1234567890"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Employees</Label>
                <Input
                  value={employeesCount}
                  onChange={(e) => setEmployeesCount(e.target.value)}
                  placeholder="e.g. 50"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Area of Expertise</Label>
                <Input
                  value={areaOfExpertise}
                  onChange={(e) => setAreaOfExpertise(e.target.value)}
                  placeholder="e.g. Healthcare, Education, Research"
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              {/* Doctor/Healthcare Fields */}
              <div className="space-y-2">
                <Label>About You</Label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about your professional background..."
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={location}
                  onChange={(e) => set2Location(e.target.value)}
                  placeholder="City, Country"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Professional Interests</Label>
                <Input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., Cardiology research, Medical education..."
                  disabled={isLoading}
                />
              </div>
              {/* Education Section */}
              <div>
                <h2 className="text-xl font-bold mb-2">Education</h2>
                <Label>Title</Label>
                <Input
                  value={eduTitle}
                  onChange={(e) => setEduTitle(e.target.value)}
                  disabled={isLoading}
                />
                <Label>Description</Label>
                <Textarea
                  value={eduDescription}
                  onChange={(e) => setEduDescription(e.target.value)}
                  disabled={isLoading}
                />
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={eduStartDate}
                  onChange={(e) => setEduStartDate(e.target.value)}
                  disabled={isLoading}
                />
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={eduEndDate}
                  onChange={(e) => setEduEndDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {/* Experience Section */}
              <div>
                <h2 className="text-xl font-bold mb-2">Experience</h2>
                <Label>Title</Label>
                <Input
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  disabled={isLoading}
                />
                <Label>Description</Label>
                <Textarea
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  disabled={isLoading}
                />
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={expStartDate}
                  onChange={(e) => setExpStartDate(e.target.value)}
                  disabled={isLoading}
                />
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={expEndDate}
                  onChange={(e) => setEduEndDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}
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
