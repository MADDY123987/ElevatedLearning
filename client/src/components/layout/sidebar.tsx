import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { 
  Home, 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Video, 
  Code, 
  User, 
  LogOut,
  X
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth();
  const [location] = useLocation();
  const [activeItem, setActiveItem] = useState("");
  
  // Set active item based on current location
  useEffect(() => {
    const path = location.split("/")[2] || "home";
    setActiveItem(path);
  }, [location]);
  
  // Close sidebar on mobile when navigating
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  const navItems = [
    { name: "home", label: "Home", icon: <Home className="h-5 w-5 mr-3" /> },
    { name: "explore", label: "Explore Courses", icon: <Compass className="h-5 w-5 mr-3" /> },
    { name: "my-courses", label: "My Courses", icon: <BookOpen className="h-5 w-5 mr-3" /> },
    { name: "quizzes", label: "Quizzes", icon: <HelpCircle className="h-5 w-5 mr-3" /> },
    { name: "certifications", label: "Certifications", icon: <Award className="h-5 w-5 mr-3" /> },
    { name: "live-sessions", label: "Live Sessions", icon: <Video className="h-5 w-5 mr-3" /> },
    { name: "code-compiler", label: "Code Compiler", icon: <Code className="h-5 w-5 mr-3" /> },
    { name: "profile", label: "Profile", icon: <User className="h-5 w-5 mr-3" /> }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`bg-white dark:bg-gray-800 w-64 fixed h-full shadow-md z-50 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-2xl font-bold text-indigo-600 dark:text-white">Elevated</span>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={`/dashboard/${item.name}`}
                onClick={handleNavigation}
                className={`sidebar-link flex items-center px-4 py-3 text-gray-600 dark:text-gray-200 rounded-md ${
                  activeItem === item.name 
                    ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-white active' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            <button 
              onClick={logout}
              className="sidebar-link flex items-center w-full text-left px-4 py-3 text-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
