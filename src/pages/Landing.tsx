import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              ProfessionalNet
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Join Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Connect
                </span>{' '}
                with professionals
                <br />
                worldwide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Build meaningful professional relationships, share your expertise, and 
                discover opportunities that advance your career. Join millions of 
                professionals already networking on ProfessionalNet.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2M+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">150k+</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Jobs Posted</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-card rounded-3xl shadow-strong p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">Your Network Awaits</h3>
                  <p className="text-muted-foreground">
                    Connect with like-minded professionals and grow your career.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Why Choose ProfessionalNet?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build meaningful professional connections and advance your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Smart Networking</h3>
              <p className="text-muted-foreground">
                AI-powered suggestions help you connect with the right professionals 
                based on your interests and career goals.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Stay informed with instant notifications about your network, 
                job opportunities, and industry insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data is secure with enterprise-grade encryption and 
                granular privacy controls you can trust.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Global Reach</h3>
              <p className="text-muted-foreground">
                Connect with professionals from 190+ countries and expand 
                your network beyond geographical boundaries.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Career Growth</h3>
              <p className="text-muted-foreground">
                Access exclusive job opportunities, skill assessments, and 
                career development resources tailored to your goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-card rounded-3xl shadow-strong p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">Ready to Advance Your Career?</h2>
            <p className="text-xl text-muted-foreground">
              Join millions of professionals who are already building meaningful 
              connections and discovering new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/register">
                  Start Networking Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link to="/login">Sign In to Your Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-gradient-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">
                ProfessionalNet
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting professionals worldwide to build meaningful careers and relationships.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#enterprise" className="hover:text-foreground transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#security" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ProfessionalNet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}