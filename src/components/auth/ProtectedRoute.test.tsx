import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

// Mock del hook useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return null;
    },
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('muestra el spinner de carga cuando está cargando', () => {
    vi.mocked(useAuth).mockReturnValue({
      currentUser: null,
      loading: true,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
  });

  test('redirige a /inicio cuando no hay usuario autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      currentUser: null,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/inicio');
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
  });

  test('redirige a la ruta especificada cuando no hay usuario autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      currentUser: null,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute redirectTo="/login">
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renderiza el contenido cuando hay un usuario autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      currentUser: { email: 'test@example.com' },
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Contenido Protegido</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
}); 
