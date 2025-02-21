import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Library from './pages/Library';
import LoginModal from './components/auth/LoginModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white transition-colors duration-200">
          <Navigation onLoginClick={() => setIsLoginModalOpen(true)} />
          <main className="pt-16 min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<Home />} />
              <Route path="/explorador" element={
                <ProtectedRoute>
                  {/* TODO: Implementar componente Explorador */}
                  <div>Explorador de Mundos</div>
                </ProtectedRoute>
              } />
              <Route 
                path="/biblioteca" 
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                } 
              />
              {/* Ruta 404 */}
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
          </main>
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 