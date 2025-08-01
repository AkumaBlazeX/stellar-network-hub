import { Header } from './Header';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useCognitoAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}