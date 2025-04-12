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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  RefreshCw, 
  ChevronsRight, 
  CheckCircle2, 
  AlertCircle,
  XCircle, 
  Code
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type QuizQuestion = {
  id: number;
  quizId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
};

type QuizState = {
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: Record<number, string>;
  isSubmitting: boolean;
  result: {
    score: number;
    totalQuestions: number;
    xpAwarded: number;
    nextChallenge: any;
  } | null;
};

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
};

const Quizzes = () => {
  const { user, triggerXP } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  
  // Fetch all quizzes
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['/api/quizzes'],
    queryFn: async () => {
      const res = await fetch('/api/quizzes');
      if (!res.ok) throw new Error('Failed to fetch quizzes');
      return res.json();
    }
  });
  
  // Fetch quiz questions when a quiz is selected
  const { data: questions, isLoading: isLoadingQuestions, refetch: refetchQuestions } = useQuery({
    queryKey: ['/api/quizzes', selectedQuiz, 'questions'],
    queryFn: async () => {
      if (!selectedQuiz) return null;
      const res = await fetch(`/api/quizzes/${selectedQuiz}/questions`);
      if (!res.ok) throw new Error('Failed to fetch quiz questions');
      return res.json();
    },
    enabled: !!selectedQuiz,
    staleTime: 0 // Always fetch fresh to ensure random order
  });
  
  // Set up quiz state when questions are loaded
  useEffect(() => {
    if (questions && selectedQuiz) {
      setQuizState({
        currentQuestionIndex: 0,
        questions,
        answers: {},
        isSubmitting: false,
        result: null
      });
    }
  }, [questions, selectedQuiz]);
  
  // Handle selecting a quiz to start
  const handleStartQuiz = (quizId: number) => {
    setSelectedQuiz(quizId);
    setQuizState(null);
  };
  
  // Handle selecting an answer
  const handleSelectAnswer = (questionId: number, answer: string) => {
    if (!quizState) return;
    
    setQuizState({
      ...quizState,
      answers: {
        ...quizState.answers,
        [questionId]: answer
      }
    });
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (!quizState) return;
    
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1
      });
    }
  };
  
  // Move to previous question
  const handlePreviousQuestion = () => {
    if (!quizState) return;
    
    if (quizState.currentQuestionIndex > 0) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex - 1
      });
    }
  };
  
  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!quizState || !user || !selectedQuiz) return;
    
    setQuizState({
      ...quizState,
      isSubmitting: true
    });
    
    // Calculate score
    let score = 0;
    quizState.questions.forEach(question => {
      if (quizState.answers[question.id] === question.correctOption) {
        score++;
      }
    });
    
    try {
      // Submit to API
      const response = await apiRequest('POST', '/api/submit-quiz', {
        userId: user.id,
        quizId: selectedQuiz,
        score,
        totalQuestions: quizState.questions.length,
        completed: true
      });
      
      // Update quiz state with results
      setQuizState({
        ...quizState,
        isSubmitting: false,
        result: {
          score,
          totalQuestions: quizState.questions.length,
          xpAwarded: response.xpAwarded || 0,
          nextChallenge: response.nextChallenge
        }
      });
      
      // Trigger XP notification
      triggerXP(response.xpAwarded || 0);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setQuizState({
        ...quizState,
        isSubmitting: false
      });
    }
  };
  
  // Reset quiz
  const handleResetQuiz = () => {
    setSelectedQuiz(null);
    setQuizState(null);
  };
  
  // Try the same quiz again
  const handleRetryQuiz = () => {
    refetchQuestions();
    setQuizState(null);
  };
  
  // Current quiz progress percentage
  const progress = quizState ? 
    ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100 : 
    0;
  
  // Current question
  const currentQuestion = quizState?.questions[quizState.currentQuestionIndex];
  
  // Calculate completion status for QuizCard
  const getQuizStatusBadge = (quizId: number) => {
    // This would normally use submitted quizzes data from API
    // For demo, we'll just show the current quiz as in progress
    if (quizId === selectedQuiz && quizState && !quizState.result) {
      return <Badge variant="secondary">In Progress</Badge>;
    }
    if (quizId === selectedQuiz && quizState?.result) {
      return (
        <Badge variant={quizState.result.score === quizState.result.totalQuestions ? "success" : "default"}>
          {quizState.result.score}/{quizState.result.totalQuestions} Correct
        </Badge>
      );
    }
    return null;
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quizzes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test your knowledge and earn XP with our interactive quizzes
        </p>
      </div>
      
      {selectedQuiz && quizState ? (
        <div>
          {/* Quiz in progress */}
          {!quizState.result ? (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <span>
                        Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {quizzes?.find(q => q.id === selectedQuiz)?.title}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleResetQuiz}
                    size="sm"
                  >
                    Exit Quiz
                  </Button>
                </div>
                <Progress value={progress} className="mt-2" />
              </CardHeader>

              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quizState.currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-lg font-medium mb-4">
                      {currentQuestion?.question}
                    </div>

                    <RadioGroup
                      value={quizState.answers[currentQuestion?.id] || ""}
                      onValueChange={(value) => handleSelectAnswer(currentQuestion?.id, value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <RadioGroupItem value="A" id="option-a" />
                        <Label htmlFor="option-a" className="flex-grow cursor-pointer">
                          {currentQuestion?.optionA}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <RadioGroupItem value="B" id="option-b" />
                        <Label htmlFor="option-b" className="flex-grow cursor-pointer">
                          {currentQuestion?.optionB}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <RadioGroupItem value="C" id="option-c" />
                        <Label htmlFor="option-c" className="flex-grow cursor-pointer">
                          {currentQuestion?.optionC}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <RadioGroupItem value="D" id="option-d" />
                        <Label htmlFor="option-d" className="flex-grow cursor-pointer">
                          {currentQuestion?.optionD}
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={quizState.currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <div>
                  {quizState.currentQuestionIndex === quizState.questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitQuiz} 
                      disabled={quizState.isSubmitting || Object.keys(quizState.answers).length !== quizState.questions.length}
                    >
                      {quizState.isSubmitting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!quizState.answers[currentQuestion?.id]}
                    >
                      Next
                      <ChevronsRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ) : (
            /* Quiz result */
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Quiz Results</CardTitle>
                <CardDescription>
                  {quizzes?.find(q => q.id === selectedQuiz)?.title}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  {quizState.result.score === quizState.result.totalQuestions ? (
                    <div className="text-green-500 mb-2">
                      <CheckCircle2 className="h-20 w-20 mx-auto" />
                      <h3 className="text-2xl font-bold mt-2">Perfect Score!</h3>
                    </div>
                  ) : quizState.result.score >= quizState.result.totalQuestions * 0.7 ? (
                    <div className="text-indigo-500 mb-2">
                      <CheckCircle2 className="h-20 w-20 mx-auto" />
                      <h3 className="text-2xl font-bold mt-2">Great Job!</h3>
                    </div>
                  ) : (
                    <div className="text-amber-500 mb-2">
                      <AlertCircle className="h-20 w-20 mx-auto" />
                      <h3 className="text-2xl font-bold mt-2">Keep Practicing!</h3>
                    </div>
                  )}
                  
                  <div className="text-4xl font-bold mb-4">
                    {quizState.result.score} / {quizState.result.totalQuestions}
                  </div>
                  
                  <div className="w-full max-w-md mb-4">
                    <Progress 
                      value={(quizState.result.score / quizState.result.totalQuestions) * 100} 
                      className="h-4" 
                    />
                  </div>
                  
                  <div className="text-lg font-medium mb-2">
                    You earned <span className="text-indigo-600 dark:text-indigo-400">{quizState.result.xpAwarded} XP</span>!
                  </div>
                </div>
                
                {quizState.result.nextChallenge && (
                  <Card className="w-full max-w-md mb-6 border-dashed border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 mr-2" />
                        Coding Challenge Unlocked!
                      </CardTitle>
                      <CardDescription>
                        {quizState.result.nextChallenge.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {quizState.result.nextChallenge.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => window.location.href = "/dashboard/code-compiler"}
                      >
                        Try Challenge
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetQuiz}>
                  Back to Quizzes
                </Button>
                <Button onClick={handleRetryQuiz}>
                  Try Again
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      ) : (
        /* Quiz selection screen */
        <>
          {isLoadingQuizzes ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {quizzes?.map((quiz: any) => (
                <Card 
                  key={quiz.id} 
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{quiz.title}</CardTitle>
                      <Badge className={difficultyColors[quiz.difficultyLevel as keyof typeof difficultyColors]}>
                        {quiz.difficultyLevel}
                      </Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {quiz.xpReward} XP reward
                      </span>
                    </div>
                    
                    {getQuizStatusBadge(quiz.id)}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      Start Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Quizzes;
