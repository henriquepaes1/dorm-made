import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Utensils, Users, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"foodie" | "chef" | "both">("both");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    university: ''
  });
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const cuisinePreferences = [
    "Italian", "Thai", "Mexican", "Korean", "Japanese", "Indian", 
    "Chinese", "Mediterranean", "American", "Vietnamese", "Lebanese", "Ethiopian"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.university) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        university: formData.university
      };

      const user = await createUser(userData);
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast({
        title: "Success!",
        description: "Account created successfully. Welcome to Dorm Made!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a message since we don't have login endpoint
    toast({
      title: "Login",
      description: "Login functionality will be added soon. Please sign up for now.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Join Dorm Made</h1>
            <p className="text-muted-foreground">
              Connect with fellow students through authentic food experiences
            </p>
          </div>

          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Log In</TabsTrigger>
            </TabsList>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up with your university email to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSignUp}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe" 
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">University Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@university.edu"
                        className="bg-background" 
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use your .edu email address to verify your student status
                      </p>
                    </div>

                    {/* University */}
                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input 
                        id="university" 
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="University of Example" 
                        required
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a strong password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* User Type Selection */}
                    <div>
                      <Label className="text-base">I want to...</Label>
                      <div className="grid grid-cols-1 gap-3 mt-3">
                        <div 
                          className={`cursor-pointer border-2 rounded-lg p-3 transition-colors ${
                            userType === "foodie" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                          onClick={() => setUserType("foodie")}
                        >
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">Find & Join Meals</h4>
                              <p className="text-xs text-muted-foreground">I'm a Foodie</p>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className={`cursor-pointer border-2 rounded-lg p-3 transition-colors ${
                            userType === "chef" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                          onClick={() => setUserType("chef")}
                        >
                          <div className="flex items-center space-x-3">
                            <Utensils className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">Host & Cook Meals</h4>
                              <p className="text-xs text-muted-foreground">I'm a Chef</p>
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`cursor-pointer border-2 rounded-lg p-3 transition-colors ${
                            userType === "both" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                          onClick={() => setUserType("both")}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <Users className="h-4 w-4 text-primary" />
                              <Utensils className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">Both!</h4>
                              <p className="text-xs text-muted-foreground">I want to cook and explore</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cuisine Preferences */}
                    <div>
                      <Label className="text-base">Food Preferences (Tastebuds)</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Select cuisines you enjoy to get personalized recommendations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cuisinePreferences.map((cuisine) => (
                          <Badge 
                            key={cuisine} 
                            variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/10 transition-colors"
                            onClick={() => handleCuisineToggle(cuisine)}
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your Dorm Made account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin}>
                    <div>
                      <Label htmlFor="loginEmail">Email</Label>
                      <Input 
                        id="loginEmail" 
                        type="email" 
                        placeholder="your.email@university.edu" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="loginPassword">Password</Label>
                      <div className="relative">
                        <Input 
                          id="loginPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow"
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}