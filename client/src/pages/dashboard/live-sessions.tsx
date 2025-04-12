import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  User, 
  Mic, 
  MicOff, 
  VideoOff,
  MessageSquare, 
  Link as LinkIcon
} from "lucide-react";
import { format, isFuture, isPast, isToday } from "date-fns";

const LiveSessions = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [inSession, setInSession] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Fetch live sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['/api/live-sessions'],
    queryFn: async () => {
      const res = await fetch('/api/live-sessions');
      if (!res.ok) throw new Error('Failed to fetch live sessions');
      return res.json();
    }
  });
  
  // Join session
  const handleJoinSession = async (session: any) => {
    setSelectedSession(session);
    setIsJoining(true);
    
    try {
      // Fetch Zoom details from backend
      const res = await fetch(`/api/live-sessions/${session.id}`);
      if (!res.ok) throw new Error('Failed to get session details');
      
      const sessionDetails = await res.json();
      setSelectedSession({
        ...session,
        joinUrl: sessionDetails.joinUrl
      });
      
      setIsJoining(false);
    } catch (error) {
      console.error('Error joining session:', error);
      setIsJoining(false);
    }
  };
  
  // Handle joining video call
  const handleJoinVideoCall = () => {
    // In a real app, this would redirect to Zoom or open the meeting in an iframe
    // For this demo, we'll simulate a session interface
    setInSession(true);
  };
  
  // Leave session
  const handleLeaveSession = () => {
    setInSession(false);
    setSelectedSession(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };
  
  // Group sessions by status
  const getSessionsByStatus = () => {
    if (!sessions) return { upcoming: [], live: [], past: [] };
    
    const now = new Date();
    
    return {
      upcoming: sessions.filter((session: any) => {
        const sessionDate = new Date(session.sessionDate);
        // Sessions in the future that are not today
        return isFuture(sessionDate) && !isToday(sessionDate);
      }),
      live: sessions.filter((session: any) => {
        const sessionDate = new Date(session.sessionDate);
        // Sessions today
        return isToday(sessionDate);
      }),
      past: sessions.filter((session: any) => {
        const sessionDate = new Date(session.sessionDate);
        // Sessions in the past
        return isPast(sessionDate) && !isToday(sessionDate);
      })
    };
  };
  
  const { upcoming, live, past } = getSessionsByStatus();
  
  // Format session time
  const formatSessionTime = (dateString: string, duration: number) => {
    const sessionDate = new Date(dateString);
    const endTime = new Date(sessionDate.getTime() + duration * 60000);
    
    return `${format(sessionDate, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
  };
  
  // Get status badge
  const getStatusBadge = (session: any) => {
    const sessionDate = new Date(session.sessionDate);
    
    if (isToday(sessionDate)) {
      return <Badge className="bg-green-500">Live Today</Badge>;
    }
    
    if (isFuture(sessionDate)) {
      return <Badge variant="outline">Upcoming</Badge>;
    }
    
    return <Badge variant="secondary">Completed</Badge>;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Live Sessions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Join interactive sessions with our expert instructors
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Today's Live Sessions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <Video className="h-5 w-5 mr-2 text-red-500" />
              Today's Live Sessions
            </h2>
            
            {live.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No live sessions scheduled for today.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {live.map((session: any) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{session.title}</CardTitle>
                        {getStatusBadge(session)}
                      </div>
                      <CardDescription>
                        {session.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span>Instructor: {session.instructorName}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(session.sessionDate), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatSessionTime(session.sessionDate, session.duration)}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => handleJoinSession(session)}
                      >
                        Join Session
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Upcoming Sessions */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                Upcoming Sessions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((session: any) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{session.title}</CardTitle>
                        {getStatusBadge(session)}
                      </div>
                      <CardDescription>
                        {session.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span>Instructor: {session.instructorName}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(session.sessionDate), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatSessionTime(session.sessionDate, session.duration)}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          // Add to calendar logic here
                          alert("This would add the session to your calendar");
                        }}
                      >
                        Add to Calendar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Past Sessions */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                Past Sessions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.slice(0, 3).map((session: any) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow opacity-80">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{session.title}</CardTitle>
                        {getStatusBadge(session)}
                      </div>
                      <CardDescription>
                        {session.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <User className="h-4 w-4 mr-2" />
                          <span>Instructor: {session.instructorName}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(session.sessionDate), 'MMMM d, yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Session Ended
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Session Join Dialog */}
      <Dialog open={!!selectedSession && !inSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Live Session</DialogTitle>
            <DialogDescription>
              You're about to join "{selectedSession?.title}"
            </DialogDescription>
          </DialogHeader>
          
          {isJoining ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Session Details:</h4>
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Instructor: {selectedSession?.instructorName}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedSession && format(new Date(selectedSession.sessionDate), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedSession && formatSessionTime(selectedSession.sessionDate, selectedSession.duration)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Meeting ID: {selectedSession?.meetingId}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                    Please ensure your camera and microphone are working before joining.
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedSession(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleJoinVideoCall}>
                  <Video className="h-4 w-4 mr-2" />
                  Join Video Call
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Live Session Interface */}
      <Dialog open={inSession} onOpenChange={handleLeaveSession}>
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-4 bg-gray-900 text-white">
            <DialogTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-red-500" />
              Live Session: {selectedSession?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Instructor: {selectedSession?.instructorName} | 
              Meeting ID: {selectedSession?.meetingId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-full bg-gray-800">
            {/* Video Area */}
            <div className="flex-1 grid grid-cols-2 gap-2 p-2">
              {/* Instructor Video */}
              <div className="bg-gray-700 rounded-md flex items-center justify-center relative">
                {selectedSession?.instructorName === "Elevated" ? (
                  <img 
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Instructor"
                    className="w-32 h-32 rounded-full"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Instructor"
                    className="w-32 h-32 rounded-full"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {selectedSession?.instructorName} (Host)
                </div>
              </div>
              
              {/* Your Video */}
              <div className="bg-gray-700 rounded-md flex items-center justify-center relative">
                {isVideoOff ? (
                  <User className="h-32 w-32 text-gray-400" />
                ) : (
                  <img 
                    src={user?.avatarUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt="You"
                    className="w-32 h-32 rounded-full"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {user?.username} {isMuted && <MicOff className="h-3 w-3 inline ml-1" />}
                </div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="h-32 bg-gray-900 p-2 overflow-y-auto">
              <div className="text-gray-300 text-sm mb-2">
                <span className="text-indigo-400 font-medium">Elevated:</span> Welcome to the session! We'll be discussing React Hooks today.
              </div>
              <div className="text-gray-300 text-sm mb-2">
                <span className="text-indigo-400 font-medium">Madhavan:</span> Looking forward to learning about useEffect!
              </div>
              <div className="text-gray-300 text-sm">
                <span className="text-indigo-400 font-medium">Elevated:</span> Great! We'll cover that in detail. Let's start with useState first.
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-center p-4 bg-gray-900 border-t border-gray-700">
              <Button 
                variant={isMuted ? "default" : "outline"} 
                size="sm" 
                className="mr-2"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              
              <Button 
                variant={isVideoOff ? "default" : "outline"} 
                size="sm" 
                className="mr-2"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <Video className="h-4 w-4 mr-1" /> : <VideoOff className="h-4 w-4 mr-1" />}
                {isVideoOff ? "Start Video" : "Stop Video"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLeaveSession}
              >
                Leave Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveSessions;
