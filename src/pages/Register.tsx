import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SecurityUtils } from '@/utils/security';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Email validation
    if (!SecurityUtils.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation using SecurityUtils
    const passwordValidation = SecurityUtils.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Username validation
    if (formData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    // Full name validation
    if (formData.fullName.length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show first error in toast
      if (formErrors.length > 0) {
        toast({
          title: "Registration failed",
          description: formErrors[0],
          variant: "destructive",
        });
      }
      return;
    }

    // Additional validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Registration failed",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.fullName,
      });

      if (success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to ProfessionalNet. Let's build your network!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: "Unable to create account. Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = SecurityUtils.validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">P</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Join ProfessionalNet</h1>
          <p className="text-muted-foreground">
            Create your account and start networking
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <Label>Password Strength</Label>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-sm ${passwordStrength.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordStrength.isValid ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      {passwordStrength.isValid ? 'Strong password' : 'Password needs improvement'}
                    </div>
                    {!passwordStrength.isValid && (
                      <ul className="text-xs text-red-600 space-y-1">
                        {passwordStrength.errors.map((error, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-background/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Test Section - Only show in development */}
            {import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">🧪 Test Accounts (Development Only)</h3>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div><strong>Email:</strong> john@example.com | <strong>Password:</strong> password</div>
                  <div><strong>Email:</strong> jane@example.com | <strong>Password:</strong> password</div>
                  <div className="mt-2 text-xs">
                    <button 
                      onClick={() => {
                        // Create demo users
                        const demoUsers = [
                          {
                            id: 'demo-user-1',
                            email: 'john@example.com',
                            username: 'john_doe',
                            fullName: 'John Doe',
                            profilePicture: '',
                            coverImage: '',
                            bio: 'Software Developer at Tech Corp',
                            location: 'San Francisco',
                            website: 'https://johndoe.dev',
                            connections: 150,
                            posts: 25,
                            createdAt: '2024-01-15T10:00:00Z',
                            hashedPassword: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
                          },
                          {
                            id: 'demo-user-2',
                            email: 'jane@example.com',
                            username: 'jane_smith',
                            fullName: 'Jane Smith',
                            profilePicture: '',
                            coverImage: '',
                            bio: 'Product Manager',
                            location: 'New York',
                            website: '',
                            connections: 89,
                            posts: 12,
                            createdAt: '2024-01-20T14:30:00Z',
                            hashedPassword: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
                          }
                        ];
                        localStorage.setItem('users', JSON.stringify(demoUsers));
                        toast({
                          title: "Demo users created",
                          description: "You can now test with john@example.com or jane@example.com (password: password)",
                        });
                      }}
                      className="text-primary hover:underline"
                    >
                      Create Demo Users
                    </button>
                    {' | '}
                    <button 
                      onClick={() => {
                        localStorage.removeItem('users');
                        localStorage.removeItem('user');
                        toast({
                          title: "Users cleared",
                          description: "All users have been removed. You'll need to register new accounts.",
                        });
                      }}
                      className="text-destructive hover:underline"
                    >
                      Clear All Users
                    </button>
                    {' | '}
                    <button 
                      onClick={() => {
                        const users = JSON.parse(localStorage.getItem('users') || '[]');
                        console.log('Current users in localStorage:', users);
                        toast({
                          title: "Debug Info",
                          description: `Found ${users.length} users in localStorage. Check console for details.`,
                        });
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Debug Users
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}