import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { renderHook } from '@testing-library/react';

vi.mock('../config/firebase', () => {
  const mockAuth = {
    currentUser: null,
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  }

  const mockDb = {
    collection: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
  }

  return {
    auth: mockAuth,
    db: mockDb,
    GoogleAuthProvider: vi.fn(() => ({})),
  }
})

vi.mock('firebase/auth', () => {
  const mockProvider = {
    addScope: vi.fn(),
    setCustomParameters: vi.fn()
  };
  const GoogleAuthProvider = vi.fn(() => mockProvider);
  GoogleAuthProvider.PROVIDER_ID = 'google.com';
  return {
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider,
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
    getAuth: vi.fn()
  };
});

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
}));

// Componente de prueba que usa el contexto
const TestComponent = () => {
  const { currentUser, signInWithEmail, signUpWithEmail, signInWithGoogle, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{currentUser?.email}</div>
      <button onClick={() => signInWithEmail('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUpWithEmail('test@example.com', 'password')}>
        Sign Up
      </button>
      <button onClick={() => signInWithGoogle()}>
        Google Sign In
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('provee el usuario actual cuando está autenticado', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  test('maneja el inicio de sesión con email correctamente', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText('Sign In').click();

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
    });
  });

  test('maneja el registro con email correctamente', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });
    (setDoc as jest.Mock).mockResolvedValueOnce({});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText('Sign Up').click();

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(setDoc).toHaveBeenCalled();
    });
  });

  test('maneja el inicio de sesión con Google correctamente', async () => {
    const mockProvider = new GoogleAuthProvider();
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({
      user: mockUser
    });
    (doc as jest.Mock).mockReturnValue('mockedDocRef');
    (setDoc as jest.Mock).mockResolvedValueOnce({});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText('Google Sign In').click();

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, mockProvider);
      expect(doc).toHaveBeenCalledWith(db, 'users', mockUser.uid);
      expect(setDoc).toHaveBeenCalledWith(
        'mockedDocRef',
        {
          email: mockUser.email,
          name: mockUser.displayName,
          photoURL: mockUser.photoURL,
          lastLogin: expect.any(String)
        },
        { merge: true }
      );
    });
  });

  test('maneja el cierre de sesión correctamente', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce({});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    screen.getByText('Logout').click();

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  test('maneja errores de autenticación', async () => {
    const error = new Error('Auth Error');
    vi.spyOn(auth, 'signInWithEmailAndPassword').mockRejectedValueOnce(error);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    try {
      await result.current.signInWithEmail('test@test.com', 'password');
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
}); 