import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useChat } from '@/hooks/use-chat';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

const ChatWidget = () => {
  const { user } = useAuth();
  const { messages, isConnected, isOpen, toggleChat, closeChat, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const success = sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-30">
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className="rounded-full p-3 h-12 w-12 shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Chat container */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">Global Chat</h3>
            <button 
              onClick={closeChat}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Chat messages */}
          <ScrollArea className="h-80 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start ${message.userId === user.id ? 'justify-end' : ''}`}
                >
                  {message.userId !== user.id && (
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2 flex items-center justify-center overflow-hidden">
                      {message.userId === 1 ? (
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Madhavan"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Elevated"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <div 
                    className={`rounded-lg py-2 px-3 max-w-[75%] chat-message-new ${
                      message.userId === user.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <p className={`text-xs font-medium mb-1 ${
                      message.userId === user.id 
                        ? 'text-indigo-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.username}
                    </p>
                    <p className={`text-sm ${
                      message.userId === user.id 
                        ? 'text-white' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {message.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.userId === user.id 
                        ? 'text-indigo-200' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {format(new Date(message.sentAt), 'h:mm a')}
                    </p>
                  </div>
                  {message.userId === user.id && (
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 ml-2 flex items-center justify-center overflow-hidden">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
            <Input
              type="text"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!isConnected}
            />
            <Button 
              type="submit" 
              className="p-2 rounded-r-lg"
              disabled={!isConnected || newMessage.trim() === ''}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
