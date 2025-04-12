import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import ChatWidget from "@/components/common/chat-widget";
import Home from "./home";
import ExploreCourses from "./explore-courses";
import MyCourses from "./my-courses";
import Quizzes from "./quizzes";
import Certifications from "./certifications";
import LiveSessions from "./live-sessions";
import CodeCompiler from "./code-compiler";
import Profile from "./profile";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/dashboard/:section?");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // If not authenticated, redirect to landing page
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  const section = params?.section || "home";
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Map sections to their respective components
  const renderSection = () => {
    switch (section) {
      case "home":
        return <Home />;
      case "explore":
        return <ExploreCourses />;
      case "my-courses":
        return <MyCourses />;
      case "quizzes":
        return <Quizzes />;
      case "certifications":
        return <Certifications />;
      case "live-sessions":
        return <LiveSessions />;
      case "code-compiler":
        return <CodeCompiler />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} showSidebarToggle={true} />
        
        <AnimatePresence mode="wait">
          <motion.main 
            key={section}
            className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.main>
        </AnimatePresence>
        
        <ChatWidget />
      </div>
    </div>
  );
};

export default Dashboard;
