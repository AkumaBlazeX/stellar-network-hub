                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useCognitoAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      login();
      toast({
        title: "Redirecting to sign in",
        description: "You'll be redirected to AWS Cognito for secure authentication.",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your ProfessionalNet account
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In with AWS Cognito</CardTitle>
            <CardDescription>
              Secure authentication powered by AWS Cognito
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleSignIn}
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Redirecting...' : 'Sign In with AWS Cognito'}
              </Button>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Secure Authentication</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm">
                <p className="text-center text-muted-foreground">
                  You'll be redirected to AWS Cognito's secure hosted UI for authentication
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="text-center text-sm">
          <Link 
            to="/forgot-password" 
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}