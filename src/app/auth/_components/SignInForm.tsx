import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function SignInForm({ 
  email, 
  password, 
  onEmailChange, 
  onPasswordChange, 
  onSubmit,
  loading = false 
}: SignInFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm">
          Remember me
        </Label>
      </div>

      <Button 
        onClick={onSubmit} 
        className="w-full" 
        disabled={loading || !email || !password}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
