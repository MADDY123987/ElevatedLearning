import { useState } from "react";
import { useThemeToggle } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import LoginModal from "@/pages/login-modal";

type NavbarProps = {
  toggleSidebar?: () => void;
  showSidebarToggle?: boolean;
};

const Navbar = ({ toggleSidebar, showSidebarToggle = false }: NavbarProps) => {
  const { theme, toggleTheme } = useThemeToggle();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [location] = useLocation();
  
  const isDashboard = location.startsWith('/dashboard');

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {showSidebarToggle && (
                <button 
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600 dark:text-white">Elevated</span>
              </Link>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center ml-4">
                  {!isDashboard && (
                    <Link href="/dashboard">
                      <Button className="mr-4">Dashboard</Button>
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    {user?.avatarUrl && (
                      <img 
                        src={user.avatarUrl} 
                        alt={`${user.username}'s avatar`} 
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline-block">
                      {user?.username}
                    </span>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowLoginModal(true)} 
                  className="ml-4"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </>
  );
};

export default Navbar;
