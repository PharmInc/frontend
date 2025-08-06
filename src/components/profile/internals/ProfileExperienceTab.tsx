import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createExperience,
  getUserExperiences,
  searchInstitutions,
  getInstitutionById,
} from "@/lib/api";
import { toast } from "sonner";

interface ProfileExperienceTabProps {
  userId: string;
}

// Date formatting utility
const formatDate = (dateString: string | null, isCurrent?: boolean) => {
  if (!dateString) return isCurrent ? "Present" : "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const ProfileExperienceTab = ({ userId }: ProfileExperienceTabProps) => {
  const [experiences, setExperiences] = useState<Array<{
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    user_id: string;
    institution_id: string;
    created_at: string;
    updated_at: string;
    institutionName?: string;
    institutionLogo?: string;
  }>>([]);
  const [institutions, setInstitutions] = useState<Array<{
    id: string;
    name: string;
    location: string;
    type: string;
    created_at: string;
    updated_at: string;
    verified?: boolean;
    email?: string;
    employees_count?: string;
    area_of_expertise?: string;
    profile_picture?: string;
    banner_picture?: string;
    contact_email?: string;
    contact_number?: string;
    bio?: string;
    about?: string;
    followers?: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInstitutionLoading, setIsInstitutionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    institutionId: "",
    institutionName: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  // Fetch experiences with institution data
  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      try {
        const data = await getUserExperiences(userId);
        // Enrich with institution data
        const enrichedData = await Promise.all(
          data.map(async (exp: {
            id: string;
            title: string;
            description: string;
            start_date: string;
            end_date: string | null;
            user_id: string;
            institution_id: string;
            created_at: string;
            updated_at: string;
          }) => {
            try {
              const institution = await getInstitutionById(exp.institution_id);
              return {
                ...exp,
                institutionName: institution.name,
                institutionLogo:
                  institution.profile_picture || "/default-institution.png",
              };
            } catch (error) {
              console.error(
                `Failed to fetch institution ${exp.institution_id}`,
                error
              );
              return {
                ...exp,
                institutionName: "Unknown Institution",
                institutionLogo: "/default-institution.png",
              };
            }
          })
        );
        setExperiences(enrichedData);
        toast.success("Experience data loaded successfully");
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
        toast.error("Failed to fetch experience data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [userId]);

  // Search institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (searchQuery.length < 2) {
        setInstitutions([]);
        setShowInstitutionDropdown(false);
        return;
      }

      setIsInstitutionLoading(true);
      setShowInstitutionDropdown(true);
      try {
        const response = await searchInstitutions({ name: searchQuery });
        setInstitutions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
        toast.error("Failed to fetch institutions");
        setInstitutions([]);
      } finally {
        setIsInstitutionLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchInstitutions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstitutionSelect = (institution: {
    id: string;
    name: string;
    location: string;
    type: string;
    created_at: string;
    updated_at: string;
    verified?: boolean;
    email?: string;
    employees_count?: string;
    area_of_expertise?: string;
    profile_picture?: string;
    banner_picture?: string;
    contact_email?: string;
    contact_number?: string;
    bio?: string;
    about?: string;
    followers?: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      institutionId: institution.id,
      institutionName: institution.name,
    }));
    setSearchQuery(institution.name);
    setShowInstitutionDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding experience...");

    try {
      const payload = {
        institution_id: formData.institutionId,
        title: formData.title,
        description: formData.description,
        start_date: new Date(formData.startDate).toISOString(),
        end_date: formData.isCurrent
          ? null
          : new Date(formData.endDate).toISOString(),
      };

      const newExperience = await createExperience(payload);

      // Fetch institution data for the new experience
      try {
        const institution = await getInstitutionById(
          newExperience.institution_id
        );
        setExperiences((prev) => [
          ...prev,
          {
            ...newExperience,
            institutionName: institution.name,
            institutionLogo:
              institution.profile_picture || "/default-institution.png",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
        setExperiences((prev) => [
          ...prev,
          {
            ...newExperience,
            institutionName: "Unknown Institution",
            institutionLogo: "/default-institution.png",
          },
        ]);
      }

      toast.success("Experience added successfully");
      setFormData({
        institutionId: "",
        institutionName: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      });
      setSearchQuery("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add experience:", error);
      toast.error("Failed to add experience");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-2xl">Experience</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 rounded"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="institutionSearch">Institution</Label>
                <Input
                  id="institutionSearch"
                  placeholder="Search for institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchQuery.length >= 2 && setShowInstitutionDropdown(true)
                  }
                />

                {showInstitutionDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {isInstitutionLoading ? (
                      <div className="p-2 text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : institutions.length > 0 ? (
                      institutions.map((institution) => (
                        <div
                          key={institution.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleInstitutionSelect(institution)}
                        >
                          <div className="font-medium">{institution.name}</div>
                          <div className="text-xs text-gray-500">
                            {institution.location}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        {searchQuery.length >= 2
                          ? "No institutions found"
                          : "Type at least 2 characters to search"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Software Engineer"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isCurrent"
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="isCurrent">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your experience"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Experience
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : experiences.length > 0 ? (
          experiences.map((experience) => (
            <div key={experience.id} className="flex gap-4 items-start mb-6">
              <img
                src={experience.institutionLogo}
                alt={experience.institutionName}
                className="h-10 w-10 rounded shadow-sm"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {experience.institutionName}
                </div>
                <div className="text-sm text-gray-600">{experience.title}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(experience.start_date)} -{" "}
                  {experience.end_date
                    ? formatDate(experience.end_date)
                    : formatDate(null, true)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {experience.description}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No experience found.</div>
        )}
      </CardContent>
    </Card>
  );
};
