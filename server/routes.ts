import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertEnrollmentSchema,
  insertQuizSubmissionSchema,
  insertChatMessageSchema,
  insertCompilerSolutionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { registerZoomRoutes } from "./routes/zoom-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Global error handler for Zod validation
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          res.status(400).json({ message: "Invalid request data" });
        }
      }
    };
  };

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error during login" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  app.post("/api/courses", validateRequest(insertCourseSchema), async (req, res) => {
    try {
      const course = await storage.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Error creating course" });
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const enrollments = await storage.getEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  app.post("/api/enroll", validateRequest(insertEnrollmentSchema), async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      
      // Check if user already enrolled
      const existingEnrollment = await storage.getEnrollment(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "User already enrolled in this course" });
      }

      // Check if course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const enrollment = await storage.createEnrollment(req.body);
      
      // Award XP for enrollment
      await storage.updateUserXP(userId, 10);
      
      // Check if this is the first enrollment to award a badge
      const enrollments = await storage.getEnrollments(userId);
      if (enrollments.length === 1) {
        // Get Course Explorer badge
        const badges = await storage.getBadges();
        const courseExplorerBadge = badges.find(b => b.requirement === "enroll:1");
        
        if (courseExplorerBadge) {
          await storage.awardBadge({ 
            userId, 
            badgeId: courseExplorerBadge.id 
          });
        }
      }
      
      res.status(201).json({
        message: "Successfully enrolled in course",
        enrollment
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ message: "Error creating enrollment" });
    }
  });

  app.put("/api/enrollments/:id/progress", async (req, res) => {
    try {
      const enrollmentId = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (isNaN(enrollmentId) || typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid enrollment ID or progress value" });
      }

      const updatedEnrollment = await storage.updateEnrollmentProgress(enrollmentId, progress);
      
      // If progress is a multiple of 10, award XP
      if (progress % 10 === 0 && progress > 0) {
        await storage.updateUserXP(updatedEnrollment.userId, 10);
      }
      
      res.json(updatedEnrollment);
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({ message: "Error updating enrollment progress" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", async (_req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quizzes" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      const quiz = await storage.getQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz" });
    }
  });

  app.get("/api/quizzes/:id/questions", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      // Get all questions for this quiz
      const questions = await storage.getQuizQuestions(quizId);
      
      // Randomize order as required
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      
      res.json(shuffledQuestions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz questions" });
    }
  });

  app.post("/api/submit-quiz", validateRequest(insertQuizSubmissionSchema), async (req, res) => {
    try {
      const submission = await storage.submitQuiz(req.body);
      
      // Award XP based on quiz performance
      const quiz = await storage.getQuiz(submission.quizId);
      if (quiz) {
        const scorePercentage = (submission.score / submission.totalQuestions) * 100;
        let xpToAward = Math.floor((scorePercentage / 100) * quiz.xpReward);
        
        // Ensure minimum XP for participation
        if (xpToAward < 5 && scorePercentage > 0) {
          xpToAward = 5;
        }
        
        const updatedUser = await storage.updateUserXP(submission.userId, xpToAward);
        
        // Check if perfect score to award badge
        if (submission.score === submission.totalQuestions) {
          // Get Quiz Master badge
          const badges = await storage.getBadges();
          const quizMasterBadge = badges.find(b => b.requirement === "quiz:perfect");
          
          if (quizMasterBadge) {
            await storage.awardBadge({ 
              userId: submission.userId, 
              badgeId: quizMasterBadge.id 
            });
          }
        }
        
        // Get compiler challenge for this quiz if it exists
        const challenges = await storage.getCompilerChallenges();
        const quizChallenge = challenges.find(c => c.quizId === submission.quizId);
        
        return res.status(201).json({
          message: "Quiz submitted successfully",
          submission,
          xpAwarded: xpToAward,
          currentXP: updatedUser.xp,
          nextChallenge: quizChallenge || null
        });
      }
      
      res.status(201).json({ 
        message: "Quiz submitted successfully",
        submission
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ message: "Error submitting quiz" });
    }
  });

  // Compiler routes
  app.get("/api/compiler/challenges", async (_req, res) => {
    try {
      const challenges = await storage.getCompilerChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching compiler challenges" });
    }
  });

  app.get("/api/compiler/challenges/:id", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      if (isNaN(challengeId)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }

      const challenge = await storage.getCompilerChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Error fetching compiler challenge" });
    }
  });

  app.post("/api/compile", validateRequest(insertCompilerSolutionSchema), async (req, res) => {
    try {
      const { userId, challengeId, code } = req.body;
      
      // Fetch the challenge to get expected output
      const challenge = await storage.getCompilerChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      // Simple dummy compiler that checks if code contains the expected output
      // In a real app, this would call Judge0 API or another compiler service
      let passed = false;
      let output = "";
      
      if (code.includes(challenge.expectedOutput)) {
        passed = true;
        output = challenge.expectedOutput;
      } else {
        // Generate a realistic error or partial output
        if (challenge.language === "javascript") {
          output = "TypeError: Cannot read property 'undefined' of null";
        } else if (challenge.language === "python") {
          output = "IndentationError: unexpected indent";
        } else {
          output = "Compilation error";
        }
      }
      
      // Save the solution
      const solution = await storage.submitCompilerSolution({
        userId,
        challengeId,
        code,
        passed
      });
      
      // If passed, award XP
      if (passed) {
        await storage.updateUserXP(userId, 15);
        
        // Check if user has completed 3 challenges to award badge
        const solutions = await storage.getCompilerSolutions(userId, 0);
        const passedSolutions = solutions.filter(s => s.passed);
        
        if (passedSolutions.length === 3) {
          // Get Code Ninja badge
          const badges = await storage.getBadges();
          const codeNinjaBadge = badges.find(b => b.requirement === "compiler:3");
          
          if (codeNinjaBadge) {
            await storage.awardBadge({ 
              userId, 
              badgeId: codeNinjaBadge.id 
            });
          }
        }
      }
      
      res.json({
        output,
        passed,
        solution
      });
    } catch (error) {
      console.error("Compile error:", error);
      res.status(500).json({ message: "Error compiling code" });
    }
  });

  // Badges routes
  app.get("/api/badges", async (_req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching badges" });
    }
  });

  app.get("/api/user-badges", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user badges" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const certifications = await storage.getCertifications(userId);
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const { userId, courseId, title } = req.body;
      
      if (!userId || !courseId || !title) {
        return res.status(400).json({ message: "UserId, courseId, and title are required" });
      }
      
      // Check if user has completed the course
      const enrollment = await storage.getEnrollment(userId, courseId);
      if (!enrollment || !enrollment.completed) {
        return res.status(400).json({ message: "Course must be completed to get certification" });
      }
      
      // Generate a dummy certificate URL
      const certificateUrl = `https://elevated.edu/certificates/${userId}_${courseId}_${Date.now()}`;
      
      const certification = await storage.createCertification({
        userId,
        courseId,
        title,
        certificateUrl
      });
      
      res.status(201).json(certification);
    } catch (error) {
      console.error("Certification error:", error);
      res.status(500).json({ message: "Error creating certification" });
    }
  });

  // Live Sessions routes
  app.get("/api/live-sessions", async (_req, res) => {
    try {
      const sessions = await storage.getLiveSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching live sessions" });
    }
  });

  app.get("/api/live-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const session = await storage.getLiveSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Live session not found" });
      }

      // This would typically integrate with Zoom API
      // For this demo, we'll return a fake Zoom URL
      const joinUrl = `https://zoom.us/j/${session.meetingId}`;
      
      res.json({
        ...session,
        joinUrl
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching live session" });
    }
  });

  // Chat Messages routes
  app.get("/api/chat-messages", async (_req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat messages" });
    }
  });

  // Set up WebSocket server for chat
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send initial chat messages to client
    storage.getChatMessages().then(messages => {
      ws.send(JSON.stringify({
        type: 'initial_messages',
        data: messages
      }));
    });

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'chat_message') {
          const { userId, username, message } = data.data;
          
          // Validate message data
          const validatedData = insertChatMessageSchema.parse({
            userId,
            username,
            message
          });
          
          // Store the message
          const newMessage = await storage.createChatMessage(validatedData);
          
          // Broadcast to all connected clients
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                data: newMessage
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Register Zoom routes
  registerZoomRoutes(app);

  return httpServer;
}
