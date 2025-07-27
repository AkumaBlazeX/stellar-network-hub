import { useState } from 'react';
import { Camera, MapPin, Globe, Calendar, Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/services/mockAPI';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

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

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-gradient-card border-0 shadow-strong relative overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-primary relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
              >
                <Camera className="h-4 w-4 mr-2" />
                Edit cover
              </Button>
            </div>

            <CardContent className="p-8 -mt-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-card">
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{user.fullName}</h1>
                      <p className="text-lg text-muted-foreground">
                        Software Engineer at TechCorp Inc.
                      </p>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
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
    </div>
  );
}