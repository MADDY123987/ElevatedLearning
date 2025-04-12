import { Link } from "wouter";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export type CourseType = {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  rating: number;
  lessonsCount: number;
  xpReward: number;
  enrolled?: boolean;
  progress?: number;
  currentLesson?: number;
};

type CourseCardProps = {
  course: CourseType;
  onEnroll?: (courseId: number) => void;
  onContinue?: (courseId: number) => void;
  showProgress?: boolean;
};

const CourseCard = ({ 
  course, 
  onEnroll, 
  onContinue, 
  showProgress = false 
}: CourseCardProps) => {
  const {
    id,
    title,
    description,
    category,
    thumbnailUrl,
    rating,
    enrolled,
    progress = 0,
    currentLesson
  } = course;

  // Convert rating from 0-50 to 0-5 and display with one decimal place
  const displayRating = (rating / 10).toFixed(1);

  // Truncate description to prevent overflow
  const truncatedDescription = description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <Card className="course-card overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="font-medium">
            {category}
          </Badge>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{displayRating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{truncatedDescription}</p>
        
        {showProgress && enrolled && (
          <div className="mt-2 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-gray-600 dark:text-gray-300">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full animate-progress" 
                style={{ width: `${progress}%`, '--progress-width': `${progress}%` } as any}
              ></div>
            </div>
            {currentLesson && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Current lesson: {currentLesson}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-0">
        {enrolled ? (
          <Button 
            className="w-full" 
            onClick={() => onContinue && onContinue(id)}
          >
            {progress > 0 ? "Continue Learning" : "Start Course"}
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={() => onEnroll && onEnroll(id)}
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
