import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import CourseCard, { CourseType } from "@/components/common/course-card";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Activity, 
  Clock, 
  Award,
  AlertCircle,
  BookOpen,
  Calendar,
  Video
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const Home = () => {
  const { user, triggerXP } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  
  // Fetch enrolled courses
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['/api/enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/enrollments?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });
  
  // Fetch courses for recommendations
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      return res.json();
    }
  });
  
  // Continue Learning (most recent enrollment with progress < 100%)
  const continueLearningCourse = enrollments?.find((e: any) => e.progress < 100);
  
  // Filter recommended courses (not enrolled)
  const recommendedCourses = courses?.filter((course: any) => 
    !enrollments?.some((e: any) => e.courseId === course.id)
  ).slice(0, 3);
  
  // Generate mock activities for the dashboard
  useEffect(() => {
    // Only generate once or when user changes
    if (activities.length > 0 && activities[0].username === user?.username) {
      return;
    }
    
    // Create sample activities based on current date/time
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    
    setActivities([
      {
        id: 1,
        type: 'badge',
        title: 'You earned the "JavaScript Ninja" badge!',
        timestamp: now.toISOString(),
        icon: Award,
        iconBg: 'bg-purple-100 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400'
      },
      {
        id: 2,
        type: 'lesson',
        title: 'Completed lesson: "Async/Await in JavaScript"',
        timestamp: yesterday.toISOString(),
        icon: CheckCircle,
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400'
      },
      {
        id: 3,
        type: 'xp',
        title: 'Earned 30 XP by completing the JavaScript Basics quiz',
        timestamp: twoDaysAgo.toISOString(),
        icon: Activity,
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        id: 4,
        type: 'session',
        title: 'Attended live session: "Introduction to React Hooks"',
        timestamp: threeDaysAgo.toISOString(),
        icon: Video,
        iconBg: 'bg-amber-100 dark:bg-amber-900/20',
        iconColor: 'text-amber-600 dark:text-amber-400'
      }
    ]);
  }, [user, activities]);
  
  // Format date to relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };
  
  // Demo function to trigger XP notification
  const demoTriggerXP = () => {
    triggerXP(10);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Here's an overview of your learning progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {!isLoadingEnrollments 
                    ? `${enrollments?.filter((e: any) => e.completed).length || 0}/${enrollments?.length || 0}` 
                    : "..."}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">XP Earned</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.xp || 0} XP
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Time</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  24h 35m
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Badges Earned</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  7
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      {continueLearningCourse && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {continueLearningCourse.course.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {/* Show current lesson out of total lessons */}
                    {continueLearningCourse.currentLesson} of {continueLearningCourse.course.lessonsCount} lessons completed
                  </p>
                </div>
                <Button onClick={() => demoTriggerXP()}>Resume</Button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full animate-progress" 
                  style={{ width: `${continueLearningCourse.progress}%`, '--progress-width': `${continueLearningCourse.progress}%` } as any}
                ></div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-5 w-5 mr-1" />
                <span>Next lesson: Working with Promises (25 min)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommended Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended For You</h2>
        {isLoadingCourses ? (
          <div className="text-center py-10">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses?.map((course: CourseType) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onEnroll={async (courseId) => {
                  if (!user) return;
                  
                  try {
                    await apiRequest('POST', '/api/enroll', {
                      userId: user.id,
                      courseId
                    });
                    
                    // Refresh enrollments
                    triggerXP(10);
                  } catch (error) {
                    console.error('Failed to enroll in course:', error);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
        <Card>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${activity.iconBg}`}>
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Home;
