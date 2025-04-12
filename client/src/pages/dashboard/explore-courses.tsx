import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import CourseCard, { CourseType } from "@/components/common/course-card";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Search, RefreshCw } from "lucide-react";

const ExploreCourses = () => {
  const { user, triggerXP } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  
  // Fetch all courses
  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      return res.json();
    }
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
  
  // Handle course enrollment
  const handleEnroll = async (courseId: number) => {
    if (!user) return;
    
    try {
      await apiRequest('POST', '/api/enroll', {
        userId: user.id,
        courseId
      });
      
      // Refresh enrollments data
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments', user.id] });
      
      // Trigger XP notification
      triggerXP(10);
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    }
  };
  
  // Filter courses based on search term and category
  const filteredCourses = courses?.filter((course: CourseType) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || course.category === category;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = courses ? 
    ["all", ...new Set(courses.map((course: CourseType) => course.category))] : 
    ["all"];
  
  // Function to check if user is enrolled in a course
  const isEnrolled = (courseId: number) => {
    return enrollments?.some((enrollment: any) => enrollment.courseId === courseId);
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover new skills and expand your knowledge with our wide range of courses
        </p>
      </div>
      
      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Course Grid */}
      {isLoading || isLoadingEnrollments ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            Failed to load courses. Please try again later.
          </CardContent>
        </Card>
      ) : filteredCourses?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            No courses found matching your search criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((course: CourseType) => (
            <CourseCard 
              key={course.id} 
              course={{
                ...course,
                enrolled: isEnrolled(course.id)
              }}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;
