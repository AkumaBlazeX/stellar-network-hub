import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useCognitoAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = () => {
    setIsLoading(true);
    try {
      register();
      toast({
        title: "Redirecting to sign up",
        description: "You'll be redirected to AWS Cognito for secure registration.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
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
          <h1 className="text-2xl font-bold">Join ProfessionalNet</h1>
          <p className="text-muted-foreground">
            Create your account and start networking
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create Account with AWS Cognito</CardTitle>
            <CardDescription>
              Secure registration powered by AWS Cognito
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleSignUp}
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Redirecting...' : 'Sign Up with AWS Cognito'}
              </Button>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Secure Registration</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm">
                <p className="text-center text-muted-foreground">
                  You'll be redirected to AWS Cognito's secure hosted UI for registration
                </p>
              </div>
            </div>

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