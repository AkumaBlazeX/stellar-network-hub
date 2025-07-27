import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_vWjIhz1gR",
  client_id: "6q3onhllplcsej1nftvei118re",
  redirect_uri: "http://localhost:8080",
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
