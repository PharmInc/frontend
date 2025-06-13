import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, HeartPulse, Users } from "lucide-react";
import { motion } from "framer-motion";
import { authService, SignupRequest } from "@/services/authService";
import { tokenStorage } from "@/utils/tokenStorage";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '../services/apiClient';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("signup");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authService.login({ email, password });

      if (response.token) {
        tokenStorage.setToken(response.token);

        toast({
          title: "Login successful",
          description: `Welcome back, ${email}!`,
        });

        navigate("/home-feed");
      } else {
        throw new Error("Login failed - invalid credentials");
      }
    } catch (error: any) {
      let errorMessage = "An error occurred during login";
      if (error?.message) {
        if (error.message.includes("Network error") || error.message.includes("CORS")) {
          errorMessage = "Connection error: Please check your internet connection or try again later.";
        } else if (error.message.includes("401") || error.message.includes("invalid credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("404")) {
          errorMessage = "Account not found. Please sign up first or check your email address.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const specialty = formData.get("specialty") as string;

    try {
      const signupData: SignupRequest = {
        firstName,
        lastName,
        email,
        password,
        specialty,
        userType: userType as "doctor" | "healthcare",
      };

      // 1. Register user (auth)
      await authService.signup(signupData);

      // 2. Immediately log in to get JWT token
      const loginResponse = await authService.login({ email, password });
      if (!loginResponse.token) {
        throw new Error("Login failed after signup. Please try logging in manually.");
      }
      tokenStorage.setToken(loginResponse.token);

      // 3. Now create the user profile (with JWT token set)
      await apiClient.post('/user', {
        firstName,
        lastName,
        specialization: specialty
      });

      // 4. Store user info with userId for onboarding
      tokenStorage.setUser({
        userId: loginResponse.userId,
        firstName,
        lastName,
        email,
        specialty,
        userType
      });

      toast({
        title: "Account created successfully",
        description: `Welcome to PharmInc, ${firstName}! Please complete your profile.`,
      });

      navigate("/onboarding");
    } catch (error: any) {
      let errorMessage = "An error occurred during signup";
      if (error?.message) {
        if (error.message.includes("Network error") || error.message.includes("CORS")) {
          errorMessage = "Connection error: Please check your internet connection or try again later.";
        } else if (error.message.includes("409") || error.message.includes("already exists")) {
          errorMessage = "An account with this email already exists. Please try logging in instead.";
          setActiveTab("login");
          navigate("/signup");
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid signup data. Please check all fields and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelect = (type: string) => {
    setUserType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white flex">
      {/* Left column - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="PharmInc Logo" className="h-12 w-auto rounded-md" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join the Medical Network</h1>
            <p className="text-gray-600">Connect with colleagues, share research, and advance your career</p>
          </div>

          {!userType && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-center mb-6">Choose Your Profile Type</h2>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUserTypeSelect("doctor")}
                className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">For Doctors</h3>
                    <p className="text-gray-600 text-sm">Medical practitioners, specialists, and physicians</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUserTypeSelect("healthcare")}
                className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">For Healthcare Professionals</h3>
                    <p className="text-gray-600 text-sm">Nurses, pharmacists, researchers, and other healthcare workers</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {userType && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setUserType("")}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  ← Back
                </Button>
                <div className="flex items-center gap-2">
                  {userType === "doctor" ? (
                    <Stethoscope className="h-5 w-5 text-[#3B82F6]" />
                  ) : (
                    <Users className="h-5 w-5 text-[#3B82F6]" />
                  )}
                  <span className="text-sm text-gray-600">
                    {userType === "doctor"
                      ? "Doctor Registration"
                      : "Healthcare Professional Registration"}
                  </span>
                </div>
              </div>

              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="signup" disabled={isLoading}>
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="login" disabled={isLoading}>
                  Log In
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="Dr. Anil" required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Kumar" required disabled={isLoading} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={userType === "doctor" ? "doctor@hospital.org" : "professional@healthcare.org"}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">
                      {userType === "doctor" ? "Medical Specialty" : "Professional Area"}
                    </Label>
                    <select
                      id="specialty"
                      name="specialty"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                      required
                    >
                      <option value="">
                        Select your {userType === "doctor" ? "specialty" : "area"}
                      </option>
                      {userType === "doctor" ? (
                        <>
                          <option value="cardiology">Cardiology</option>
                          <option value="neurology">Neurology</option>
                          <option value="oncology">Oncology</option>
                          <option value="pediatrics">Pediatrics</option>
                          <option value="surgery">Surgery</option>
                          <option value="other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="nursing">Nursing</option>
                          <option value="pharmacy">Pharmacy</option>
                          <option value="research">Research</option>
                          <option value="administration">Administration</option>
                          <option value="therapy">Therapy</option>
                          <option value="other">Other</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" required disabled={isLoading} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-[#3B82F6] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-[#3B82F6] hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating your account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder={userType === "doctor" ? "doctor@hospital.org" : "professional@healthcare.org"}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-[#3B82F6] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="login-password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" disabled={isLoading} />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("signup")}
                        className="text-[#3B82F6] hover:underline"
                        disabled={isLoading}
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {userType && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="w-full">
                  {/* Google SVG */}
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.545 0 2.939.58 4.02 1.525L19 5.009A10.14 10.14 0 0012.545 2C6.795 2 2 6.795 2 12.546c0 5.752 4.795 10.546 10.545 10.546 6.066 0 10.06-4.267 10.06-10.272 0-.544-.044-1.053-.13-1.545h-9.93z"></path>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  {/* Facebook SVG */}
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.95263 22H14.0526C14.5711 22 15 21.5711 15 21.0526V14.211H17.8801C18.3475 14.211 18.7418 13.863 18.8001 13.3995L18.9695 11.5995C19.0391 11.042 18.6075 10.5263 18.0495 10.5263H15V8.21053C15 7.51216 15.5121 7.00001 16.2105 7.00001H18.1579C18.6764 7.00001 19.1053 6.57106 19.1053 6.05264V4.59106C19.1053 4.10264 18.7354 3.6926 18.2532 3.6158C17.25 3.45528 16.2337 3.37553 15.2159 3.37659C12.0317 3.37659 9.95263 5.45569 9.95263 8.63985V10.5263H7.10527C6.5868 10.5263 6.15789 10.9552 6.15789 11.4737V13.2631C6.15789 13.7816 6.5868 14.2105 7.10527 14.2105H9.95263V21.0526C9.95263 21.5711 10.3816 22 10.9 22"></path>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right column - Illustration */}
      <div className="hidden lg:flex flex-1 bg-[#3B82F6]/5 justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.1">
              <path d="M400 200C400 310.457 310.457 400 200 400C89.5431 400 0 310.457 0 200C0 89.5431 89.5431 0 200 0C310.457 0 400 89.5431 400 200Z" fill="#3B82F6"/>
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connect with Peers</h3>
                  <p className="text-gray-600 text-sm">Build your professional network</p>
                </div>
              </div>
              <p className="text-gray-600">
                Join a growing community of medical professionals sharing knowledge and expertise.
              </p>
            </div>
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stay Updated</h3>
                  <p className="text-gray-600 text-sm">Latest research and case studies</p>
                </div>
              </div>
              <p className="text-gray-600">
                Access cutting-edge research and participate in case discussions with specialists worldwide.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Members</span>
                <span className="text-sm font-medium">25,000+</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: "70%" }}></div>
              </div>

              <div className="flex justify-between mt-4 mb-2">
                <span className="text-sm text-gray-500">Specialties</span>
                <span className="text-sm font-medium">50+</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: "85%" }}></div>
              </div>

              <div className="flex justify-between mt-4 mb-2">
                <span className="text-sm text-gray-500">Countries</span>
                <span className="text-sm font-medium">120+</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </motion.div>
          </motion.div>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Trusted by leading medical institutions</p>
            <div className="flex justify-center space-x-6 opacity-70">
              <span className="font-serif font-bold text-gray-400">Mayo Clinic</span>
              <span className="font-serif font-bold text-gray-400">Johns Hopkins</span>
              <span className="font-serif font-bold text-gray-400">Cleveland Clinic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;