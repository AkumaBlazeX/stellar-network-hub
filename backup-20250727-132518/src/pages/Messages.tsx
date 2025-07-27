import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  Info,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { connectionsAPI } from '@/services/mockAPI';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: {
    content: string;
    sender: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      participant: {
        id: '2',
        name: 'Sarah Chen',
        avatar: '',
        isOnline: true,
      },
      lastMessage: {
        content: 'Thanks for connecting! Would love to discuss the project further.',
        sender: '2',
        timestamp: '2024-01-20T15:30:00Z',
        isRead: false,
      },
      unreadCount: 2,
    },
    {
      id: '2',
      participant: {
        id: '3',
        name: 'David Kim',
        avatar: '',
        isOnline: false,
        lastSeen: '2024-01-20T12:00:00Z',
      },
      lastMessage: {
        content: 'Great article about React patterns!',
        sender: '1',
        timestamp: '2024-01-20T10:15:00Z',
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: '3',
      participant: {
        id: '4',
        name: 'Lisa Wang',
        avatar: '',
        isOnline: true,
      },
      lastMessage: {
        content: 'Looking forward to our meeting tomorrow.',
        sender: '4',
        timestamp: '2024-01-19T16:45:00Z',
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: '4',
      participant: {
        id: '5',
        name: 'Mark Thompson',
        avatar: '',
        isOnline: false,
        lastSeen: '2024-01-19T09:30:00Z',
      },
      lastMessage: {
        content: 'Thanks for the feedback on the design!',
        sender: '1',
        timestamp: '2024-01-19T14:20:00Z',
        isRead: true,
      },
      unreadCount: 0,
    },
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      senderId: '2',
      content: 'Hi! Thanks for connecting. I saw your profile and I\'m really impressed with your work on scalable applications.',
      timestamp: '2024-01-20T14:30:00Z',
      type: 'text',
    },
    {
      id: '2',
      senderId: '1',
      content: 'Thank you! I appreciate that. I checked out your profile too - your product management experience is really impressive.',
      timestamp: '2024-01-20T14:35:00Z',
      type: 'text',
    },
    {
      id: '3',
      senderId: '2',
      content: 'Thanks for connecting! Would love to discuss the project further.',
      timestamp: '2024-01-20T15:30:00Z',
      type: 'text',
    },
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message via API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Conversations Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-0 shadow-medium h-full">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 border-b">
                    <h1 className="text-xl font-semibold mb-4">Messages</h1>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/50 border-0"
                      />
                    </div>
                  </div>

                  {/* Conversations List */}
                  <ScrollArea className="h-[calc(100%-8rem)]">
                    <div className="space-y-1 p-2">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedConversation === conversation.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                  {conversation.participant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.participant.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-sm truncate">
                                  {conversation.participant.name}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage.sender === user.id ? 'You: ' : ''}
                                  {conversation.lastMessage.content}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                    {conversation.unreadCount}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-0 shadow-medium h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  {selectedConv ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={selectedConv.participant.avatar} alt={selectedConv.participant.name} />
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                {selectedConv.participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {selectedConv.participant.isOnline && (
                              <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                            )}
                          </div>
                          <div>
                            <h2 className="font-semibold">{selectedConv.participant.name}</h2>
                            <p className="text-sm text-muted-foreground">
                              {selectedConv.participant.isOnline ? (
                                'Online'
                              ) : selectedConv.participant.lastSeen ? (
                                `Last seen ${formatDistanceToNow(new Date(selectedConv.participant.lastSeen), { addSuffix: true })}`
                              ) : (
                                'Offline'
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md ${
                                message.senderId === user.id ? 'order-2' : 'order-1'
                              }`}>
                                <div className={`p-3 rounded-lg ${
                                  message.senderId === user.id 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 px-1">
                                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                              
                              {message.senderId !== user.id && (
                                <div className="order-0 mr-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedConv.participant.avatar} alt={selectedConv.participant.name} />
                                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                      {selectedConv.participant.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 relative">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="pr-10"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute right-1 top-1/2 transform -translate-y-1/2"
                            >
                              <Smile className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            size="sm"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Select a conversation</h3>
                          <p className="text-muted-foreground">
                            Choose a conversation from the sidebar to start messaging
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}