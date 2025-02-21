import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as Icons from '../index';
import { NodeIconsIconosCósmicos } from '../NodeIconsIconosCósmicos';

describe('Componentes de Iconos', () => {
  // Tests genéricos para todos los componentes de iconos
  Object.entries(Icons).forEach(([name, Component]) => {
    // Saltamos los tipos, componentes memorizados y NodeIconsIconosCósmicos
    if (name.includes('Props') || name.includes('Memoized') || name === 'NodeIconsIconosCósmicos') return;

    describe(`${name}`, () => {
      describe('Renderizado y props básicos', () => {
        it('se renderiza correctamente con props por defecto', () => {
          render(<Component />);
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toBeInTheDocument();
          expect(icon).toHaveAttribute('width', '24');
          expect(icon).toHaveAttribute('height', '24');
          expect(icon).toHaveAttribute('aria-hidden', 'true');
        });

        it('aplica el tamaño correcto según la prop size', () => {
          const { rerender } = render(<Component size="sm" />);
          let icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('width', '16');
          expect(icon).toHaveAttribute('height', '16');

          rerender(<Component size="lg" />);
          icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('width', '48');
          expect(icon).toHaveAttribute('height', '48');

          rerender(<Component size={40} />);
          icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('width', '40');
          expect(icon).toHaveAttribute('height', '40');
        });
      });

      describe('Temas y colores', () => {
        it('aplica el color según la variante y tema', () => {
          const { rerender } = render(<Component variant="primary" theme="light" />);
          let icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#818cf8');

          rerender(<Component variant="primary" theme="dark" />);
          icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#4f46e5');
        });

        it('maneja múltiples variantes de tema', () => {
          const { rerender } = render(<Component variant="accent" theme="light" />);
          let icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#f472b6');

          rerender(<Component variant="accent" theme="dark" />);
          icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#ec4899');

          rerender(<Component variant="gray" theme="light" />);
          icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#9ca3af');
        });

        it('permite color personalizado', () => {
          render(<Component color="#FF00FF" />);
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveAttribute('fill', '#FF00FF');
        });
      });

      describe('Interactividad y accesibilidad', () => {
        it('maneja eventos de click', () => {
          const handleClick = vi.fn();
          render(<Component onClick={handleClick} />);
          const icon = screen.getByRole('img', { hidden: true });
          fireEvent.click(icon);
          expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('maneja tooltips y accesibilidad correctamente', () => {
          const tooltipText = 'Icono de prueba';
          render(<Component title={tooltipText} />);
          const icon = screen.getByRole('img');
          expect(icon).toHaveAttribute('aria-label', tooltipText);
          expect(icon).toHaveAttribute('data-tooltip', tooltipText);
          expect(icon).toHaveAttribute('aria-hidden', 'false');
        });

        it('maneja estados interactivos con clases de Tailwind', () => {
          render(
            <Component 
              className="hover:opacity-80 active:scale-95"
              onClick={() => {}}
            />
          );
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveClass('hover:opacity-80', 'active:scale-95');
        });
      });

      describe('Estilos y clases', () => {
        it('aplica estilos de transición por defecto', () => {
          render(<Component />);
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveClass('transition-colors', 'duration-200');
        });

        it('permite sobreescribir estilos por defecto', () => {
          render(
            <Component 
              className="transition-transform duration-300 ease-out"
            />
          );
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveClass('transition-transform', 'duration-300', 'ease-out');
        });

        it('combina clases personalizadas con las predeterminadas', () => {
          render(<Component className="custom-class" />);
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toHaveClass('transition-colors', 'duration-200', 'custom-class');
        });
      });
    });
  });

  // Tests específicos para NodeIconsIconosCósmicos
  describe('NodeIconsIconosCósmicos', () => {
    describe('Renderizado y props básicos', () => {
      it('renderiza con props por defecto', () => {
        render(<NodeIconsIconosCósmicos />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });

      it('aplica el tamaño basado en el prop size', () => {
        render(<NodeIconsIconosCósmicos size="lg" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
      });
    });

    describe('Temas y colores', () => {
      it('aplica el color del tema basado en variant y theme', () => {
        render(<NodeIconsIconosCósmicos variant="primary" theme="light" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('fill', '#818cf8');
      });

      it('aplica el color personalizado cuando se proporciona', () => {
        render(<NodeIconsIconosCósmicos color="#FF0000" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('fill', '#FF0000');
      });
    });

    describe('Interactividad y accesibilidad', () => {
      it('maneja el evento onClick', () => {
        const handleClick = vi.fn();
        render(<NodeIconsIconosCósmicos onClick={handleClick} />);
        const svg = screen.getByRole('img', { hidden: true });
        fireEvent.click(svg);
        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it('maneja la accesibilidad correctamente con title', () => {
        render(<NodeIconsIconosCósmicos title="Icono de prueba" />);
        const svg = screen.getByRole('img');
        expect(svg).toHaveAttribute('aria-label', 'Icono de prueba');
        expect(svg).toHaveAttribute('aria-hidden', 'false');
        expect(svg).toHaveAttribute('data-tooltip', 'Icono de prueba');
      });

      it('maneja la accesibilidad correctamente sin title', () => {
        render(<NodeIconsIconosCósmicos />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('Estilos y clases', () => {
      it('aplica las clases CSS correctamente', () => {
        render(<NodeIconsIconosCósmicos className="test-class" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveClass('transition-colors', 'duration-200', 'test-class');
      });
    });
  });
}); 