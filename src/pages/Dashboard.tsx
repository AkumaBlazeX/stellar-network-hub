import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { postAPI } from '@/services/cognitoAPI';
import { Post } from '@/types';
import { PostCard } from '@/components/posts/PostCard';
import { CreatePostModal } from '@/components/posts/CreatePostModal';
import { PeopleYouMayKnow } from '@/components/PeopleYouMayKnow';

export default function Dashboard() {
  const { user, updateProfile, getAuthToken } = useCognitoAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await postAPI.getPosts(getAuthToken());
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('❌ Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = async (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
    
    // Update user's post count
    if (user) {
      try {
        await updateProfile({ posts: user.posts + 1 });
      } catch (error) {
        console.error('❌ Error updating post count:', error);
      }
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = async (deletedPostId: string) => {
    setPosts(prev => prev.filter(post => post.id !== deletedPostId));
    
    // Decrement user's post count
    if (user) {
      try {
        await updateProfile({ posts: Math.max(0, user.posts - 1) });
        console.log('✅ Post count decremented successfully');
      } catch (error) {
        console.error('❌ Error decrementing post count:', error);
      }
    }
  };

  if (!user) {
    console.log('❌ No user found on Dashboard');
    return null;
  }
  
  console.log('👤 User on Dashboard:', user);

  // Show loading state while posts are being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.fullName || 'Profile'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className="text-primary-foreground font-bold text-2xl">
                      {(user.fullName && user.fullName.charAt(0)) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    <p className="text-muted-foreground text-sm">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm mt-2 text-muted-foreground">{user.bio}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="font-semibold text-primary">{user.connections}</div>
                      <div className="text-xs text-muted-foreground">Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-primary">{user.posts}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profile views</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Post impressions</span>
                  <span className="font-medium">1.2k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Search appearances</span>
                  <span className="font-medium">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Create Post Button */}
                  <Button 
                    onClick={() => setShowCreatePost(true)}
                    className="w-full bg-gradient-primary text-primary-foreground hover:bg-gradient-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                  
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-gradient-card border-0 shadow-medium">
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-muted rounded w-1/4"></div>
                              <div className="h-3 bg-muted rounded w-1/6"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Suggestions & Trending */}
          <div className="lg:col-span-1 space-y-6">
            {/* People You May Know */}
            <PeopleYouMayKnow className="bg-gradient-card border-0 shadow-medium" />

            {/* Trending Topics */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending in your network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { topic: 'Remote Work', posts: '2,341 posts' },
                  { topic: 'AI & Machine Learning', posts: '1,892 posts' },
                  { topic: 'Startup Funding', posts: '1,456 posts' },
                  { topic: 'Product Management', posts: '1,234 posts' },
                  { topic: 'Web Development', posts: '1,087 posts' },
                ].map((trend, index) => (
                  <div key={index} className="cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors">
                    <p className="font-medium text-sm">#{trend.topic}</p>
                    <p className="text-xs text-muted-foreground">{trend.posts}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'David Kim', message: 'Thanks for connecting!', time: '2h ago' },
                  { name: 'Lisa Wang', message: 'Would love to discuss the project', time: '4h ago' },
                  { name: 'Mark Thompson', message: 'Great post about React hooks!', time: '1d ago' },
                ].map((message, index) => (
                  <div key={index} className="flex items-start space-x-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-xs">
                        {message.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{message.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}