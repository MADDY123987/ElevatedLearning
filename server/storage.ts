import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  enrollments, type Enrollment, type InsertEnrollment,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  quizSubmissions, type QuizSubmission, type InsertQuizSubmission,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge,
  certifications, type Certification, type InsertCertification,
  liveSessions, type LiveSession, type InsertLiveSession,
  chatMessages, type ChatMessage, type InsertChatMessage,
  compilerChallenges, type CompilerChallenge, type InsertCompilerChallenge,
  compilerSolutions, type CompilerSolution, type InsertCompilerSolution
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXP(userId: number, xpToAdd: number): Promise<User>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Enrollment methods
  getEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment>;

  // Quiz methods
  getQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  submitQuiz(submission: InsertQuizSubmission): Promise<QuizSubmission>;
  getQuizSubmissions(userId: number): Promise<(QuizSubmission & { quiz: Quiz })[]>;

  // Badge methods
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;

  // Certification methods
  getCertifications(userId: number): Promise<(Certification & { course: Course })[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;

  // Live Session methods
  getLiveSessions(): Promise<LiveSession[]>;
  getLiveSession(id: number): Promise<LiveSession | undefined>;
  createLiveSession(session: InsertLiveSession): Promise<LiveSession>;

  // Chat methods
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Compiler methods
  getCompilerChallenges(): Promise<CompilerChallenge[]>;
  getCompilerChallenge(id: number): Promise<CompilerChallenge | undefined>;
  createCompilerChallenge(challenge: InsertCompilerChallenge): Promise<CompilerChallenge>;
  submitCompilerSolution(solution: InsertCompilerSolution): Promise<CompilerSolution>;
  getCompilerSolutions(userId: number, challengeId: number): Promise<CompilerSolution[]>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private coursesData: Map<number, Course>;
  private enrollmentsData: Map<number, Enrollment>;
  private quizzesData: Map<number, Quiz>;
  private quizQuestionsData: Map<number, QuizQuestion>;
  private quizSubmissionsData: Map<number, QuizSubmission>;
  private badgesData: Map<number, Badge>;
  private userBadgesData: Map<number, UserBadge>;
  private certificationsData: Map<number, Certification>;
  private liveSessionsData: Map<number, LiveSession>;
  private chatMessagesData: Map<number, ChatMessage>;
  private compilerChallengesData: Map<number, CompilerChallenge>;
  private compilerSolutionsData: Map<number, CompilerSolution>;
  
  private currentIds: {
    users: number;
    courses: number;
    enrollments: number;
    quizzes: number;
    quizQuestions: number;
    quizSubmissions: number;
    badges: number;
    userBadges: number;
    certifications: number;
    liveSessions: number;
    chatMessages: number;
    compilerChallenges: number;
    compilerSolutions: number;
  };

  constructor() {
    this.usersData = new Map();
    this.coursesData = new Map();
    this.enrollmentsData = new Map();
    this.quizzesData = new Map();
    this.quizQuestionsData = new Map();
    this.quizSubmissionsData = new Map();
    this.badgesData = new Map();
    this.userBadgesData = new Map();
    this.certificationsData = new Map();
    this.liveSessionsData = new Map();
    this.chatMessagesData = new Map();
    this.compilerChallengesData = new Map();
    this.compilerSolutionsData = new Map();
    
    this.currentIds = {
      users: 1,
      courses: 1,
      enrollments: 1,
      quizzes: 1,
      quizQuestions: 1,
      quizSubmissions: 1,
      badges: 1,
      userBadges: 1,
      certifications: 1,
      liveSessions: 1,
      chatMessages: 1,
      compilerChallenges: 1,
      compilerSolutions: 1
    };

    // Initialize with hardcoded users
    this.createUser({
      username: "Madhavan",
      password: "Test@1234",
      email: "madhavan@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    });
    
    this.createUser({
      username: "Elevated",
      password: "Teach@1234",
      email: "elevated@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    });
    
    // Initialize some courses
    this.initializeData();
  }

  private initializeData() {
    // Create courses
    const courses = [
      {
        title: "Advanced JavaScript: From Fundamentals to Functional JS",
        description: "Master advanced JavaScript concepts including closures, prototypes, promises, and functional programming paradigms.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 48,
        lessonsCount: 36,
        xpReward: 15
      },
      {
        title: "Full-Stack Web Development with React & Node.js",
        description: "Build modern, scalable web applications with React on the frontend and Node.js on the backend.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 48,
        lessonsCount: 42,
        xpReward: 15
      },
      {
        title: "Machine Learning & Data Science Bootcamp",
        description: "Learn to use Python for data analysis, visualization, and building machine learning models.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 49,
        lessonsCount: 38,
        xpReward: 15
      },
      {
        title: "Flutter & Dart: The Complete Mobile App Development Course",
        description: "Build beautiful, native apps for iOS and Android using Flutter and Dart.",
        category: "Mobile Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 47,
        lessonsCount: 32,
        xpReward: 15
      },
      {
        title: "DevOps Engineering: CI/CD with Docker & Kubernetes",
        description: "Master the tools and practices of modern DevOps including containers, orchestration, and automated pipelines.",
        category: "DevOps",
        thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 46,
        lessonsCount: 28,
        xpReward: 15
      },
      {
        title: "Python for Beginners: From Zero to Hero",
        description: "Start your programming journey with Python, the most beginner-friendly programming language.",
        category: "Programming",
        thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 49,
        lessonsCount: 24,
        xpReward: 10
      },
      {
        title: "Cloud Computing with AWS",
        description: "Learn to build and deploy scalable applications on Amazon Web Services.",
        category: "Cloud Computing",
        thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 47,
        lessonsCount: 30,
        xpReward: 15
      },
      {
        title: "Cybersecurity Fundamentals",
        description: "Understand the basics of network security, encryption, and threat mitigation strategies.",
        category: "Security",
        thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 46,
        lessonsCount: 26,
        xpReward: 15
      }
    ];

    courses.forEach(course => this.createCourse(course));

    // Create quizzes
    const quizzes = [
      {
        title: "JavaScript Basics",
        description: "Test your understanding of JavaScript fundamentals.",
        xpReward: 30,
        difficultyLevel: "Beginner",
        courseId: 1
      },
      {
        title: "Advanced JavaScript Concepts",
        description: "Challenge yourself with closures, prototypes, and more.",
        xpReward: 50,
        difficultyLevel: "Advanced",
        courseId: 1
      },
      {
        title: "React Fundamentals",
        description: "Test your knowledge of React components and hooks.",
        xpReward: 40,
        difficultyLevel: "Intermediate",
        courseId: 2
      },
      {
        title: "Node.js and Express",
        description: "Verify your backend development skills.",
        xpReward: 40,
        difficultyLevel: "Intermediate",
        courseId: 2
      },
      {
        title: "Python Basics",
        description: "Test your understanding of Python syntax and concepts.",
        xpReward: 30,
        difficultyLevel: "Beginner",
        courseId: 6
      },
      {
        title: "Machine Learning Concepts",
        description: "Evaluate your knowledge of ML algorithms and applications.",
        xpReward: 60,
        difficultyLevel: "Advanced",
        courseId: 3
      },
      {
        title: "Flutter Widgets",
        description: "Test your understanding of Flutter's widget system.",
        xpReward: 40,
        difficultyLevel: "Intermediate",
        courseId: 4
      },
      {
        title: "DevOps Principles",
        description: "Verify your knowledge of CI/CD and container orchestration.",
        xpReward: 50,
        difficultyLevel: "Advanced",
        courseId: 5
      }
    ];

    quizzes.forEach(quiz => this.createQuiz(quiz));

    // Create sample quiz questions for each quiz
    for (let quizId = 1; quizId <= quizzes.length; quizId++) {
      // Create 20 questions per quiz as specified in requirements
      for (let i = 1; i <= 20; i++) {
        this.createQuizQuestion({
          quizId,
          question: `Sample Question ${i} for Quiz ${quizId}`,
          optionA: `Option A for Question ${i}`,
          optionB: `Option B for Question ${i}`,
          optionC: `Option C for Question ${i}`,
          optionD: `Option D for Question ${i}`,
          correctOption: "A" // Default correct option
        });
      }
    }

    // Create badges
    const badges = [
      {
        name: "First Login",
        description: "Logged in for the first time",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/607/607634.png",
        requirement: "login:1"
      },
      {
        name: "Course Explorer",
        description: "Enrolled in first course",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/5174/5174582.png",
        requirement: "enroll:1"
      },
      {
        name: "Knowledge Seeker",
        description: "Completed 5 lessons",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4355/4355061.png",
        requirement: "lessons:5"
      },
      {
        name: "Quiz Master",
        description: "Scored 100% on any quiz",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972339.png",
        requirement: "quiz:perfect"
      },
      {
        name: "Code Ninja",
        description: "Solved 3 coding challenges",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/6062/6062646.png",
        requirement: "compiler:3"
      },
      {
        name: "Interactive Learner",
        description: "Attended first live session",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4997/4997543.png",
        requirement: "livesession:1"
      },
      {
        name: "JavaScript Ninja",
        description: "Completed Advanced JavaScript course",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        requirement: "course:1:complete"
      }
    ];

    badges.forEach(badge => this.createBadge(badge));

    // Create compiler challenges
    const compilerChallenges = [
      {
        title: "Hello World",
        description: "Write your first JavaScript program",
        instructions: "Write a function that returns 'Hello, World!'",
        startingCode: "function helloWorld() {\n  // Your code here\n}\n",
        quizId: 1,
        expectedOutput: "Hello, World!",
        difficulty: "Beginner",
        language: "javascript"
      },
      {
        title: "FizzBuzz",
        description: "Classic coding challenge",
        instructions: "Write a function that returns 'Fizz' for numbers divisible by 3, 'Buzz' for numbers divisible by 5, and 'FizzBuzz' for numbers divisible by both.",
        startingCode: "function fizzBuzz(num) {\n  // Your code here\n}\n",
        quizId: 2,
        expectedOutput: "FizzBuzz",
        difficulty: "Intermediate",
        language: "javascript"
      },
      {
        title: "Array Manipulation",
        description: "Filter and transform arrays",
        instructions: "Write a function that takes an array of numbers and returns an array with only the even numbers doubled.",
        startingCode: "function processArray(arr) {\n  // Your code here\n}\n",
        quizId: 2,
        expectedOutput: "[2, 4, 8]",
        difficulty: "Intermediate",
        language: "javascript"
      },
      {
        title: "Python List Comprehension",
        description: "Showcase your Python skills",
        instructions: "Create a list of squares for all even numbers from 1 to 10",
        startingCode: "def even_squares():\n    # Your code here\n    pass\n",
        quizId: 5,
        expectedOutput: "[4, 16, 36, 64, 100]",
        difficulty: "Intermediate",
        language: "python"
      }
    ];

    compilerChallenges.forEach(challenge => this.createCompilerChallenge(challenge));

    // Create live sessions
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const liveSessions = [
      {
        title: "Introduction to React Hooks",
        description: "Learn about useState, useEffect, and custom hooks",
        instructorName: "Elevated",
        sessionDate: tomorrow,
        duration: 60,
        meetingId: "123456789",
        meetingPassword: "react"
      },
      {
        title: "Building APIs with Express",
        description: "Create RESTful APIs with Node.js and Express",
        instructorName: "Madhavan",
        sessionDate: nextWeek,
        duration: 90,
        meetingId: "987654321",
        meetingPassword: "express"
      },
      {
        title: "Introduction to Machine Learning",
        description: "Basics of ML algorithms and their applications",
        instructorName: "Elevated",
        sessionDate: new Date(nextWeek.getTime() + 86400000 * 2),
        duration: 120,
        meetingId: "456789123",
        meetingPassword: "ml101"
      }
    ];

    liveSessions.forEach(session => this.createLiveSession(session));

    // Create some initial chat messages
    const chatMessages = [
      {
        userId: 1,
        username: "Madhavan",
        message: "Hey everyone! Anyone working on the JavaScript course?"
      },
      {
        userId: 2,
        username: "Elevated",
        message: "I can help with that! There's a live session on promises tomorrow."
      }
    ];

    chatMessages.forEach(message => this.createChatMessage(message));

    // Create initial enrollment for Madhavan user
    this.createEnrollment({
      userId: 1,
      courseId: 1
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      xp: 0,
      createdAt: now
    };
    this.usersData.set(id, user);
    return user;
  }

  async updateUserXP(userId: number, xpToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const updatedUser = { 
      ...user, 
      xp: user.xp + xpToAdd 
    };
    
    this.usersData.set(userId, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.coursesData.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.coursesData.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentIds.courses++;
    const now = new Date();
    const course: Course = { 
      ...insertCourse, 
      id,
      createdAt: now
    };
    this.coursesData.set(id, course);
    return course;
  }

  // Enrollment methods
  async getEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]> {
    const enrollments = Array.from(this.enrollmentsData.values())
      .filter(enrollment => enrollment.userId === userId);
    
    return Promise.all(enrollments.map(async enrollment => {
      const course = await this.getCourse(enrollment.courseId);
      return { 
        ...enrollment, 
        course: course as Course 
      };
    }));
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollmentsData.values())
      .find(enrollment => 
        enrollment.userId === userId && 
        enrollment.courseId === courseId
      );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentIds.enrollments++;
    const now = new Date();
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id,
      progress: 0,
      completed: false,
      currentLesson: 1,
      enrolledAt: now
    };
    this.enrollmentsData.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment> {
    const enrollment = this.enrollmentsData.get(id);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${id} not found`);
    }

    const course = await this.getCourse(enrollment.courseId);
    if (!course) {
      throw new Error(`Course with id ${enrollment.courseId} not found`);
    }

    const updatedEnrollment = { 
      ...enrollment, 
      progress,
      completed: progress >= 100,
      currentLesson: Math.ceil((progress / 100) * (course.lessonsCount || 1))
    };
    
    this.enrollmentsData.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzesData.values());
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzesData.get(id);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentIds.quizzes++;
    const now = new Date();
    const quiz: Quiz = { 
      ...insertQuiz, 
      id,
      createdAt: now
    };
    this.quizzesData.set(id, quiz);
    return quiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestionsData.values())
      .filter(question => question.quizId === quizId);
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentIds.quizQuestions++;
    const question: QuizQuestion = { 
      ...insertQuestion, 
      id
    };
    this.quizQuestionsData.set(id, question);
    return question;
  }

  async submitQuiz(insertSubmission: InsertQuizSubmission): Promise<QuizSubmission> {
    const id = this.currentIds.quizSubmissions++;
    const now = new Date();
    const submission: QuizSubmission = { 
      ...insertSubmission, 
      id,
      submittedAt: now
    };
    this.quizSubmissionsData.set(id, submission);
    return submission;
  }

  async getQuizSubmissions(userId: number): Promise<(QuizSubmission & { quiz: Quiz })[]> {
    const submissions = Array.from(this.quizSubmissionsData.values())
      .filter(submission => submission.userId === userId);
    
    return Promise.all(submissions.map(async submission => {
      const quiz = await this.getQuiz(submission.quizId);
      return { 
        ...submission, 
        quiz: quiz as Quiz 
      };
    }));
  }

  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badgesData.values());
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.currentIds.badges++;
    const badge: Badge = { 
      ...insertBadge, 
      id
    };
    this.badgesData.set(id, badge);
    return badge;
  }

  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadges = Array.from(this.userBadgesData.values())
      .filter(userBadge => userBadge.userId === userId);
    
    return Promise.all(userBadges.map(async userBadge => {
      const badge = await this.badgesData.get(userBadge.badgeId);
      return { 
        ...userBadge, 
        badge: badge as Badge 
      };
    }));
  }

  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if user already has this badge
    const existingBadge = Array.from(this.userBadgesData.values())
      .find(ub => 
        ub.userId === insertUserBadge.userId && 
        ub.badgeId === insertUserBadge.badgeId
      );
    
    if (existingBadge) {
      return existingBadge;
    }
    
    const id = this.currentIds.userBadges++;
    const now = new Date();
    const userBadge: UserBadge = { 
      ...insertUserBadge, 
      id,
      earnedAt: now
    };
    this.userBadgesData.set(id, userBadge);
    return userBadge;
  }

  // Certification methods
  async getCertifications(userId: number): Promise<(Certification & { course: Course })[]> {
    const certifications = Array.from(this.certificationsData.values())
      .filter(cert => cert.userId === userId);
    
    return Promise.all(certifications.map(async cert => {
      const course = await this.getCourse(cert.courseId);
      return { 
        ...cert, 
        course: course as Course 
      };
    }));
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = this.currentIds.certifications++;
    const now = new Date();
    const certification: Certification = { 
      ...insertCertification, 
      id,
      issueDate: now
    };
    this.certificationsData.set(id, certification);
    return certification;
  }

  // Live Session methods
  async getLiveSessions(): Promise<LiveSession[]> {
    return Array.from(this.liveSessionsData.values());
  }

  async getLiveSession(id: number): Promise<LiveSession | undefined> {
    return this.liveSessionsData.get(id);
  }

  async createLiveSession(insertSession: InsertLiveSession): Promise<LiveSession> {
    const id = this.currentIds.liveSessions++;
    const session: LiveSession = { 
      ...insertSession, 
      id
    };
    this.liveSessionsData.set(id, session);
    return session;
  }

  // Chat methods
  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessagesData.values());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const now = new Date();
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      sentAt: now
    };
    this.chatMessagesData.set(id, message);
    return message;
  }

  // Compiler methods
  async getCompilerChallenges(): Promise<CompilerChallenge[]> {
    return Array.from(this.compilerChallengesData.values());
  }

  async getCompilerChallenge(id: number): Promise<CompilerChallenge | undefined> {
    return this.compilerChallengesData.get(id);
  }

  async createCompilerChallenge(insertChallenge: InsertCompilerChallenge): Promise<CompilerChallenge> {
    const id = this.currentIds.compilerChallenges++;
    const challenge: CompilerChallenge = { 
      ...insertChallenge, 
      id
    };
    this.compilerChallengesData.set(id, challenge);
    return challenge;
  }

  async submitCompilerSolution(insertSolution: InsertCompilerSolution): Promise<CompilerSolution> {
    const id = this.currentIds.compilerSolutions++;
    const now = new Date();
    const solution: CompilerSolution = { 
      ...insertSolution, 
      id,
      submittedAt: now
    };
    this.compilerSolutionsData.set(id, solution);
    return solution;
  }

  async getCompilerSolutions(userId: number, challengeId: number): Promise<CompilerSolution[]> {
    return Array.from(this.compilerSolutionsData.values())
      .filter(solution => 
        solution.userId === userId && 
        (challengeId ? solution.challengeId === challengeId : true)
      );
  }
}

export const storage = new MemStorage();
