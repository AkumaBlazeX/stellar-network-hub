import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { useCognitoAuth } from '@/contexts/CognitoAuthContext';
import { toast } from '@/hooks/use-toast';

interface PeopleYouMayKnowProps {
  className?: string;
}

export function PeopleYouMayKnow({ className }: PeopleYouMayKnowProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const { user } = useCognitoAuth();

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Mock users for now - replace with real API
      const fetchedUsers = [];
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('❌ Error loading users:', error);
      toast({
        title: "Error loading suggestions",
        description: "Could not load people you may know.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;

    try {
      // Mock connection for now
      const success = true;
      
      if (success) {
        setFollowing(prev => new Set(prev).add(userId));
        toast({
          title: "Connection made!",
          description: "You are now connected with this person.",
        });
        
        // Update the user's connection count locally
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, connections: (u.connections || 0) + 1 }
            : u
        ));
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect with this person. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error following user:', error);
      toast({
        title: "Connection failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user) return;

    try {
      // Mock disconnection for now
      const success = true;
      
      if (success) {
        setFollowing(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        toast({
          title: "Connection removed",
          description: "You are no longer connected with this person.",
        });
        
        // Update the user's connection count locally
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, connections: Math.max(0, (u.connections || 0) - 1) }
            : u
        ));
      } else {
        toast({
          title: "Unfollow failed",
          description: "Could not remove connection. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error unfollowing user:', error);
      toast({
        title: "Unfollow failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>People You May Know</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>People You May Know</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No suggestions available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>People You May Know</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => {
            const isFollowing = following.has(user.id);
            
            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium text-sm">{user.fullName}</h4>
                  </div>
                </div>
                
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                  className="shrink-0"
                >
                  {isFollowing ? "Unfollow" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 