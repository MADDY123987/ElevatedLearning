import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";

// User type definition
type User = {
  id: number;
  username: string;
  xp: number;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
};

// Context props
type AuthContextProps = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  triggerXP: (amount: number) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  isAuthenticated: false,
  triggerXP: () => {}
});

// Provider component
export const AuthProvider = ({ 
  children, 
  triggerXP 
}: { 
  children: ReactNode;
  triggerXP: (amount: number) => void;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check for existing user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('elevated_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem('elevated_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      
      // Store user in state and localStorage
      setUser(data.user);
      localStorage.setItem('elevated_user', JSON.stringify(data.user));
      
      toast({
        title: "Welcome Back!",
        description: `Logged in as ${data.user.username}`,
      });
      
      // Redirect to dashboard
      setLocation('/dashboard');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('elevated_user');
    setLocation('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isLoading, 
        isAuthenticated: !!user,
        triggerXP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
