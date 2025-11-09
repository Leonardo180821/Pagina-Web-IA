import React from 'react';
import { motion } from 'framer-motion';
import { Tool } from '../types';
import { ScreenwriterIcon, PlannerIcon, IdeasIcon, GeneralIcon } from './Icons';

interface ToolPopoverProps {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  onClose: () => void;
}

const tools = [
  { id: Tool.General, icon: <GeneralIcon className="w-5 h-5" /> },
  { id: Tool.Screenwriter, icon: <ScreenwriterIcon className="w-5 h-5" /> },
  { id: Tool.Planner, icon: <PlannerIcon className="w-5 h-5" /> },
  { id: Tool.Ideas, icon: <IdeasIcon className="w-5 h-5" /> },
];

const ToolPopover: React.FC<ToolPopoverProps> = ({ selectedTool, onSelectTool, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-full mb-3 w-48 bg-surfaceElevated dark:bg-dark-surfaceElevated rounded-4xl p-2 z-20 border border-borderSubtle dark:border-dark-borderSubtle shadow-soft-lift"
    >
      {tools.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => {
            onSelectTool(id);
          }}
          className={`w-full flex items-center gap-3 p-2.5 rounded-4xl text-left transition-colors text-textPrimary dark:text-dark-textPrimary ${
            selectedTool === id ? 'bg-accent/20 dark:bg-dark-accent/20' : 'hover:bg-surfaceSecondary dark:hover:bg-dark-surfaceSecondary'
          }`}
        >
          {React.cloneElement(icon, { className: 'w-5 h-5 text-textSecondary dark:text-dark-textSecondary' })}
          <span className="font-medium text-sm">{id}</span>
        </button>
      ))}
    </motion.div>
  );
};

export default ToolPopover;