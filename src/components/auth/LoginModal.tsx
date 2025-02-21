import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError('Error en la autenticación. Por favor, intenta de nuevo.');
      console.error(err);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-500 text-sm">
                {error}
              </div>
            )}

            <form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              role="form"
            >
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors duration-200"
              >
                {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-2 px-4 bg-white hover:bg-gray-100 rounded-lg text-gray-800 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                aria-label="Continuar con Google"
              >
                <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
                Continuar con Google
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-400 hover:text-primary-300"
              >
                {isLogin ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 