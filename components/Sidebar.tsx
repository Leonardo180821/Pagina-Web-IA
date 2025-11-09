import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HamburgerIcon, PlusIcon, SettingsIcon, SparklesIcon } from './Icons';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  chats: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  onNewChat: () => void;
  onSettingsClick: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, chats, activeChatId, setActiveChatId, onNewChat, onSettingsClick, isMobile }) => {

  return (
    <motion.aside
      initial={false}
      animate={
        isMobile
          ? { x: isOpen ? '0%' : '-100%' }
          : { width: isOpen ? '260px' : '72px' }
      }
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`absolute h-full bg-surfaceSecondary dark:bg-dark-surfaceSecondary flex flex-col z-30 border-r border-borderSubtle dark:border-dark-borderSubtle
        ${isOpen ? 'p-4' : 'p-3 items-center'}
        ${isMobile ? 'w-[260px]' : ''}
      `}
    >
      <div className={`w-full flex items-center mb-4 pb-4 border-b border-borderSubtle dark:border-dark-borderSubtle ${isOpen ? 'justify-between' : 'justify-center'}`}>
        <AnimatePresence>
            {isOpen && (
                 <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2"
                >
                    <SparklesIcon className="w-6 h-6 text-accent dark:text-dark-accent" />
                    <span className="font-bold text-lg text-textPrimary dark:text-dark-textPrimary whitespace-nowrap">Patricia AI</span>
                </motion.div>
            )}
        </AnimatePresence>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <HamburgerIcon className="w-6 h-6 text-textPrimary dark:text-dark-textPrimary" />
        </button>
      </div>

       <button onClick={onNewChat} className={`group flex items-center w-full p-3 my-2 rounded-3xl transition-colors overflow-hidden bg-black/5 dark:bg-white/5 hover:bg-accent/10 dark:hover:bg-dark-accent/10 ${!isOpen && 'justify-center'}`}>
          <div className="flex-shrink-0">
              <PlusIcon className="w-5 h-5 text-textSecondary dark:text-dark-textSecondary transition-colors group-hover:text-accent dark:group-hover:text-dark-accent" />
          </div>
          <AnimatePresence>
          {isOpen && (
              <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto', transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 font-medium text-textPrimary dark:text-dark-textPrimary transition-colors group-hover:text-accent dark:group-hover:text-dark-accent whitespace-nowrap"
              >
                  Nuevo chat
              </motion.span>
          )}
          </AnimatePresence>
      </button>


      <div className="flex-1 overflow-y-auto -mr-3 pr-2">
        <AnimatePresence>
          {isOpen && chats.map(chat => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setActiveChatId(chat.id);
                if (isMobile) {
                  toggleSidebar();
                }
              }}
              className={`w-full text-left p-3 my-1 rounded-2xl cursor-pointer transition-colors duration-200 truncate ${
                activeChatId === chat.id
                  ? 'bg-black/10 dark:bg-dark-surfaceElevated text-textPrimary dark:text-dark-textPrimary font-semibold'
                  : 'text-textSecondary dark:text-dark-textSecondary hover:bg-black/5 dark:hover:bg-dark-surfaceElevated/50 hover:text-textPrimary dark:hover:text-dark-textPrimary'
              }`}
            >
              {chat.title}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-4 border-t border-borderSubtle dark:border-dark-borderSubtle space-y-3">
        <button onClick={onSettingsClick} className={`group flex items-center w-full p-3 rounded-3xl transition-colors overflow-hidden hover:bg-accent/10 dark:hover:bg-dark-accent/10 ${!isOpen && 'justify-center'}`}>
            <div className="flex-shrink-0">
                <SettingsIcon className="w-6 h-6 text-textSecondary dark:text-dark-textSecondary transition-colors group-hover:text-accent dark:group-hover:text-dark-accent" />
            </div>
            <AnimatePresence>
            {isOpen && (
                <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto', transition: { delay: 0.1 } }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium text-textPrimary/80 dark:text-dark-textPrimary/80 transition-colors group-hover:text-accent dark:group-hover:text-dark-accent whitespace-nowrap"
                >
                    Configuración
                </motion.span>
            )}
            </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;