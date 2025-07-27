import React, { useState } from 'react';
import { Camera, MapPin, Globe, Calendar, Edit2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, uploadAPI } from '@/services/mockAPI';
import { useToast } from '@/hooks/use-toast';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

export default function Profile() {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('');
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  // Update cover image when user changes
  React.useEffect(() => {
    if (user) {
      console.log('🔄 Profile useEffect - User coverImage:', (user as any).coverImage);
      setCoverImage((user as any).coverImage || '');
    }
  }, [user]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Debug: Log user object to see what we're working with
  console.log('🔍 Profile component - User object:', user);
  console.log('🔍 Profile component - User fullName:', user.fullName);
  console.log('🔍 Profile component - User bio:', user.bio);
  console.log('🔍 Profile component - User location:', user.location);

  // Mock data - will be replaced with real data from AWS
  const userExperience = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: null,
      current: true,
      description: 'Leading development of scalable web applications using React, Node.js, and AWS services.',
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: 'Built full-stack applications and improved system performance by 40%.',
    },
  ];

  const userEducation = [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false,
    },
  ];

  const userSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 
    'Docker', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Git', 'Agile'
  ];

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for cover images
        toast({
          title: "File too large",
          description: "Cover image must be less than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageUpload = async () => {
    if (!selectedCoverImage || !user) return;
    
    setIsLoading(true);
    try {
      console.log('📤 Uploading cover image...');
      const uploadResult = await uploadAPI.uploadFile(selectedCoverImage, user.id);
      const coverImageUrl = uploadResult.fileUrl;
      
      console.log('✅ Cover image uploaded:', coverImageUrl);
      console.log('📞 Calling updateProfile with coverImage:', coverImageUrl);
      
      // Update user profile with new cover image
      const success = await updateProfile({ coverImage: coverImageUrl } as any);
      
      console.log('✅ updateProfile result:', success);
      
      if (success) {
        console.log('🎉 Cover image update successful!');
        setCoverImage(coverImageUrl);
        setSelectedCoverImage(null);
        setCoverImagePreview('');
        
        // Force a small delay to ensure state updates
        setTimeout(() => {
          console.log('🔄 Forcing cover image state update...');
          setCoverImage(coverImageUrl);
        }, 100);
        
        toast({
          title: "Cover image updated",
          description: "Your cover image has been updated successfully.",
        });
      } else {
        console.error('❌ Cover image update failed - updateProfile returned false');
        toast({
          title: "Update failed",
          description: "Failed to update profile with cover image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Cover image upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoverImage = () => {
    setSelectedCoverImage(null);
    setCoverImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-gradient-card border-0 shadow-strong relative overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-primary relative">
              {(coverImage || coverImagePreview) && (
                <img
                  src={coverImagePreview || coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Cover Image Upload Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {selectedCoverImage && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCoverImageUpload}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Uploading...' : 'Save'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={removeCoverImage}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {!selectedCoverImage && (
                  <label htmlFor="cover-image-upload">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer"
                      disabled={isLoading}
                      asChild
                    >
                      <span>
                        <Camera className="h-4 w-4 mr-2" />
                        {coverImage ? 'Change cover' : 'Add cover'}
                      </span>
                    </Button>
                  </label>
                )}
                <input
                  id="cover-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageSelect}
                  disabled={isLoading}
                />
              </div>
            </div>

            <CardContent className="p-8 -mt-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-card">
                    <AvatarImage src={user.profilePicture} alt={user.fullName || 'User'} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl">
                      {(user.fullName && user.fullName.charAt(0)) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="profile-picture-upload">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 cursor-pointer"
                      asChild
                    >
                      <span>
                        <Camera className="h-4 w-4" />
                      </span>
                    </Button>
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // This will be handled by the EditProfileModal
                        // For now, just show a toast
                        toast({
                          title: "Profile picture",
                          description: "Please use the Edit Profile modal to change your profile picture.",
                        });
                      }
                    }}
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{user.fullName || 'User'}</h1>
                      <p className="text-lg text-muted-foreground">
                        Software Engineer at TechCorp Inc.
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.location}
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 pt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{user.connections}</div>
                      <div className="text-sm text-muted-foreground">Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{user.posts}</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">1.2k</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-foreground leading-relaxed">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Experience */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    Experience
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userExperience.map((exp) => (
                    <div key={exp.id} className="flex space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold">
                          {exp.company.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userEducation.map((edu) => (
                    <div key={edu.id} className="flex space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold">
                          {edu.institution.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-primary font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Skills */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="bg-muted/50 hover:bg-muted/70 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="text-sm">Profile Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profile views</span>
                    <span className="font-semibold">127 this week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Post impressions</span>
                    <span className="font-semibold">1.2k this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Search appearances</span>
                    <span className="font-semibold">89 this week</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Updated experience at TechCorp</p>
                    <p className="text-muted-foreground">2 days ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Added new skill: GraphQL</p>
                    <p className="text-muted-foreground">1 week ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Posted about React hooks</p>
                    <p className="text-muted-foreground">2 weeks ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </div>
  );
}