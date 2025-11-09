import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { Message } from '../types';
import { SparklesIcon } from './Icons';

interface ChatViewProps {
  messages: Message[];
  isTyping: boolean;
  onSuggestionSelect: (text: string) => void;
  isConversationActive: boolean;
  onEditMessage: (messageId: string, newText: string) => void;
}

const TypingIndicator: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-start gap-4"
    >
        <div className="w-8 h-8 rounded-full bg-surfaceSecondary dark:bg-dark-surfaceSecondary flex items-center justify-center flex-shrink-0 border border-borderSubtle dark:border-dark-borderSubtle">
            <SparklesIcon className="w-5 h-5 text-accent dark:text-dark-accent" />
        </div>
        <div className="flex items-center" style={{ minHeight: '32px' }}>
            <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </motion.div>
);


const EmptyState: React.FC<{ onSuggestionSelect: (text: string) => void }> = ({ onSuggestionSelect }) => {
    const suggestions = [
        'Crea un guion para un reel de 15s',
        'Dame 5 ideas de contenido sobre marketing',
        'Analiza esta métrica de TikTok',
        'Escribe un plan de contenido para Instagram'
    ];
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-5xl font-extrabold mb-12 text-gradient-modern md:leading-normal"
            >
                ¿Cómo puedo ayudarte hoy?
            </motion.h2>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.5,
                        },
                    },
                }}
            >
                {suggestions.map((s, i) => (
                    <motion.button
                        key={i}
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        onClick={() => onSuggestionSelect(s)}
                        className="suggestion-card p-5 bg-surfaceElevated dark:bg-dark-surfaceElevated rounded-4xl text-left border border-borderSubtle dark:border-dark-borderSubtle shadow-sm cursor-pointer"
                    >
                        <p className="text-textPrimary dark:text-dark-textPrimary font-medium">{s}</p>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

const ChatView: React.FC<ChatViewProps> = ({ messages, isTyping, onSuggestionSelect, isConversationActive, onEditMessage }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  if (messages.length === 0 && !isTyping) {
      return <EmptyState onSuggestionSelect={onSuggestionSelect} />
  }

  return (
    <div className={`mx-auto w-full transition-[max-width] duration-300 ease-in-out ${isConversationActive ? 'max-w-4xl' : 'max-w-3xl'}`}>
        <div className="space-y-8">
            <AnimatePresence>
                {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onEdit={onEditMessage} />
                ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator />}
            <div ref={endOfMessagesRef} />
        </div>
    </div>
  );
};

export default ChatView;