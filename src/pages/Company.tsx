import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Globe, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  founded: string;
  specialties: string[];
  employees: number;
  isFollowing?: boolean;
}

export default function Company() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        navigate('/search');
        return;
      }

      try {
        // Mock company data - in real implementation, fetch from API
        const mockCompany: Company = {
          id: id,
          name: 'TechCorp Inc.',
          logo: '',
          industry: 'Technology',
          size: 'Large (500+ employees)',
          location: 'San Francisco, CA',
          website: 'https://techcorp.com',
          description: 'TechCorp is a leading software development company specializing in cloud solutions, AI, and machine learning. We help businesses transform digitally with cutting-edge technology and innovative solutions.',
          founded: '2010',
          specialties: ['Cloud Computing', 'AI/ML', 'Software Development', 'Data Analytics', 'DevOps'],
          employees: 750,
          isFollowing: false
        };
        
        setCompany(mockCompany);
        setIsFollowing(mockCompany.isFollowing || false);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          title: "Error loading company",
          description: "Failed to load company information. Please try again.",
          variant: "destructive",
        });
        navigate('/search');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate, toast]);

  const handleFollow = async () => {
    try {
      // In real implementation, make API call to follow/unfollow company
      setIsFollowing(!isFollowing);
      
      toast({
        title: isFollowing ? "Unfollowed company" : "Following company",
        description: `You are ${isFollowing ? 'no longer' : 'now'} following ${company?.name}.`,
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center animate-pulse">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading company...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Company not found</h1>
          <p className="text-muted-foreground">The company you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Company Header */}
        <Card className="bg-gradient-card border-0 shadow-strong mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={company.logo} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                    {company.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                  <p className="text-lg text-muted-foreground mb-3">{company.industry}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {company.employees.toLocaleString()} employees
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                    {company.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {company.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                size="lg"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* About */}
          <div className="md:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {company.description}
                </p>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <span className="font-medium">Founded:</span>
                    <span className="ml-2 text-muted-foreground">{company.founded}</span>
                  </div>
                  <div>
                    <span className="font-medium">Company size:</span>
                    <span className="ml-2 text-muted-foreground">{company.size}</span>
                  </div>
                  <div>
                    <span className="font-medium">Industry:</span>
                    <span className="ml-2 text-muted-foreground">{company.industry}</span>
                  </div>
                  <div>
                    <span className="font-medium">Headquarters:</span>
                    <span className="ml-2 text-muted-foreground">{company.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="font-medium">{company.employees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">{company.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="font-medium">12.5K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Companies */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Similar Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['InnovateTech', 'CloudSolutions Inc.', 'DataMind Corp.'].map((name) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                            {name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}