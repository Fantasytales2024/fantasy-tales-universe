import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, SunIcon, MoonIcon, TextIcon } from '@heroicons/react/24/outline';

interface StoryReaderProps {
  story: {
    title: string;
    author: string;
    content?: string;
  };
  onClose: () => void;
}

const StoryReader = ({ story, onClose }: StoryReaderProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontFamily, setFontFamily] = useState('serif');

  const fonts = [
    { name: 'Serif', value: 'serif' },
    { name: 'Sans Serif', value: 'sans-serif' },
    { name: 'Monospace', value: 'monospace' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Barra de herramientas */}
        <div className="sticky top-0 z-50 bg-gray-800 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white truncate">
              {story.title}
            </h2>
            <div className="flex items-center space-x-4">
              {/* Control de fuente */}
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="bg-gray-700 rounded px-2 py-1 text-sm text-white"
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>

              {/* Control de tamaño */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(size => Math.max(12, size - 2))}
                  className="text-white hover:text-primary-400"
                >
                  A-
                </button>
                <span className="text-white">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(size => Math.min(24, size + 2))}
                  className="text-white hover:text-primary-400"
                >
                  A+
                </button>
              </div>

              {/* Toggle modo oscuro */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:text-primary-400"
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="text-white hover:text-primary-400"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div
            className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              color: isDarkMode ? '#D1D5DB' : '#1F2937'
            }}
          >
            <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
            <p className="text-lg mb-8">por {story.author}</p>
            <div className="leading-relaxed">
              {story.content || 
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryReader; 