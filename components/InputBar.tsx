import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Tool } from '../types';
import { PlusIcon, MicIcon, SendIcon, ScreenwriterIcon, PlannerIcon, IdeasIcon, GeneralIcon, StopIcon } from './Icons';
import ToolPopover from './ToolPopover';

interface InputBarProps {
  onSendMessage: (text: string, tool: Tool) => void;
  value: string;
  onChange: (value: string) => void;
  isConversationActive: boolean;
  isTyping: boolean;
  onStopGeneration: () => void;
}

const getActiveToolIcon = (tool: Tool, props: any) => {
    switch (tool) {
        case Tool.Screenwriter: return <ScreenwriterIcon {...props} />;
        case Tool.Planner: return <PlannerIcon {...props} />;
        case Tool.Ideas: return <IdeasIcon {...props} />;
        case Tool.General:
        default:
            return <PlusIcon {...props} />;
    }
};

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, value, onChange, isConversationActive, isTyping, onStopGeneration }) => {
  const [tool, setTool] = useState<Tool>(Tool.General);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 128; // Corresponds to approx 5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (value.trim()) {
      onSendMessage(value, tool);
      resetTranscript();
    }
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    }
  };
  
  const placeholderText = isTyping ? "Generando respuesta..." : (tool === Tool.General ? "Escribe tu petición para Ideas..." : `Escribe tu petición para ${tool}...`);

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-4 text-center text-red-500">El reconocimiento de voz no es compatible con este navegador.</div>;
  }

  return (
    <div className="p-4 md:px-6 pb-6 md:pb-8 sticky bottom-0 z-10">
      <div 
        className={`relative glass-input-container rounded-5xl mx-auto transition-[max-width] duration-300 ease-in-out ${isConversationActive ? 'max-w-4xl' : 'max-w-3xl'} ${isFocused ? 'focus-within-active' : ''}`}
      >
        <div className="relative bg-transparent p-2.5 rounded-5xl flex flex-col">
          <div className="flex items-start w-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  }
              }}
              placeholder={placeholderText}
              rows={1}
              className="flex-grow w-full py-3 px-4 bg-transparent resize-none border-none focus:outline-none text-textPrimary dark:text-dark-textPrimary placeholder-textTertiary dark:placeholder-dark-textTertiary max-h-32 text-lg disabled:opacity-50"
              disabled={isTyping}
            />
          </div>
          <div className="flex items-center justify-between mt-1 px-1">
              <div className="relative flex-shrink-0">
                  <motion.button
                      onClick={() => !isTyping && setPopoverOpen(!isPopoverOpen)}
                      className="w-11 h-11 rounded-full bg-transparent hover:bg-borderSubtle dark:hover:bg-dark-borderSubtle text-textSecondary dark:text-dark-textSecondary hover:text-textPrimary dark:hover:text-dark-textPrimary flex items-center justify-center transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Seleccionar herramienta"
                      disabled={isTyping}
                  >
                     <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={tool}
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {getActiveToolIcon(tool, { className: `w-6 h-6 transition-transform duration-200 ${isPopoverOpen ? (tool === Tool.General ? 'rotate-135' : 'rotate-12') : ''}` })}
                        </motion.div>
                    </AnimatePresence>
                  </motion.button>
                  <AnimatePresence>
                      {isPopoverOpen && <ToolPopover selectedTool={tool} onSelectTool={(selected) => { setTool(selected); setPopoverOpen(false); }} onClose={() => setPopoverOpen(false)} />}
                  </AnimatePresence>
              </div>
              <div className="flex items-center gap-3">
                  <AnimatePresence mode="popLayout">
                     {isTyping ? (
                        <motion.button
                            key="stop"
                            onClick={onStopGeneration}
                            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 bg-white dark:bg-dark-surfaceElevated hover:bg-gray-200 dark:hover:bg-dark-surfaceSecondary shadow-md"
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                             aria-label="Detener generación"
                        >
                           <StopIcon className="w-6 h-6 text-black dark:text-dark-textPrimary" />
                        </motion.button>
                     ) : value.trim() ? (
                        <motion.button
                            key="send"
                            onClick={handleSend}
                            className="send-button flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-accent dark:bg-dark-accent text-accent-text dark:text-dark-accent-text hover:bg-accentHover dark:hover:bg-dark-accentHover"
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                             aria-label="Enviar mensaje"
                        >
                            <SendIcon className="w-7 h-7" />
                        </motion.button>
                    ) : (
                        <motion.button
                            key="mic"
                            onClick={handleMicClick}
                            className={`mic-icon-btn flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300 ${listening ? 'bg-accent dark:bg-dark-accent text-accent-text dark:text-dark-accent-text animate-pulse' : 'hover:bg-borderSubtle dark:hover:bg-dark-borderSubtle text-textSecondary dark:text-dark-textSecondary hover:text-textPrimary dark:hover:text-dark-textPrimary'}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                             aria-label="Usar micrófono"
                        >
                            <MicIcon className="mic-icon w-6 h-6" />
                        </motion.button>
                    )}
                   </AnimatePresence>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBar;