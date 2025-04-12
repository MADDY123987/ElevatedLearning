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
import { Tab, Tabs, TabList, TabPanel } from "@/components/ui/tabs";
import { RefreshCw, Download, Award } from "lucide-react";
import { format } from "date-fns";

const Certifications = () => {
  const { user } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  
  // Fetch user certifications
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['/api/certifications', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/certifications?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch certifications');
      return res.json();
    },
    enabled: !!user
  });
  
  // Fetch user enrollments to check for courses eligible for certification
  const { data: enrollments } = useQuery({
    queryKey: ['/api/enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/enrollments?userId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });
  
  // Completed courses eligible for certification
  const eligibleCourses = enrollments?.filter(
    (enrollment: any) => 
      enrollment.completed && 
      !certifications?.some((cert: any) => cert.courseId === enrollment.courseId)
  );
  
  // Download certificate (in real app, this would download a PDF)
  const handleDownloadCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Certifications
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and download your earned certificates
        </p>
      </div>
      
      <Tabs 
        defaultValue="earned" 
        className="mb-8"
      >
        <TabList className="mb-6">
          <Tab value="earned">
            Earned Certificates ({certifications?.length || 0})
          </Tab>
          <Tab value="eligible">
            Eligible Courses ({eligibleCourses?.length || 0})
          </Tab>
        </TabList>
        
        <TabPanel value="earned">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : !certifications || certifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No certificates yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Complete courses to earn your certificates and showcase your skills.
                </p>
                <Button onClick={() => setTabIndex(1)}>View Eligible Courses</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert: any) => (
                <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-16 bg-gradient-to-r from-indigo-500 to-purple-500">
                    <div className="absolute left-4 top-4 bg-white dark:bg-gray-900 rounded-full p-2 shadow-md">
                      <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {cert.title}
                    </CardTitle>
                    <CardDescription>
                      Issued on {format(new Date(cert.issueDate), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Course: {cert.course.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Credential ID: ELEVATED-{cert.id}-{user?.id}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      onClick={() => handleDownloadCertificate(cert.certificateUrl)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>
        
        <TabPanel value="eligible">
          {!eligibleCourses || eligibleCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No eligible courses
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Complete more courses to become eligible for certificates.
                </p>
                <Button onClick={() => window.location.href = "/dashboard/my-courses"}>
                  Go to My Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleCourses.map((enrollment: any) => (
                <Card key={enrollment.courseId} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {enrollment.course.title}
                    </CardTitle>
                    <CardDescription>
                      Completed on {format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You've completed this course and are eligible to claim your certificate.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Claim Certificate
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Certifications;
