import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/auth-context';

type ChatMessage = {
  id: number;
  userId: number;
  username: string;
  message: string;
  sentAt: string;
};

type WebSocketMessage = {
  type: string;
  data: any;
  message?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  // Open/close chat widget
  const toggleChat = () => setIsOpen(prev => !prev);
  const closeChat = () => setIsOpen(false);

  // Connect to WebSocket
  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    socketRef.current = new WebSocket(wsUrl);
    
    // Connection opened
    socketRef.current.addEventListener('open', () => {
      setIsConnected(true);
      console.log('WebSocket Connected');
    });
    
    // Listen for messages
    socketRef.current.addEventListener('message', (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      if (data.type === 'initial_messages') {
        setMessages(data.data);
      } else if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data.data]);
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.message);
      }
    });
    
    // Connection closed
    socketRef.current.addEventListener('close', () => {
      setIsConnected(false);
      console.log('WebSocket Disconnected');
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  // Send message function
  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !user) {
      return false;
    }
    
    socketRef.current.send(JSON.stringify({
      type: 'chat_message',
      data: {
        userId: user.id,
        username: user.username,
        message
      }
    }));
    
    return true;
  }, [user]);

  return {
    messages,
    isConnected,
    isOpen,
    toggleChat,
    closeChat,
    sendMessage
  };
}
