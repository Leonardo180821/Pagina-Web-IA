import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import InputBar from './InputBar';
import { Theme, Message, ChatSession, Tool } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import SettingsModal from './SettingsModal';
import { HamburgerIcon } from './Icons';

interface ChatAppProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ChatApp: React.FC<ChatAppProps> = ({ theme, toggleTheme }) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  // Fix: Changed NodeJS.Timeout to number for browser compatibility.
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (isMobile !== mobile) {
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);


  const activeChat = chats.find(c => c.id === activeChatId);
  const isConversationActive = (activeChat?.messages?.length ?? 0) > 0;
  
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'Nuevo Chat',
      lastMessageTimestamp: new Date().toISOString(),
      preview: '',
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSendMessage = (text: string, tool: Tool) => {
    let chatToUpdateId = activeChatId;

    const newMessage: Message = {
      id: `${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // If no chat is active, create a new one
    if (!chatToUpdateId) {
      const words = text.split(' ');
      const shortTitle = words.slice(0, 4).join(' ');
      const newTitle = words.length > 4 ? `${shortTitle}...` : shortTitle;
      
      const newChat: ChatSession = {
        id: `chat-${Date.now()}`,
        title: newTitle,
        lastMessageTimestamp: new Date().toISOString(),
        preview: '',
        messages: [newMessage],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      chatToUpdateId = newChat.id;
    } else {
      // If a chat is active, update it
      setChats(currentChats =>
        currentChats.map(chat => {
          if (chat.id === chatToUpdateId) {
            const isFirstMessage = chat.messages.length === 0;
            let newTitle = chat.title;
            // Update title if it's a new, empty chat
            if (isFirstMessage && chat.title === 'Nuevo Chat') {
              const words = text.split(' ');
              const shortTitle = words.slice(0, 4).join(' ');
              newTitle = words.length > 4 ? `${shortTitle}...` : shortTitle;
            }
            return {
              ...chat,
              title: newTitle,
              messages: [...chat.messages, newMessage],
              lastMessageTimestamp: newMessage.timestamp,
            };
          }
          return chat;
        })
      );
    }

    setInputValue('');
    setIsTyping(true);

    // Mock AI response
    timeoutRef.current = window.setTimeout(() => {
      const aiResponse: Message = {
        id: `${Date.now() + 1}`,
        text: `Aquí está tu respuesta generada con la herramienta "${tool}": Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChats(currentChats =>
        currentChats.map(chat =>
          chat.id === chatToUpdateId
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        )
      );
      setIsTyping(false);
    }, 2000);
  };

  const handleStopGeneration = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTyping(false);
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    if (!activeChatId || !newText.trim()) return;

    setChats(currentChats =>
      currentChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg =>
              msg.id === messageId ? { ...msg, text: newText } : msg
            ),
          };
        }
        return chat;
      })
    );
  };
  
  const handleThemeChange = () => {
    setShowSettings(false);
    setShowConfirmModal(true);
  }

  const confirmThemeChange = () => {
    toggleTheme();
    setShowConfirmModal(false);
  }

  const handleSuggestionSelect = (text: string) => {
      if (!activeChatId) {
        handleNewChat();
      }
      setInputValue(text);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
        <AnimatePresence>
            {isMobile && sidebarOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="absolute inset-0 bg-background/50 dark:bg-black/70 z-20"
                    aria-hidden="true"
                />
            )}
        </AnimatePresence>
        
        <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            chats={chats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onNewChat={handleNewChat}
            onSettingsClick={() => setShowSettings(true)}
            isMobile={isMobile}
        />

        <motion.main 
            className="h-full w-full flex flex-col absolute inset-0"
            initial={false}
            animate={{ paddingLeft: !isMobile && sidebarOpen ? '260px' : (!isMobile && !sidebarOpen ? '72px' : '0px') }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {isMobile && (
              <div className="p-2 flex items-center shrink-0 md:hidden">
                  <button 
                    onClick={() => setSidebarOpen(true)} 
                    className="p-3 rounded-4xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    aria-label="Open sidebar"
                  >
                      <HamburgerIcon className="w-6 h-6 text-textPrimary dark:text-dark-textPrimary" />
                  </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6 md:py-8 md:px-12">
                <AnimatePresence>
                    <ChatView 
                        messages={activeChat?.messages ?? []} 
                        isTyping={isTyping} 
                        onSuggestionSelect={handleSuggestionSelect}
                        isConversationActive={isConversationActive}
                        onEditMessage={handleEditMessage}
                    />
                </AnimatePresence>
            </div>
            <InputBar 
                onSendMessage={handleSendMessage} 
                value={inputValue} 
                onChange={setInputValue}
                isConversationActive={isConversationActive}
                isTyping={isTyping}
                onStopGeneration={handleStopGeneration}
            />
        </main>
        
        <AnimatePresence>
            {showSettings && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/50 dark:bg-black/70 z-40 flex items-center justify-center"
                    onClick={() => setShowSettings(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surfaceElevated dark:bg-dark-surfaceElevated p-6 rounded-4xl shadow-soft-lift"
                    >
                       <h2 className="text-xl font-semibold mb-4 text-textPrimary dark:text-dark-textPrimary">Configuración</h2>
                        <button 
                            onClick={handleThemeChange}
                            className="w-full text-left p-3 rounded-4xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-textPrimary dark:text-dark-textPrimary"
                        >
                            Cambiar a modo {theme === 'light' ? 'oscuro' : 'claro'}
                        </button>
                    </motion.div>
                </motion.div>
            )}
            {showConfirmModal && (
                <SettingsModal
                    onConfirm={confirmThemeChange}
                    onCancel={() => setShowConfirmModal(false)}
                    theme={theme}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default ChatApp;