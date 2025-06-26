import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface InvitationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationPopup: React.FC<InvitationPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    profession: '',
    otherProfession: ''
  });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const professionOptions = [
    "Doctor", "Medical Student", "Researcher", "Healthcare Professional",
    "Institution Representative", "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfessionChange = (value: string) => {
    setFormData(prev => ({ ...prev, profession: value, otherProfession: '' }));
    setShowOtherInput(value === 'Other');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.emailAddress || !formData.profession) return;
    if (formData.profession === 'Other' && !formData.otherProfession) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://waitlist.pharminc.in/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.emailAddress,
          profession: formData.profession === 'Other' ? formData.otherProfession : formData.profession,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setIsSubmitted(true);
      // Show survey prompt after 2 seconds
      setTimeout(() => {
        setShowSurveyPrompt(true);
      }, 2000);
    } catch (err) {
      setError('There was a problem adding you to the waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurveyClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSd2In9dAl15j33n5ZLDzH7jafhTeaVfzobcwMSFuPT_TYLvlQ/viewform', '_blank');
    onClose();
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setShowSurveyPrompt(false);
    setFormData({
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      profession: '',
      otherProfession: ''
    });
    setShowOtherInput(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-xl font-semibold text-center pr-6 text-gray-900">
            {!isSubmitted ? (
              "Your future network is already forming. The only thing missing is you. Join Pharminc now."
            ) : showSurveyPrompt ? (
              "One more thing..."
            ) : (
              "Welcome to Pharminc!"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  placeholder="Enter your phone number"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="text-gray-700">Email Address *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-gray-700">Profession *</Label>
                <Select value={formData.profession} onValueChange={handleProfessionChange} required>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {professionOptions.map((profession) => (
                      <SelectItem key={profession} value={profession} className="hover:bg-blue-50">
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showOtherInput && (
                <div className="space-y-2">
                  <Label htmlFor="otherProfession" className="text-gray-700">Please specify *</Label>
                  <Input
                    id="otherProfession"
                    type="text"
                    value={formData.otherProfession}
                    onChange={(e) => handleInputChange('otherProfession', e.target.value)}
                    required
                    placeholder="Enter your profession"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Now"}
              </Button>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          ) : (
            <div className="text-center space-y-4">
              {!showSurveyPrompt ? (
                <p className="text-lg text-gray-700">
                  Thanks for joining Pharminc! We're thrilled to have you onboard.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We'd love to get to know you better! Would you be open to filling out a quick 5-minute survey to help shape the future of Pharminc?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleSurveyClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Take the Survey
                    </Button>
                    <Button onClick={handleClose} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Maybe Later
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationPopup;
