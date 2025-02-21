import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginModal from './LoginModal';
import { useAuth } from '../../contexts/AuthContext';

// Mock del hook useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LoginModal', () => {
  const mockSignInWithEmail = vi.fn();
  const mockSignUpWithEmail = vi.fn();
  const mockSignInWithGoogle = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signInWithEmail: mockSignInWithEmail,
      signUpWithEmail: mockSignUpWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza correctamente cuando está abierto', () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  test('no renderiza cuando está cerrado', () => {
    render(<LoginModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('heading', { name: 'Iniciar Sesión' })).not.toBeInTheDocument();
  });

  test('maneja el inicio de sesión correctamente', async () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    });
    
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('maneja el registro correctamente', async () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
    
    // Cambiar a modo registro
    fireEvent.click(screen.getByText('¿No tienes cuenta? Crear una'));
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    });
    
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(mockSignUpWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('maneja el inicio de sesión con Google correctamente', async () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Continuar con Google' }));
    
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('muestra mensaje de error cuando falla la autenticación', async () => {
    mockSignInWithEmail.mockRejectedValueOnce(new Error('Auth failed'));
    
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' },
    });
    
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText('Error en la autenticación. Por favor, intenta de nuevo.')).toBeInTheDocument();
    });
  });
}); 