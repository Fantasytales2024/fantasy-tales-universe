import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CosmicPortal from '../three/CosmicPortal';

const HeroBanner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    const handleScroll = () => {
      const progress = window.scrollY / (window.innerHeight * 0.5);
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas para Three.js */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <CosmicPortal mousePosition={mousePosition} scrollProgress={scrollProgress} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Contenido y botones */}
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-6 text-white"
        >
          Fantasy Tales Universe
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Explora infinitas realidades y sumérgete en historias épicas que desafían la imaginación
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            to="/explorador" 
            className="btn-primary bg-gradient-to-r from-primary-600 to-primary-800 
                     hover:from-primary-700 hover:to-primary-900 
                     animate-pulse-slow"
          >
            Explorar Multiverso
          </Link>
          <Link 
            to="/biblioteca" 
            className="btn-primary bg-gradient-to-r from-secondary-600 to-secondary-800 
                     hover:from-secondary-700 hover:to-secondary-900 
                     animate-pulse-slow"
          >
            Leer Historias
          </Link>
          <a 
            href="https://facebook.com/groups/fantasytalesuniverse" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary bg-gradient-to-r from-blue-600 to-blue-800 
                     hover:from-blue-700 hover:to-blue-900 
                     animate-pulse-slow"
          >
            Unirse a la Comunidad
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner; 