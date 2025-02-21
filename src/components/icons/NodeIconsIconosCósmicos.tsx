import React from 'react';

interface NodeIconsIconosCósmicosProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'gray';
  theme?: 'light' | 'dark';
  title?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64
};

const themeColors = {
  light: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    accent: '#f472b6',
    gray: '#9ca3af'
  },
  dark: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#ec4899',
    gray: '#4b5563'
  },
  default: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    gray: '#6b7280'
  }
};

export const NodeIconsIconosCósmicos: React.FC<NodeIconsIconosCósmicosProps> = ({ 
  size = 'md', 
  color,
  className = '',
  variant = 'primary',
  theme,
  title,
  onClick
}) => {
  const finalSize = typeof size === 'number' ? size : sizeMap[size];
  const finalColor = color || (theme ? themeColors[theme][variant] : themeColors.default[variant]);
  const defaultClasses = 'transition-colors duration-200';
  const finalClassName = `${defaultClasses} ${className}`;

  return (
    <svg 
      width={finalSize} 
      height={finalSize} 
      viewBox="0 0 256 256" 
      fill={finalColor}
      className={finalClassName}
      role="img"
      aria-hidden={!title}
      aria-label={title}
      data-tooltip={title}
      onClick={onClick}
    >
      <path d="M128 0C57.308 0 0 57.308 0 128s57.308 128 128 128 128-57.308 128-128S198.692 0 128 0zm0 240c-61.757 0-112-50.243-112-112S66.243 16 128 16s112 50.243 112 112-50.243 112-112 112z"/>
      <path d="M128 32c-52.935 0-96 43.065-96 96s43.065 96 96 96 96-43.065 96-96-43.065-96-96-96zm0 176c-44.112 0-80-35.888-80-80s35.888-80 80-80 80 35.888 80 80-35.888 80-80 80z"/>
      <path d="M128 64c-35.29 0-64 28.71-64 64s28.71 64 64 64 64-28.71 64-64-28.71-64-64-64zm0 112c-26.467 0-48-21.533-48-48s21.533-48 48-48 48 21.533 48 48-21.533 48-48 48z"/>
    </svg>
  );
}; 