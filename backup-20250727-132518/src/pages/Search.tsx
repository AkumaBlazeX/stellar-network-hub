import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Users, FileText, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'company';
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  metadata?: Record<string, any>;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts' | 'companies'>('all');

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, activeTab]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Simulate search results based on query
      const mockResults: SearchResult[] = [];
      
      // Add user results
      if (activeTab === 'all' || activeTab === 'people') {
        mockResults.push(
          {
            id: '1',
            type: 'user',
            title: 'Sarah Chen',
            subtitle: 'Product Designer',
            description: 'Experienced product designer with 5+ years in UX/UI design',
            image: '',
            metadata: { connections: 150, location: 'San Francisco, CA' }
          },
          {
            id: '2',
            type: 'user',
            title: 'Alex Rivera',
            subtitle: 'Software Engineer',
            description: 'Full-stack developer specializing in React and Node.js',
            image: '',
            metadata: { connections: 89, location: 'New York, NY' }
          },
          {
            id: '3',
            type: 'user',
            title: 'Emily Johnson',
            subtitle: 'Marketing Manager',
            description: 'Digital marketing expert with focus on growth strategies',
            image: '',
            metadata: { connections: 234, location: 'Austin, TX' }
          }
        );
      }

      // Add post results
      if (activeTab === 'all' || activeTab === 'posts') {
        mockResults.push(
          {
            id: '4',
            type: 'post',
            title: 'Just deployed my first AWS application! 🚀',
            subtitle: 'Posted by John Doe',
            description: 'Excited to share my journey learning AWS Lambda and API Gateway...',
            metadata: { likes: 42, comments: 8, time: '2 hours ago' }
          },
          {
            id: '5',
            type: 'post',
            title: 'Learning about serverless architecture',
            subtitle: 'Posted by Jane Smith',
            description: 'The possibilities with AWS Lambda are endless! 💡',
            metadata: { likes: 89, comments: 15, time: '5 hours ago' }
          }
        );
      }

      // Add company results
      if (activeTab === 'all' || activeTab === 'companies') {
        mockResults.push(
          {
            id: '6',
            type: 'company',
            title: 'TechCorp Inc.',
            subtitle: 'Technology Company',
            description: 'Leading software development company specializing in cloud solutions',
            image: '',
            metadata: { employees: '500+', location: 'San Francisco, CA' }
          },
          {
            id: '7',
            type: 'company',
            title: 'StartupXYZ',
            subtitle: 'Startup',
            description: 'Innovative startup focused on AI and machine learning',
            image: '',
            metadata: { employees: '50+', location: 'Austin, TX' }
          }
        );
      }

      // Filter results based on search query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (userId: string) => {
    toast({
      title: "Connection request sent",
      description: "Your connection request has been sent successfully.",
    });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'post':
        return <FileText className="h-4 w-4" />;
      case 'company':
        return <Building2 className="h-4 w-4" />;
      default:
        return <SearchIcon className="h-4 w-4" />;
    }
  };

  const getResultBadge = (type: string) => {
    switch (type) {
      case 'user':
        return <Badge variant="secondary">Person</Badge>;
      case 'post':
        return <Badge variant="outline">Post</Badge>;
      case 'company':
        return <Badge variant="default">Company</Badge>;
      default:
        return null;
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Search ProfessionalNet</h2>
          <p className="text-muted-foreground">Enter a search term to find people, posts, and companies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Search results for "{query}"
          </h1>
          <p className="text-muted-foreground">
            Found {results.length} results
          </p>
        </div>

        {/* Search Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'all', label: 'All', icon: SearchIcon },
            { key: 'people', label: 'People', icon: Users },
            { key: 'posts', label: 'Posts', icon: FileText },
            { key: 'companies', label: 'Companies', icon: Building2 },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardContent className="p-8 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse different categories
                  </p>
                </CardContent>
              </Card>
            ) : (
              results.map((result) => (
                <Card key={result.id} className="bg-gradient-card border-0 shadow-medium">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Result Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {result.type === 'user' ? (
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={result.image} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {result.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            {getResultIcon(result.type)}
                          </div>
                        )}
                      </div>

                      {/* Result Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg">{result.title}</h3>
                              {getResultBadge(result.type)}
                            </div>
                            <p className="text-muted-foreground mb-2">{result.subtitle}</p>
                            <p className="text-sm text-muted-foreground mb-3">
                              {result.description}
                            </p>
                            
                            {/* Metadata */}
                            {result.metadata && (
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {result.type === 'user' && (
                                  <>
                                    <span>{result.metadata.connections} connections</span>
                                    <span>{result.metadata.location}</span>
                                  </>
                                )}
                                {result.type === 'post' && (
                                  <>
                                    <span>{result.metadata.likes} likes</span>
                                    <span>{result.metadata.comments} comments</span>
                                    <span>{result.metadata.time}</span>
                                  </>
                                )}
                                {result.type === 'company' && (
                                  <>
                                    <span>{result.metadata.employees} employees</span>
                                    <span>{result.metadata.location}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex-shrink-0 ml-4">
                            {result.type === 'user' && (
                              <Button
                                size="sm"
                                onClick={() => handleConnect(result.id)}
                                className="bg-gradient-primary hover:bg-gradient-primary/90"
                              >
                                Connect
                              </Button>
                            )}
                            {result.type === 'post' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/post/${result.id}`}>View Post</Link>
                              </Button>
                            )}
                            {result.type === 'company' && (
                              <Button variant="outline" size="sm">
                                View Company
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 