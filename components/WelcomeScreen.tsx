import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.h1 
        className="text-5xl md:text-7xl font-bold text-textPrimary dark:text-dark-textPrimary mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hola, soy <span className="text-accent dark:text-dark-accent">Patricia AI</span> 💫
      </motion.h1>
      <motion.p 
        className="text-lg md:text-2xl text-textSecondary dark:text-dark-textSecondary mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Tu asistente inteligente para creación de contenido.
      </motion.p>

      <motion.div
        className="w-full max-w-4xl aspect-video bg-surfaceSecondary/50 dark:bg-dark-surfaceSecondary/50 rounded-4xl border border-borderSubtle dark:border-dark-borderSubtle flex items-center justify-center transition-all duration-300 hover:ring-2 hover:ring-accent/50 dark:hover:ring-dark-accent/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <span className="text-textSecondary dark:text-dark-textSecondary">Video placeholder</span>
      </motion.div>


      <motion.button
        onClick={onStart}
        className="mt-16 px-10 py-4 text-xl font-semibold text-accent-text bg-accent dark:bg-dark-accent rounded-4xl transform hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        whileHover={{
            boxShadow: "0 8px 30px rgba(124, 58, 237, 0.4)"
        }}
      >
        Comenzar
      </motion.button>
    </div>
  );
};

export default WelcomeScreen;