import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation = ({ onLoginClick }: NavigationProps) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-500">Fantasy Tales Universe</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link flex items-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
            <Link to="/biblioteca" className="nav-link flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5" />
              <span>Biblioteca</span>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Perfil" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 p-1 rounded-full bg-gray-700" />
                  )}
                  <span className="hidden sm:inline">{currentUser.displayName || currentUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 