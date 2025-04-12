import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import CourseCard from "@/components/common/course-card";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Award, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const MyCourses = () => {
  const { user, triggerXP } = useAuth();
  const [tab, setTab] = useState("all");
  
  // Fetch user enrollments
  const { data: enrollments, isLoading, isError } = useQuery({
    queryKey: ['/api/enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/enrollments?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });
  
  // Calculate total progress across all courses
  const totalProgress = enrollments?.length 
    ? Math.round(enrollments.reduce((acc: number, curr: any) => acc + curr.progress, 0) / enrollments.length) 
    : 0;
  
  // Filter enrollments based on selected tab
  const filteredEnrollments = enrollments?.filter((enrollment: any) => {
    if (tab === "all") return true;
    if (tab === "in-progress") return enrollment.progress > 0 && enrollment.progress < 100;
    if (tab === "completed") return enrollment.progress === 100;
    if (tab === "not-started") return enrollment.progress === 0;
    return true;
  });
  
  // Handle continuing a course - update progress
  const handleContinueCourse = async (courseId: number) => {
    if (!user) return;
    
    // Find the enrollment
    const enrollment = enrollments.find((e: any) => e.courseId === courseId);
    if (!enrollment) return;
    
    // Update progress (increase by 10%)
    const newProgress = Math.min(enrollment.progress + 10, 100);
    
    try {
      await apiRequest('PUT', `/api/enrollments/${enrollment.id}/progress`, {
        progress: newProgress
      });
      
      // Refresh enrollments data
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments', user.id] });
      
      // Only trigger XP if it's a multiple of 10
      if (newProgress % 10 === 0) {
        triggerXP(10);
      }
      
      // If course completed, check for certificate
      if (newProgress === 100) {
        createCertificate(enrollment.courseId, enrollment.course.title);
      }
    } catch (error) {
      console.error('Failed to update course progress:', error);
    }
  };
  
  // Create certificate when course is completed
  const createCertificate = async (courseId: number, courseTitle: string) => {
    if (!user) return;
    
    try {
      await apiRequest('POST', '/api/certifications', {
        userId: user.id,
        courseId,
        title: `${courseTitle} Certificate`
      });
      
      triggerXP(50); // Bonus XP for completing a course
    } catch (error) {
      console.error('Failed to create certificate:', error);
    }
  };
  
  // Courses count by status
  const inProgressCount = enrollments?.filter((e: any) => e.progress > 0 && e.progress < 100).length || 0;
  const completedCount = enrollments?.filter((e: any) => e.progress === 100).length || 0;
  const notStartedCount = enrollments?.filter((e: any) => e.progress === 0).length || 0;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress and continue your learning journey
        </p>
      </div>
      
      {/* Progress Overview */}
      {enrollments?.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Overall Progress
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {totalProgress}% complete
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {completedCount}/{enrollments.length} courses
                    </span>
                  </div>
                  <Progress value={totalProgress} />
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mb-2">
                  <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-lg font-semibold">{enrollments.length}</span>
                <span className="text-sm text-gray-500">Total Courses</span>
              </div>
              
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-2">
                  <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-lg font-semibold">{user?.xp || 0}</span>
                <span className="text-sm text-gray-500">Total XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Course Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({enrollments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Not Started ({notStartedCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={tab}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : isError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-500">
                Failed to load your courses. Please try again later.
              </CardContent>
            </Card>
          ) : filteredEnrollments?.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                No courses found in this category.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((enrollment: any) => (
                <CourseCard 
                  key={enrollment.courseId} 
                  course={{
                    ...enrollment.course,
                    enrolled: true,
                    progress: enrollment.progress,
                    currentLesson: enrollment.currentLesson
                  }}
                  showProgress={true}
                  onContinue={handleContinueCourse}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;
