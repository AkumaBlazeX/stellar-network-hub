import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { postAPI } from '@/services/cognitoAPI';
import { Post } from '@/types';

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAuthToken } = useCognitoAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      try {
        const token = getAuthToken();
        if (!token) {
          navigate('/login');
          return;
        }

        // In a real implementation, we'd have a getPostById API
        // For now, fetch all posts and find the one we want
        const posts = await postAPI.getPosts(token);
        const foundPost = posts.find(p => p.id === id);
        
        if (foundPost) {
          setPost(foundPost);
          // Check if user has liked this post (you'd track this in your backend)
          setIsLiked(false); // Placeholder
        } else {
          toast({
            title: "Post not found",
            description: "The post you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error loading post",
          description: "Failed to load the post. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, toast, getAuthToken]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const token = getAuthToken();
      const action = isLiked ? 'unlike' : 'like';
      const result = await postAPI.likePost(post.id, action, token);
      
      setPost(prev => prev ? { ...prev, likes: result.likes } : null);
      setIsLiked(!isLiked);
      
      toast({
        title: isLiked ? "Post unliked" : "Post liked",
        description: `You ${isLiked ? 'removed your like from' : 'liked'} this post.`,
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ProfessionalNet Post',
        text: post?.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Post link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center animate-pulse">
            <span className="text-primary-foreground font-bold text-2xl">P</span>
          </div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Post Card */}
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardContent className="p-6">
            {/* Author Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>
                    {post.author.fullName?.charAt(0) || post.author.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link 
                    to={`/profile/${post.author.id}`}
                    className="font-semibold hover:underline"
                  >
                    {post.author.fullName || post.author.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4 grid gap-2 grid-cols-2">
                {post.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-64 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`transition-colors ${
                    isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
                  }`}
                >
                  <Heart 
                    className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
                  />
                  {post.likes}
                </Button>
                
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments || 0}
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}