import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Configuración global de React
global.React = React;

// Mock de Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h1: 'h1',
    p: 'p',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
})); 