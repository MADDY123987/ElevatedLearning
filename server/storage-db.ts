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
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserXP(userId: number, xpToAdd: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const [updatedUser] = await db
      .update(users)
      .set({ xp: user.xp + xpToAdd })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  // Enrollment methods
  async getEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]> {
    const enrollmentResult = await db.select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
    
    const enrichedEnrollments = await Promise.all(
      enrollmentResult.map(async (enrollment) => {
        const [course] = await db.select()
          .from(courses)
          .where(eq(courses.id, enrollment.courseId));
        
        return { ...enrollment, course };
      })
    );
    
    return enrichedEnrollments;
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
    
    return enrollment || undefined;
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments)
      .values(insertEnrollment)
      .returning();
    
    return enrollment;
  }

  async updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment> {
    const [updatedEnrollment] = await db.update(enrollments)
      .set({ progress, completed: progress >= 100 })
      .where(eq(enrollments.id, id))
      .returning();
    
    return updatedEnrollment;
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return db.select().from(quizzes);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return db.select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions)
      .values(insertQuestion)
      .returning();
    
    return question;
  }

  async submitQuiz(insertSubmission: InsertQuizSubmission): Promise<QuizSubmission> {
    const [submission] = await db.insert(quizSubmissions)
      .values(insertSubmission)
      .returning();
    
    return submission;
  }

  async getQuizSubmissions(userId: number): Promise<(QuizSubmission & { quiz: Quiz })[]> {
    const submissions = await db.select()
      .from(quizSubmissions)
      .where(eq(quizSubmissions.userId, userId));
    
    const enrichedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        const [quiz] = await db.select()
          .from(quizzes)
          .where(eq(quizzes.id, submission.quizId));
        
        return { ...submission, quiz };
      })
    );
    
    return enrichedSubmissions;
  }

  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }

  async getUserBadges(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadgesList = await db.select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
    
    const enrichedUserBadges = await Promise.all(
      userBadgesList.map(async (userBadge) => {
        const [badge] = await db.select()
          .from(badges)
          .where(eq(badges.id, userBadge.badgeId));
        
        return { ...userBadge, badge };
      })
    );
    
    return enrichedUserBadges;
  }

  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db.insert(userBadges)
      .values(insertUserBadge)
      .returning();
    
    return userBadge;
  }

  // Certification methods
  async getCertifications(userId: number): Promise<(Certification & { course: Course })[]> {
    const certificationsList = await db.select()
      .from(certifications)
      .where(eq(certifications.userId, userId));
    
    const enrichedCertifications = await Promise.all(
      certificationsList.map(async (certification) => {
        const [course] = await db.select()
          .from(courses)
          .where(eq(courses.id, certification.courseId));
        
        return { ...certification, course };
      })
    );
    
    return enrichedCertifications;
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const [certification] = await db.insert(certifications)
      .values(insertCertification)
      .returning();
    
    return certification;
  }

  // Live Session methods
  async getLiveSessions(): Promise<LiveSession[]> {
    return db.select().from(liveSessions);
  }

  async getLiveSession(id: number): Promise<LiveSession | undefined> {
    const [liveSession] = await db.select()
      .from(liveSessions)
      .where(eq(liveSessions.id, id));
    
    return liveSession || undefined;
  }

  async createLiveSession(insertSession: InsertLiveSession): Promise<LiveSession> {
    const [liveSession] = await db.insert(liveSessions)
      .values(insertSession)
      .returning();
    
    return liveSession;
  }

  // Chat methods
  async getChatMessages(): Promise<ChatMessage[]> {
    return db.select().from(chatMessages);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages)
      .values(insertMessage)
      .returning();
    
    return message;
  }

  // Compiler methods
  async getCompilerChallenges(): Promise<CompilerChallenge[]> {
    return db.select().from(compilerChallenges);
  }

  async getCompilerChallenge(id: number): Promise<CompilerChallenge | undefined> {
    const [challenge] = await db.select()
      .from(compilerChallenges)
      .where(eq(compilerChallenges.id, id));
    
    return challenge || undefined;
  }

  async createCompilerChallenge(insertChallenge: InsertCompilerChallenge): Promise<CompilerChallenge> {
    const [challenge] = await db.insert(compilerChallenges)
      .values(insertChallenge)
      .returning();
    
    return challenge;
  }

  async submitCompilerSolution(insertSolution: InsertCompilerSolution): Promise<CompilerSolution> {
    const [solution] = await db.insert(compilerSolutions)
      .values(insertSolution)
      .returning();
    
    return solution;
  }

  async getCompilerSolutions(userId: number, challengeId: number): Promise<CompilerSolution[]> {
    return db.select()
      .from(compilerSolutions)
      .where(
        and(
          eq(compilerSolutions.userId, userId),
          eq(compilerSolutions.challengeId, challengeId)
        )
      );
  }
}