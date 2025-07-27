import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "@/contexts/AuthContext";
// import { errorHandler } from './utils/errorHandler';
// import { performanceMonitor } from './utils/performance';
// import { CSRFProtection } from './utils/security';

// Initialize production features
if (import.meta.env.PROD) {
  // Generate CSRF token
  // CSRFProtection.generateToken();
  
  // Log app startup
  console.log(`🚀 ProfessionalNet v${import.meta.env.VITE_APP_VERSION || '1.0.0'} starting...`);
  
  // Record initial performance metrics
  // performanceMonitor.recordMetric('app_startup_time', performance.now());
}

// const cognitoAuthConfig = {
//   authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_vWjIhz1gR",
//   client_id: "6q3onhllplcsej1nftvei118re",
//   redirect_uri: window.location.origin,
//   response_type: "code",
//   scope: "email openid phone",
// };

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
