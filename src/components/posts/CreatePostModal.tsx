import { useState } from 'react';
import { Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { postsAPI, uploadAPI } from '@/services/mockAPI';
import { Post } from '@/types';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: Post) => void;
}

export function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 4) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 4 images per post.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or images to your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images first (if any)
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log('📤 Uploading', selectedImages.length, 'images...');
        const uploadPromises = selectedImages.map(async (file, index) => {
          console.log(`📤 Uploading image ${index + 1}:`, file.name, file.size, 'bytes');
          const result = await uploadAPI.uploadFile(file, user.id);
          console.log(`✅ Image ${index + 1} uploaded:`, result);
          return result.fileUrl;
        });
        imageUrls = await Promise.all(uploadPromises);
        console.log('📤 All images uploaded:', imageUrls);
      }

      // Create the post
      console.log('📝 Creating post with data:', {
        userId: user.id,
        content,
        imageUrl: imageUrls[0] || undefined,
        imageUrls: imageUrls
      });
      const newPost = await postsAPI.createPost({
        userId: user.id,
        content,
        imageUrl: imageUrls[0] || undefined,
      });
      onPostCreated(newPost);
      
      // Reset form
      setContent('');
      setSelectedImages([]);
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with your network.",
      });
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setSelectedImages([]);
      onOpenChange(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profilePicture} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">Posting to your network</p>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground"
            disabled={isSubmitting}
          />

          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <label htmlFor="image-upload">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting || selectedImages.length >= 4}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Image className="h-4 w-4 mr-2" />
                    Add images
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
                disabled={isSubmitting}
              />
              {selectedImages.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length}/4 images
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}