import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types';

interface SettingsModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    theme: Theme;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onConfirm, onCancel, theme }) => {
    const newThemeName = theme === 'light' ? 'oscuro' : 'claro';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 dark:bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surfaceSecondary dark:bg-dark-surfaceElevated p-6 rounded-4xl max-w-sm w-full text-center border border-borderSubtle dark:border-dark-borderSubtle"
            >
                <h2 className="text-xl font-bold mb-2 text-textPrimary dark:text-dark-textPrimary">Confirmar cambio</h2>
                <p className="text-textSecondary dark:text-dark-textSecondary mb-6">
                    ¿Estás seguro de que quieres cambiar al modo {newThemeName}?
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-4xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors font-semibold text-textPrimary dark:text-dark-textPrimary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-4xl bg-accent dark:bg-dark-accent hover:opacity-90 text-accent-text dark:text-dark-accent-text transition-colors font-semibold shadow-md"
                    >
                        Aceptar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SettingsModal;