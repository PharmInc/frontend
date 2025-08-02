import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SignUpFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  roleSpecificFields?: React.ReactNode;
}

export function SignUpForm({ 
  firstName,
  lastName,
  email, 
  password,
  location,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange, 
  onPasswordChange,
  onLocationChange,
  onSubmit,
  loading = false,
  roleSpecificFields
}: SignUpFormProps) {
  const isFormValid = firstName && lastName && email && password && location;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, Country"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          disabled={loading}
        />
      </div>

      {roleSpecificFields}

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button 
        onClick={onSubmit} 
        className="w-full" 
        disabled={loading || !isFormValid}
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </div>
  );
}
