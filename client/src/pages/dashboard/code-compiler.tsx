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
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Play, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  BookOpen
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
};

const languageIcons = {
  javascript: "bg-yellow-100 dark:bg-yellow-900/30",
  python: "bg-blue-100 dark:bg-blue-900/30",
  java: "bg-red-100 dark:bg-red-900/30",
  cpp: "bg-purple-100 dark:bg-purple-900/30"
};

const CodeCompiler = () => {
  const { user, triggerXP } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  
  // Fetch compiler challenges
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['/api/compiler/challenges'],
    queryFn: async () => {
      const res = await fetch('/api/compiler/challenges');
      if (!res.ok) throw new Error('Failed to fetch challenges');
      return res.json();
    }
  });
  
  // Fetch challenge details when selected
  const { data: challengeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/compiler/challenges', selectedChallenge],
    queryFn: async () => {
      const res = await fetch(`/api/compiler/challenges/${selectedChallenge}`);
      if (!res.ok) throw new Error('Failed to fetch challenge details');
      return res.json();
    },
    enabled: !!selectedChallenge
  });
  
  // Set code from challenge details
  useEffect(() => {
    if (challengeDetails) {
      setCode(challengeDetails.startingCode);
      setOutput("");
      setIsSuccess(null);
    }
  }, [challengeDetails]);
  
  // Compile code
  const handleCompile = async () => {
    if (!user || !selectedChallenge || !code) return;
    
    setIsCompiling(true);
    setOutput("");
    setIsSuccess(null);
    
    try {
      const response = await apiRequest('POST', '/api/compile', {
        userId: user.id,
        challengeId: selectedChallenge,
        code
      });
      
      setOutput(response.output);
      setIsSuccess(response.passed);
      
      if (response.passed) {
        triggerXP(15);
      }
    } catch (error) {
      console.error('Compilation error:', error);
      setOutput("Error: Failed to compile code. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsCompiling(false);
    }
  };
  
  // Reset code to starting point
  const handleResetCode = () => {
    if (challengeDetails) {
      setCode(challengeDetails.startingCode);
      setOutput("");
      setIsSuccess(null);
    }
  };
  
  // Group challenges by difficulty
  const getChallengesByDifficulty = () => {
    if (!challenges) return { beginner: [], intermediate: [], advanced: [] };
    
    return {
      beginner: challenges.filter((c: any) => c.difficulty === "Beginner"),
      intermediate: challenges.filter((c: any) => c.difficulty === "Intermediate"),
      advanced: challenges.filter((c: any) => c.difficulty === "Advanced")
    };
  };
  
  const { beginner, intermediate, advanced } = getChallengesByDifficulty();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Code Compiler
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice your coding skills with these challenges
        </p>
      </div>
      
      {selectedChallenge ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Challenge Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    {isLoadingDetails ? "Loading..." : challengeDetails?.title}
                  </CardTitle>
                  <Badge className={
                    difficultyColors[challengeDetails?.difficulty as keyof typeof difficultyColors] || 
                    difficultyColors.Beginner
                  }>
                    {challengeDetails?.difficulty || "Beginner"}
                  </Badge>
                </div>
                <CardDescription>
                  {challengeDetails?.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" /> Instructions
                  </h3>
                  <div className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {challengeDetails?.instructions}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1" /> Expected Output
                  </h3>
                  <pre className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-mono">
                    {challengeDetails?.expectedOutput}
                  </pre>
                </div>
                
                {output && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      {isSuccess ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      )}
                      Your Output
                    </h3>
                    <pre className={`text-sm p-3 rounded-md font-mono ${
                      isSuccess 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}>
                      {output}
                    </pre>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedChallenge(null)}
                >
                  Back to Challenges
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResetCode}
                >
                  Reset Code
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Code Editor */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Code Editor</CardTitle>
                  <Badge className={
                    `${languageIcons[challengeDetails?.language as keyof typeof languageIcons] || 
                    languageIcons.javascript} text-gray-800 dark:text-gray-300`
                  }>
                    {challengeDetails?.language || "javascript"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow pb-0">
                <textarea
                  className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                />
              </CardContent>
              
              <CardFooter className="mt-auto">
                <Button 
                  className="w-full"
                  onClick={handleCompile}
                  disabled={isCompiling || !code.trim()}
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        /* Challenge Selection Screen */
        <>
          <Tabs defaultValue="beginner">
            <TabsList className="mb-6">
              <TabsTrigger value="beginner">
                Beginner ({beginner?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="intermediate">
                Intermediate ({intermediate?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="advanced">
                Advanced ({advanced?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="beginner">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : beginner?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No beginner challenges available at the moment.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beginner.map((challenge: any) => (
                    <ChallengeCard 
                      key={challenge.id} 
                      challenge={challenge} 
                      onSelect={setSelectedChallenge} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="intermediate">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : intermediate?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No intermediate challenges available at the moment.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {intermediate.map((challenge: any) => (
                    <ChallengeCard 
                      key={challenge.id} 
                      challenge={challenge} 
                      onSelect={setSelectedChallenge} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="advanced">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : advanced?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No advanced challenges available at the moment.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advanced.map((challenge: any) => (
                    <ChallengeCard 
                      key={challenge.id} 
                      challenge={challenge} 
                      onSelect={setSelectedChallenge} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Challenge Card Component
const ChallengeCard = ({ 
  challenge, 
  onSelect 
}: { 
  challenge: any; 
  onSelect: (id: number) => void;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          <Badge className={
            difficultyColors[challenge.difficulty as keyof typeof difficultyColors] || 
            difficultyColors.Beginner
          }>
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription>
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Badge className={
          `${languageIcons[challenge.language as keyof typeof languageIcons] || 
          languageIcons.javascript} text-gray-800 dark:text-gray-300`
        }>
          {challenge.language}
        </Badge>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => onSelect(challenge.id)}
        >
          <Code className="mr-2 h-4 w-4" />
          Start Challenge
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeCompiler;
