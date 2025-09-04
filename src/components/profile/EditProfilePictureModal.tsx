import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { useUserStore, useInstitutionStore } from "@/store";
import { updateUser } from "@/lib/api/services/user";

interface EditProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfilePicture?: string;
  userName?: string;
  userId: string;
  isInstitute?: boolean;
  onUpdate: (newProfilePictureUrl: string) => void;
}

export function EditProfilePictureModal({
  isOpen,
  onClose,
  currentProfilePicture,
  userName,
  userId,
  isInstitute = false,
  onUpdate,
}: EditProfilePictureModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchCurrentUser } = useUserStore();
  const { updateCurrentInstitution } = useInstitutionStore();

  const handleFileSelect = useCallback((file: File) => {
    setUploadMessage(null);
    setUploadError(null);
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadMessage(null);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      if (isInstitute) {
        formData.append('instituteId', userId);
      } else {
        formData.append('userId', userId);
      }

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }

      const result = await response.json();
      
      if (isInstitute) {
        try {
          await updateCurrentInstitution({ profile_picture: result.url });
          console.log('Institution profile updated in database');
        } catch (dbError) {
          console.error('Failed to update institution profile in database:', dbError);
          setUploadError('Profile picture uploaded but failed to update profile. Please refresh the page.');
          return;
        }
      } else {
        try {
          await updateUser({ profile_picture: result.url });
          console.log('User profile updated in database');
        } catch (dbError) {
          console.error('Failed to update user profile in database:', dbError);
          setUploadError('Profile picture uploaded but failed to update profile. Please refresh the page.');
          return;
        }
      }
      
      onUpdate(result.url);
      
      if (!isInstitute) {
        fetchCurrentUser();
      }
      
      setUploadMessage('Profile picture updated successfully!');
      
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setIsDragOver(false);
    setUploadMessage(null);
    setUploadError(null);
    onClose();
  };

  const handleRemoveSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const displayImage = previewUrl || currentProfilePicture || "/pp.png";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-gray-200">
                <AvatarImage
                  src={displayImage}
                  alt={userName || "Profile"}
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                  {userName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {selectedFile && (
                <button
                  onClick={handleRemoveSelection}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-sm transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
              
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Drag and drop an image here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          {uploadMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-600">{uploadMessage}</p>
            </div>
          )}

          {!selectedFile && !uploadError && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Update
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
