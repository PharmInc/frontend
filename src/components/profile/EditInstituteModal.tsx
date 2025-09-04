"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Institution, InstitutionUpdateParams } from "@/lib/api/types";
import { useInstitutionStore } from "@/store";
import { toast } from "sonner";

interface EditInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  onUpdate: (updatedInstitution: Institution) => void;
}

const institutionTypes = [
  "Hospital",
  "University",
  "Research Institute",
  "Pharmaceutical Company",
  "Government Agency",
  "NGO",
  "Clinic",
  "Laboratory",
  "Other"
];

export function EditInstituteModal({ isOpen, onClose, institution, onUpdate }: EditInstituteModalProps) {
  const [formData, setFormData] = useState<InstitutionUpdateParams>({
    name: institution.name || "",
    location: institution.location || "",
    type: institution.type || "",
    email: institution.email || "",
    contact_email: institution.contact_email || "",
    contact_number: institution.contact_number || "",
    employees_count: institution.employees_count || "",
    area_of_expertise: institution.area_of_expertise || "",
    bio: institution.bio || "",
    about: institution.about || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { updateCurrentInstitution } = useInstitutionStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: InstitutionUpdateParams = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          updateData[key as keyof InstitutionUpdateParams] = value;
        }
      });

      const updatedInstitution = await updateCurrentInstitution(updateData);
      onUpdate(updatedInstitution);
      onClose();
      toast.success("Institution updated successfully!");
    } catch (error) {
      console.error("Error updating institution:", error);
      toast.error("Failed to update institution. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Institution</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter institution name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Institution Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select institution type" />
                </SelectTrigger>
                <SelectContent>
                  {institutionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees_count">Number of Employees</Label>
              <Input
                id="employees_count"
                name="employees_count"
                value={formData.employees_count}
                onChange={handleInputChange}
                placeholder="e.g., 100-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter primary email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="Enter contact email"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_of_expertise">Area of Expertise</Label>
            <Input
              id="area_of_expertise"
              name="area_of_expertise"
              value={formData.area_of_expertise}
              onChange={handleInputChange}
              placeholder="e.g., Cardiology, Pharmaceutical Research, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Enter a short bio about the institution"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us more about the institution"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Institution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
