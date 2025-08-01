import React, { useState } from 'react';
import { Loader2, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadAPI } from '@/services/cognitoAPI';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { user, updateProfile } = useCognitoAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    website: '',
  });
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  // Update form data when user changes or modal opens
  React.useEffect(() => {
    if (user && open) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
      setProfileImagePreview(user.profilePicture || '');
      setSelectedProfileImage(null);
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Profile image must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const removeProfileImage = () => {
    setSelectedProfileImage(null);
    setProfileImagePreview('');
  };

  const handleSubmit = async () => {
    console.log('🔄 Starting profile update with data:', formData);
    setIsSubmitting(true);
    try {
      let profilePictureUrl = user?.profilePicture || '';
      
      // Upload profile image if selected
      if (selectedProfileImage) {
        console.log('📤 Uploading profile image...');
        try {
          const uploadResult = await uploadAPI.uploadFile(selectedProfileImage, user.id);
          profilePictureUrl = uploadResult.fileUrl;
          console.log('✅ Profile image uploaded:', profilePictureUrl);
        } catch (uploadError) {
          console.error('❌ Profile image upload failed:', uploadError);
          toast({
            title: "Image upload failed",
            description: "Failed to upload profile image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Update profile with all data including image
      const updateData = {
        ...formData,
        profilePicture: profilePictureUrl,
      };
      
      console.log('📞 Calling updateProfile function with:', updateData);
      const success = await updateProfile(updateData);
      console.log('✅ updateProfile result:', success);
      
      if (success) {
        console.log('🎉 Profile update successful!');
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        onOpenChange(false);
      } else {
        console.error('❌ Profile update returned false');
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      toast({
        title: "Error updating profile",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form data to user data
      setFormData({
        fullName: user?.fullName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
      });
      onOpenChange(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={profileImagePreview || user?.profilePicture} 
                  alt={user?.fullName || 'Profile'} 
                />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {(user?.fullName && user.fullName.charAt(0)) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex space-x-2">
                <label htmlFor="profile-image-upload">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    disabled={isSubmitting}
                    asChild
                  >
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageSelect}
                  disabled={isSubmitting}
                />
                {profileImagePreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeProfileImage}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-24 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Where are you based?"
              disabled={isSubmitting}
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}