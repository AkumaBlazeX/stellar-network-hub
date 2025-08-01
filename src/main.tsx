import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from 'react-oidc-context'

// AWS Cognito Configuration
const cognitoAuthConfig = {
  authority: `https://cognito-idp.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${import.meta.env.VITE_COGNITO_USER_POOL_ID}`,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: `${window.location.origin}/login`,
  response_type: "code",
  scope: "email openid phone profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

console.log('🔧 Cognito Config:', {
  authority: cognitoAuthConfig.authority,
  client_id: cognitoAuthConfig.client_id,
  redirect_uri: cognitoAuthConfig.redirect_uri
});

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
