import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { CopyIcon, PencilIcon, SparklesIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, newText: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onEdit }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const handleCopy = () => {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  }
  
  const handleSaveEdit = () => {
      if (editedText.trim() && onEdit) {
          onEdit(message.id, editedText);
      }
      setIsEditing(false);
  }

  const handleCancelEdit = () => {
      setEditedText(message.text);
      setIsEditing(false);
  }

  if (isUser) {
    if (isEditing) {
      return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-end"
        >
            <div className="w-full max-w-3xl">
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-4 bg-surfaceElevated dark:bg-dark-surfaceSecondary border border-accent dark:border-dark-accent rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent resize-y text-lg leading-relaxed text-textPrimary dark:text-dark-textPrimary"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit();
                        }
                    }}
                />
                <div className="flex items-center justify-end gap-3 mt-2">
                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-semibold rounded-2xl text-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-white/5">Cancelar</button>
                    <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-semibold text-accent-text bg-accent dark:bg-dark-accent rounded-2xl hover:opacity-90">Guardar cambios</button>
                </div>
            </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full flex justify-end"
      >
        <div className="group relative flex items-end gap-2">
          <div
            className="max-w-3xl px-6 py-4 text-left bg-accent dark:bg-dark-accent rounded-3xl rounded-br-md text-accent-text dark:text-dark-accent-text shadow-sm"
          >
            <p className="whitespace-pre-wrap break-all text-lg leading-relaxed">{message.text}</p>
          </div>
          <div className="flex flex-col mb-1 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <button
                onClick={() => {
                    setEditedText(message.text);
                    setIsEditing(true);
                }}
                className="p-2 rounded-full text-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Editar mensaje"
             >
                <PencilIcon className="w-4 h-4" />
             </button>
             <button
                onClick={handleCopy}
                className="p-2 rounded-full text-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={copied ? 'Copiado' : 'Copiar texto'}
             >
                <CopyIcon className="w-4 h-4" />
             </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI Message Layout
  return (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full flex justify-start"
    >
        <div className="group flex items-start gap-4 max-w-4xl">
             <div className="w-8 h-8 rounded-full bg-surfaceSecondary dark:bg-dark-surfaceSecondary flex items-center justify-center flex-shrink-0 border border-borderSubtle dark:border-dark-borderSubtle">
                <SparklesIcon className="w-5 h-5 text-accent dark:text-dark-accent" />
            </div>
            <div className="flex flex-col items-start">
                <div className="pt-1">
                  <p className="whitespace-pre-wrap break-all text-lg leading-relaxed text-textPrimary dark:text-dark-textPrimary">
                      {message.text}
                  </p>
                </div>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={handleCopy}
                        className="p-2 rounded-full text-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-white/10"
                        aria-label={copied ? 'Copiado' : 'Copiar texto'}
                    >
                        <CopyIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default MessageBubble;