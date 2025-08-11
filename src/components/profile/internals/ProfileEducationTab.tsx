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
  createEducation,
  getUserEducations,
  searchInstitutions,
  getInstitutionById,
} from "@/lib/api";
import { toast } from "sonner";

interface ProfileEducationTabProps {
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

export const ProfileEducationTab = ({ userId }: ProfileEducationTabProps) => {
  const [educations, setEducations] = useState<Array<{
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

  // Fetch educations with institution data
  useEffect(() => {
    const fetchEducations = async () => {
      setIsLoading(true);
      try {
        const data = await getUserEducations(userId);
        // Enrich with institution data
        const enrichedData = await Promise.all(
          data.map(async (edu: {
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
              const institution = await getInstitutionById(edu.institution_id);
              return {
                ...edu,
                institutionName: institution.name,
                institutionLogo:
                  institution.profile_picture || "/default-institution.png",
              };
            } catch (error) {
              console.error(
                `Failed to fetch institution ${edu.institution_id}`,
                error
              );
              return {
                ...edu,
                institutionName: "Unknown Institution",
                institutionLogo: "/default-institution.png",
              };
            }
          })
        );
        setEducations(enrichedData);
      } catch (error) {
        console.error("Failed to fetch educations:", error);
        toast.error("Failed to fetch education data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
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
    const loadingToast = toast.loading("Adding education...");

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

      const newEducation = await createEducation(payload);

      // Fetch institution data for the new education
      try {
        const institution = await getInstitutionById(
          newEducation.institution_id
        );
        setEducations((prev) => [
          ...prev,
          {
            ...newEducation,
            institutionName: institution.name,
            institutionLogo:
              institution.profile_picture || "/default-institution.png",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
        setEducations((prev) => [
          ...prev,
          {
            ...newEducation,
            institutionName: "Unknown Institution",
            institutionLogo: "/default-institution.png",
          },
        ]);
      }

      toast.success("Education added successfully");
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
      console.error("Failed to add education:", error);
      toast.error("Failed to add education");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-2xl">Education</CardTitle>
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
              <DialogTitle className="text-xl">Add Education</DialogTitle>
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
                <Label htmlFor="title">Degree/Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Bachelor of Science"
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
                  <Label htmlFor="endDate">End Date (or expected)</Label>
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
                <Label htmlFor="isCurrent">I am currently studying here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your education experience"
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
                  Add Education
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : educations.length > 0 ? (
          educations.map((education) => (
            <div key={education.id} className="flex gap-4 items-start mb-6">
              <img
                src={education.institutionLogo}
                alt={education.institutionName}
                className="h-10 w-10 rounded shadow-sm"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {education.institutionName}
                </div>
                <div className="text-sm text-gray-600">{education.title}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(education.start_date)} -{" "}
                  {education.end_date
                    ? formatDate(education.end_date)
                    : formatDate(null, true)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {education.description}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No education found.</div>
        )}
      </CardContent>
    </Card>
  );
};
