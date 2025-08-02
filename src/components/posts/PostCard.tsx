import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageSquare, 
  Share, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  BookmarkPlus,
  Flag,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { useToast } from '@/hooks/use-toast';
import { postAPI } from '@/services/cognitoAPI';
import { Post } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface PostCardProps {
  post: Post;
  onUpdate: (updatedPost: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { user, getAuthToken } = useCognitoAuth();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwnPost = user?.id === post.authorId;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const result = await postAPI.likePost(post.id, 'like', getAuthToken());
      const updatedPost = {
        ...post,
        isLiked: !post.isLiked,
        likes: result.likes,
      };
      onUpdate(updatedPost);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    // Add confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    
    setIsDeleting(true);
    try {
      console.log('🗑️ Attempting to delete post:', post.id);
      await postAPI.deletePost(post.id, getAuthToken());
      onDelete(post.id);
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share functionality",
      description: "Share dialog would open here in a real application.",
    });
  };

  const handleComment = () => {
    // In a real app, this would focus the comment input or open comments
    toast({
      title: "Comments",
      description: "Comment functionality would be available here.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast({
        title: "Empty content",
        description: "Post content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const updatedPost = await postAPI.updatePost(post.id, editContent.trim(), getAuthToken());
      onUpdate(updatedPost);
      setIsEditing(false);
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating post",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.profilePicture} alt={post.author.fullName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {post.author.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">{post.author.fullName}</h3>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              {post.author.headline && (
                <p className="text-sm text-muted-foreground">{post.author.headline}</p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost ? (
                <>
                  <DropdownMenuItem onClick={handleEdit} disabled={isEditing}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit post
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete post'}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Flag className="mr-2 h-4 w-4" />
                    Report post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-24 resize-none"
                disabled={isUpdating}
              />
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editContent.trim()}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 grid gap-2 rounded-lg overflow-hidden">
            {post.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-auto max-h-96 object-cover rounded-lg"
                  onError={(e) => {
                    // Show fallback instead of hiding
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">📷</div>
                    <div className="text-sm">Image not available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3 pt-3 border-t">
          <div className="flex items-center space-x-4">
            {post.likes > 0 && (
              <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
            )}
            {post.comments > 0 && (
              <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
            )}
            {post.shares > 0 && (
              <span>{post.shares} {post.shares === 1 ? 'share' : 'shares'}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 hover:bg-muted/50 ${
              post.isLiked ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="flex items-center space-x-2 text-muted-foreground hover:bg-muted/50"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2 text-muted-foreground hover:bg-muted/50"
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}