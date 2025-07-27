import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Briefcase, 
  Settings,
  Check,
  X,
  MoreHorizontal,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'connection' | 'message' | 'mention' | 'job';
  title: string;
  description: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export default function Notifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      title: 'Post Liked',
      description: 'Sarah Chen liked your post about React hooks',
      actor: {
        id: '2',
        name: 'Sarah Chen',
        avatar: '',
      },
      timestamp: '2024-01-20T15:30:00Z',
      isRead: false,
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      description: 'David Kim commented on your post: "Great insights! Thanks for sharing."',
      actor: {
        id: '3',
        name: 'David Kim',
        avatar: '',
      },
      timestamp: '2024-01-20T14:45:00Z',
      isRead: false,
    },
    {
      id: '3',
      type: 'connection',
      title: 'Connection Request',
      description: 'Lisa Wang wants to connect with you',
      actor: {
        id: '4',
        name: 'Lisa Wang',
        avatar: '',
      },
      timestamp: '2024-01-20T12:15:00Z',
      isRead: true,
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      description: 'Mark Thompson sent you a message',
      actor: {
        id: '5',
        name: 'Mark Thompson',
        avatar: '',
      },
      timestamp: '2024-01-20T10:30:00Z',
      isRead: true,
    },
    {
      id: '5',
      type: 'mention',
      title: 'You were mentioned',
      description: 'Emily Johnson mentioned you in a post about web development',
      actor: {
        id: '6',
        name: 'Emily Johnson',
        avatar: '',
      },
      timestamp: '2024-01-19T16:20:00Z',
      isRead: true,
    },
    {
      id: '6',
      type: 'job',
      title: 'New Job Match',
      description: 'Senior Frontend Developer at TechCorp matches your profile',
      timestamp: '2024-01-19T14:10:00Z',
      isRead: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'connection':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'mention':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case 'job':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    console.log('Marking notification as read:', notificationId);
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    console.log('Marking all notifications as read');
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (notificationId: string) => {
    console.log('Deleting notification:', notificationId);
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const acceptConnection = (notificationId: string) => {
    console.log('Accepting connection request:', notificationId);
    toast({
      title: "Connection accepted",
      description: "You are now connected!",
    });
  };

  const declineConnection = (notificationId: string) => {
    console.log('Declining connection request:', notificationId);
    toast({
      title: "Connection declined",
      description: "The connection request has been declined.",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notification.isRead;
    return notification.type === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your network activity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'like').length}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'connection').length}</p>
                <p className="text-sm text-muted-foreground">Connections</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="px-6 pb-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                      Unread {unreadCount > 0 && <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="like">Likes</TabsTrigger>
                    <TabsTrigger value="comment">Comments</TabsTrigger>
                    <TabsTrigger value="connection">Connections</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={selectedTab} className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-1">
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors ${
                              !notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Avatar or Icon */}
                              {notification.actor ? (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                    {notification.actor.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{notification.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {notification.description}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                      </span>
                                      {!notification.isRead && (
                                        <Badge variant="secondary" className="text-xs">New</Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center space-x-2">
                                    {notification.type === 'connection' && !notification.isRead && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          onClick={() => acceptConnection(notification.id)}
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Accept
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => declineConnection(notification.id)}
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Decline
                                        </Button>
                                      </>
                                    )}
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        {!notification.isRead && (
                                          <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                            <Check className="mr-2 h-4 w-4" />
                                            Mark as read
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                          <Archive className="mr-2 h-4 w-4" />
                                          Archive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => deleteNotification(notification.id)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Bell className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold">No notifications</h3>
                          <p className="text-muted-foreground">
                            {selectedTab === 'unread' 
                              ? "You're all caught up! No unread notifications."
                              : "When you get notifications, they'll appear here."
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}