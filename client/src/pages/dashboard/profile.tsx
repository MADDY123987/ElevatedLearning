import { useState, useEffect } from "react";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Award, 
  Clock, 
  BookOpen, 
  RefreshCw,
  Upload,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { user, triggerXP } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Fetch user badges
  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ['/api/user-badges', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user-badges?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch user badges');
      return res.json();
    },
    enabled: !!user
  });
  
  // Fetch user enrollments
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['/api/enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/enrollments?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });
  
  // Fetch user quiz submissions
  const { data: quizSubmissions, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/quiz-submissions', user?.id],
    queryFn: async () => {
      // Note: This endpoint is not implemented in the backend yet
      // In real app, we would fetch quiz submissions from this endpoint
      // For now, we'll return an empty array to avoid errors
      return [];
    },
    enabled: !!user
  });
  
  // Calculate user level based on XP
  const calculateLevel = (xp: number) => {
    // Simple formula: level = 1 + XP / 100 (rounded down)
    return Math.floor(1 + xp / 100);
  };
  
  // Calculate XP needed for next level
  const xpForNextLevel = (level: number) => {
    return level * 100;
  };
  
  // Calculate progress percentage to next level
  const calculateLevelProgress = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    const nextLevelXP = xpForNextLevel(currentLevel);
    const prevLevelXP = nextLevelXP - 100;
    
    // Calculate percentage of progress to next level
    return Math.floor(((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100);
  };
  
  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle avatar upload (simulated)
  const handleAvatarUpload = () => {
    if (!avatarFile) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // User level info
  const level = user ? calculateLevel(user.xp) : 1;
  const levelProgress = user ? calculateLevelProgress(user.xp) : 0;
  const xpToNextLevel = user ? xpForNextLevel(level) - user.xp : 100;
  
  // Calculate user stats
  const completedCourses = enrollments?.filter((e: any) => e.completed).length || 0;
  const inProgressCourses = enrollments?.filter((e: any) => !e.completed).length || 0;
  
  // Random joined date for demo
  const joinedDate = user ? new Date(user.createdAt) : new Date();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your account information and learning progress
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="relative pb-0">
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="font-normal">
                Level {level}
              </Badge>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                {user?.avatarUrl || avatarPreview ? (
                  <img 
                    src={avatarPreview || user?.avatarUrl} 
                    alt={user?.username} 
                    className="w-24 h-24 rounded-full border-2 border-indigo-200 dark:border-indigo-900"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-900">
                    <User className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                  <Upload className="h-4 w-4" />
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              
              <CardTitle className="text-center">{user?.username}</CardTitle>
              <CardDescription className="text-center">{user?.email || "No email provided"}</CardDescription>
              
              {/* XP Progress */}
              <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {user?.xp} XP
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {xpToNextLevel} XP to Level {level + 1}
                  </span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            {avatarFile && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleAvatarUpload}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Uploaded!
                    </>
                  ) : (
                    "Upload Avatar"
                  )}
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <Label className="text-sm text-gray-500 dark:text-gray-400">Username</Label>
              </div>
              <Input value={user?.username || ""} readOnly />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <Label className="text-sm text-gray-500 dark:text-gray-400">Email</Label>
              </div>
              <Input value={user?.email || ""} readOnly />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <Label className="text-sm text-gray-500 dark:text-gray-400">Member Since</Label>
              </div>
              <Input value={format(joinedDate, 'MMMM d, yyyy')} readOnly />
            </div>
          </CardContent>
        </Card>
        
        {/* Stats and Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
            <CardDescription>
              Your progress at a glance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                  {user?.xp || 0}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Total XP
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-green-600 dark:text-green-400 text-2xl font-bold">
                  {badges?.length || 0}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Badges Earned
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                  {completedCourses}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Courses Completed
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-amber-600 dark:text-amber-400 text-2xl font-bold">
                  {inProgressCourses}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Courses In Progress
                </div>
              </div>
            </div>
            
            {/* Learning Streak */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Current Streak
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-xs">
                  Keep learning to maintain your streak!
                </div>
              </div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                3 Days
              </div>
            </div>
            
            {/* Time Spent */}
            <div>
              <h3 className="text-sm font-medium mb-2">Time Spent Learning</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    This Week
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    4h 35m
                  </div>
                </div>
                <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  65% of your 7h weekly goal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Badges and Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
            <CardDescription>
              Showcase your learning milestones
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoadingBadges ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : !badges || badges.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No badges yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Complete courses and quizzes to earn badges
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((badge: any) => (
                  <div 
                    key={badge.id} 
                    className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ '--badge-color': 'rgba(99, 102, 241, 0.4)' } as any}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-2 badge-glow rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <img 
                        src={badge.badge.iconUrl} 
                        alt={badge.badge.name}
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="text-sm font-medium">
                      {badge.badge.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.badge.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-6">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => triggerXP(10)} // Demo only
            >
              View All Achievements
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Course Progress */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Learning History
        </h2>
        
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <Award className="h-4 w-4 mr-2" />
              Quizzes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            {isLoadingEnrollments ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : !enrollments || enrollments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No enrolled courses
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Explore and enroll in courses to start your learning journey
                  </p>
                  <Button onClick={() => window.location.href = "/dashboard/explore"}>
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment: any) => (
                  <Card key={enrollment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {enrollment.course.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enrolled on: {format(new Date(enrollment.enrolledAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-1/3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              Progress
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                          {enrollment.completed ? (
                            <span className="inline-flex items-center mt-2 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              {enrollment.currentLesson} of {enrollment.course.lessonsCount} lessons
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Quiz history coming soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  We're working on adding detailed quiz history to your profile
                </p>
                <Button onClick={() => window.location.href = "/dashboard/quizzes"}>
                  Try a Quiz
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
