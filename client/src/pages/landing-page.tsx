import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Star, 
  Check, 
  Video, 
  Code, 
  Trophy, 
  PenTool, 
  BookOpen, 
  Users, 
  MessageSquare, 
  BarChart 
} from "lucide-react";
import LoginModal from "./login-modal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navigation Bar */}
      <header className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-500">ElevateEd</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                  <a href="#courses" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Courses</a>
                  <a href="#instructors" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Instructors</a>
                  <a href="#testimonials" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => setShowLoginModal(true)}
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
                onClick={() => setShowLoginModal(true)}
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                Elevate Your Learning Experience
              </h1>
              <h2 className="mt-2 text-2xl font-bold text-indigo-400">
                Anytime, Anywhere
              </h2>
              <p className="mt-4 text-xl text-gray-300 sm:mt-6">
                Access high-quality courses, join a supportive community, and learn from industry-leading experts all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Start Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-indigo-500 text-indigo-400 hover:bg-indigo-950"
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign Up Free
                </Button>
              </div>
              
              {/* Statistics */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-gray-400 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">200+</div>
                  <div className="text-gray-400 text-sm">Educators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-gray-400 text-sm">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                className="rounded-lg shadow-2xl border border-gray-800" 
                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Students learning online" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Why Choose ElevateEd
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Our platform offers cutting-edge features designed to enhance your learning experience
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <PenTool className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Interactive Courses</h3>
              <p className="mt-2 text-gray-300">Engaging content with hands-on exercises to enhance your understanding.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Built-in Compiler</h3>
              <p className="mt-2 text-gray-300">Practice coding directly in your browser with our integrated compiler.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Live Sessions</h3>
              <p className="mt-2 text-gray-300">Connect with instructors and peers through integrated Zoom sessions.</p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Gamified Learning</h3>
              <p className="mt-2 text-gray-300">Earn XP, unlock badges, and track your progress as you learn.</p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Community Support</h3>
              <p className="mt-2 text-gray-300">Get help from peers and mentors in our active community forums.</p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Progress Tracking</h3>
              <p className="mt-2 text-gray-300">Monitor your learning journey with detailed progress analytics.</p>
            </motion.div>
            
            {/* Feature 7 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Certifications</h3>
              <p className="mt-2 text-gray-300">Earn industry-recognized certificates upon course completion.</p>
            </motion.div>
            
            {/* Feature 8 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-900/40 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Expert Instructors</h3>
              <p className="mt-2 text-gray-300">Learn from industry professionals with real-world experience.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section id="courses" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Popular Courses
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Discover our most popular courses and start your learning journey today
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Course 1 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Web Development Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Beginner
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Full-Stack Web Development</h3>
                <p className="text-gray-300 mb-4">Learn to build modern, responsive web applications from scratch.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">John Doe</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    3200 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
            
            {/* Course 2 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Data Science Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Intermediate
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Data Science & ML Fundamentals</h3>
                <p className="text-gray-300 mb-4">Master data analysis, visualization, and machine learning models.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">Emily Chen</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    4500 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
            
            {/* Course 3 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Cyber Security Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Advanced
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Cyber Security Masterclass</h3>
                <p className="text-gray-300 mb-4">Learn ethical hacking, penetration testing, and security protocols.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">Michael Rodriguez</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    5800 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
            
            {/* Course 4 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Mobile Development Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Intermediate
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Mobile App Development</h3>
                <p className="text-gray-300 mb-4">Build native iOS and Android apps using React Native.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">Sarah Johnson</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    4200 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
            
            {/* Course 5 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="DevOps Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Advanced
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">DevOps Engineering</h3>
                <p className="text-gray-300 mb-4">Master CI/CD pipelines, container orchestration, and cloud infrastructure.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">Alex Williams</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    5200 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
            
            {/* Course 6 */}
            <motion.div 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="relative">
                <img 
                  className="h-48 w-full object-cover" 
                  src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="AI Course" 
                />
                <Badge className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Advanced
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">AI and Deep Learning</h3>
                <p className="text-gray-300 mb-4">Explore neural networks, computer vision, NLP, and generative AI.</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-8 w-8 rounded-full border border-indigo-500" 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Instructor" 
                    />
                    <span className="ml-2 text-sm text-gray-400">Robert Zhang</span>
                  </div>
                  <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50">
                    6500 XP
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  Enroll Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Button 
              size="lg" 
              variant="outline"
              className="border-indigo-500 text-indigo-400 hover:bg-indigo-950"
              onClick={() => setShowLoginModal(true)}
            >
              Explore All Courses
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Hear from our community about their learning journey with ElevateEd
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "The gamified learning experience kept me motivated throughout my course. I've earned several badges and significantly improved my coding skills."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full border-2 border-indigo-500" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Sarah Johnson" 
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Sarah Johnson</h3>
                  <p className="text-sm text-indigo-400">Web Development Student</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "The live sessions were incredibly helpful. Being able to ask questions in real-time made complex topics much easier to understand."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full border-2 border-indigo-500" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Michael Rodriguez" 
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Michael Rodriguez</h3>
                  <p className="text-sm text-indigo-400">Data Science Student</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "I love the built-in compiler. Being able to practice code right in the browser without additional setup made learning to code much more accessible."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full border-2 border-indigo-500" 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Emily Chen" 
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Emily Chen</h3>
                  <p className="text-sm text-indigo-400">Python Programming Student</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
              Join thousands of students already learning on our platform
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-gray-100"
                onClick={() => setShowLoginModal(true)}
              >
                Sign Up Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-indigo-800"
                onClick={() => setShowLoginModal(true)}
              >
                Log In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">ElevateEd</h3>
              <p className="text-gray-400 mb-4">Empowering learners worldwide with cutting-edge education technology.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-400">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Courses</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Web Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Data Science</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Mobile Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Machine Learning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">DevOps</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Partnerships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} ElevateEd. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
