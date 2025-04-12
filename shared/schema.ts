import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  xp: integer("xp").default(0).notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Courses Table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  rating: integer("rating").default(0),
  lessonsCount: integer("lessons_count").default(0),
  xpReward: integer("xp_reward").default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  category: true,
  thumbnailUrl: true,
  rating: true,
  lessonsCount: true,
  xpReward: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Enrollments Table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  progress: integer("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  currentLesson: integer("current_lesson").default(1).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  userId: true,
  courseId: true,
});

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Quizzes Table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").default(30).notNull(),
  difficultyLevel: text("difficulty_level").notNull(),
  courseId: integer("course_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  title: true,
  description: true,
  xpReward: true,
  difficultyLevel: true,
  courseId: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

// Quiz Questions Table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: text("correct_option").notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  optionA: true,
  optionB: true,
  optionC: true,
  optionD: true,
  correctOption: true,
});

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

// Quiz Submissions Table
export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completed: boolean("completed").default(false).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissions).pick({
  userId: true,
  quizId: true,
  score: true,
  totalQuestions: true,
  completed: true,
});

export type InsertQuizSubmission = z.infer<typeof insertQuizSubmissionSchema>;
export type QuizSubmission = typeof quizSubmissions.$inferSelect;

// Badges Table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url").notNull(),
  requirement: text("requirement").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  iconUrl: true,
  requirement: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges Table
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Certifications Table
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  certificateUrl: text("certificate_url"),
});

export const insertCertificationSchema = createInsertSchema(certifications).pick({
  userId: true,
  courseId: true,
  title: true,
  certificateUrl: true,
});

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

// Live Sessions Table
export const liveSessions = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorName: text("instructor_name").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  meetingId: text("meeting_id"),
  meetingPassword: text("meeting_password"),
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).pick({
  title: true,
  description: true,
  instructorName: true,
  sessionDate: true,
  duration: true,
  meetingId: true,
  meetingPassword: true,
});

export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;

// Chat Messages Table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  username: true,
  message: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Compiler Challenges Table
export const compilerChallenges = pgTable("compiler_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  startingCode: text("starting_code").notNull(),
  quizId: integer("quiz_id"), // Optional relation to a quiz
  expectedOutput: text("expected_output").notNull(),
  difficulty: text("difficulty").notNull(),
  language: text("language").notNull(),
});

export const insertCompilerChallengeSchema = createInsertSchema(compilerChallenges).pick({
  title: true,
  description: true,
  instructions: true,
  startingCode: true,
  quizId: true,
  expectedOutput: true,
  difficulty: true,
  language: true,
});

export type InsertCompilerChallenge = z.infer<typeof insertCompilerChallengeSchema>;
export type CompilerChallenge = typeof compilerChallenges.$inferSelect;

// Compiler Solutions Table
export const compilerSolutions = pgTable("compiler_solutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  code: text("code").notNull(),
  passed: boolean("passed").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCompilerSolutionSchema = createInsertSchema(compilerSolutions).pick({
  userId: true,
  challengeId: true,
  code: true,
  passed: true,
});

export type InsertCompilerSolution = z.infer<typeof insertCompilerSolutionSchema>;
export type CompilerSolution = typeof compilerSolutions.$inferSelect;
