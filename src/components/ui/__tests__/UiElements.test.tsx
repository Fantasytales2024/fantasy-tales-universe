import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as UiElements from '../index';
import { UiElementsBotonesMarcosYComponentesDeInterfaz } from '../UiElementsBotonesMarcosYComponentesDeInterfaz';

describe('Componentes UI', () => {
  // Tests genéricos para todos los componentes UI
  Object.entries(UiElements).forEach(([name, Component]) => {
    // Saltamos los tipos y componentes memorizados
    if (name.includes('Props') || name.includes('Memoized')) return;

    describe(`${name}`, () => {
      describe('Renderizado y props básicos', () => {
        it('se renderiza correctamente con props por defecto', () => {
          render(<Component />);
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toBeInTheDocument();
          expect(element).toHaveAttribute('width', '32');
          expect(element).toHaveAttribute('height', '32');
          expect(element).toHaveAttribute('aria-hidden', 'true');
        });

        it('aplica el tamaño correcto según la prop size', () => {
          const { rerender } = render(<Component size="sm" />);
          let element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('width', '24');
          expect(element).toHaveAttribute('height', '24');

          rerender(<Component size="lg" />);
          element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('width', '48');
          expect(element).toHaveAttribute('height', '48');

          rerender(<Component size={40} />);
          element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('width', '40');
          expect(element).toHaveAttribute('height', '40');
        });
      });

      describe('Temas y colores', () => {
        it('aplica los colores de tema correctamente', () => {
          const { rerender } = render(<Component variant="accent" theme="light" />);
          let element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#f472b6');

          rerender(<Component variant="accent" theme="dark" />);
          element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#ec4899');
        });

        it('maneja múltiples variantes de tema', () => {
          const { rerender } = render(<Component variant="primary" />);
          let element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#6366f1'); // default theme

          rerender(<Component variant="primary" theme="light" />);
          element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#818cf8');

          rerender(<Component variant="primary" theme="dark" />);
          element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#4f46e5');
        });

        it('permite color personalizado', () => {
          render(<Component color="#FF00FF" />);
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveAttribute('fill', '#FF00FF');
        });
      });

      describe('Interactividad y accesibilidad', () => {
        it('maneja eventos de click', () => {
          const handleClick = vi.fn();
          render(<Component onClick={handleClick} />);
          const element = screen.getByRole('img', { hidden: true });
          fireEvent.click(element);
          expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('maneja tooltips y accesibilidad correctamente', () => {
          const tooltipText = 'Elemento UI de prueba';
          render(<Component title={tooltipText} />);
          const element = screen.getByRole('img');
          expect(element).toHaveAttribute('aria-label', tooltipText);
          expect(element).toHaveAttribute('data-tooltip', tooltipText);
          expect(element).toHaveAttribute('aria-hidden', 'false');
        });

        it('maneja estados interactivos con clases de Tailwind', () => {
          render(
            <Component 
              className="hover:opacity-80 active:scale-95"
              onClick={() => {}}
            />
          );
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveClass('hover:opacity-80', 'active:scale-95');
        });
      });

      describe('Estilos y clases', () => {
        it('aplica estilos de transición por defecto', () => {
          render(<Component />);
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveClass('transition-colors', 'duration-200');
        });

        it('permite sobreescribir estilos por defecto', () => {
          render(
            <Component 
              className="transition-transform duration-300 ease-out"
            />
          );
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveClass('transition-transform', 'duration-300', 'ease-out');
        });

        it('combina clases personalizadas con las predeterminadas', () => {
          render(<Component className="custom-class" />);
          const element = screen.getByRole('img', { hidden: true });
          expect(element).toHaveClass('transition-colors', 'duration-200', 'custom-class');
        });
      });
    });
  });

  // Tests específicos para UiElementsBotonesMarcosYComponentesDeInterfaz
  describe('UiElementsBotonesMarcosYComponentesDeInterfaz', () => {
    describe('Renderizado y props básicos', () => {
      it('renderiza con props por defecto', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });

      it('aplica el tamaño basado en el prop size', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz size="lg" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('width', '48');
        expect(svg).toHaveAttribute('height', '48');
      });
    });

    describe('Temas y colores', () => {
      it('aplica el color del tema basado en variant y theme', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz variant="primary" theme="light" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('fill', '#818cf8');
      });

      it('aplica el color personalizado cuando se proporciona', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz color="#FF0000" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('fill', '#FF0000');
      });
    });

    describe('Interactividad y accesibilidad', () => {
      it('maneja el evento onClick', () => {
        const handleClick = vi.fn();
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz onClick={handleClick} />);
        const svg = screen.getByRole('img', { hidden: true });
        fireEvent.click(svg);
        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it('maneja la accesibilidad correctamente con title', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz title="Icono de prueba" />);
        const svg = screen.getByRole('img');
        expect(svg).toHaveAttribute('aria-label', 'Icono de prueba');
        expect(svg).toHaveAttribute('aria-hidden', 'false');
        expect(svg).toHaveAttribute('data-tooltip', 'Icono de prueba');
      });

      it('maneja la accesibilidad correctamente sin title', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('Estilos y clases', () => {
      it('aplica las clases CSS correctamente', () => {
        render(<UiElementsBotonesMarcosYComponentesDeInterfaz className="test-class" />);
        const svg = screen.getByRole('img', { hidden: true });
        expect(svg).toHaveClass('transition-colors', 'duration-200', 'test-class');
      });
    });
  });
}); 