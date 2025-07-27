import { useAuth } from 'react-oidc-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CognitoTest() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (auth.error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error: {auth.error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authenticated with Cognito!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Email:</strong> {auth.user?.profile.email}
          </div>
          <div>
            <strong>Name:</strong> {auth.user?.profile.name}
          </div>
          <div>
            <strong>Username:</strong> {auth.user?.profile.preferred_username}
          </div>
          <Button 
            onClick={() => auth.removeUser()} 
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cognito Authentication Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => auth.signinRedirect()} 
          className="w-full"
        >
          Sign In with Cognito
        </Button>
      </CardContent>
    </Card>
  );
} 