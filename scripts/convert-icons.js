import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import potrace from 'potrace';
import { promisify } from 'util';

const IMAGES_DIR = './public/images';
const ICONS_OUTPUT_DIR = './src/components/icons';
const UI_OUTPUT_DIR = './src/components/ui';
const TEMP_DIR = './public/images/temp';

const trace = promisify(potrace.trace);

const CONFIGS = {
  sizes: {
    icons: [16, 24, 32, 48],
    ui: [16, 24, 32, 48, 64, 96]
  },
  colors: {
    primary: {
      light: '#818cf8',
      default: '#6366f1',
      dark: '#4f46e5'
    },
    secondary: {
      light: '#a78bfa',
      default: '#8b5cf6',
      dark: '#7c3aed'
    },
    accent: {
      light: '#f472b6',
      default: '#ec4899',
      dark: '#db2777'
    },
    gray: {
      light: '#9ca3af',
      default: '#6b7280',
      dark: '#4b5563'
    }
  },
  optimizations: {
    potrace: {
      threshold: 128,
      turdSize: 2,
      alphaMax: 1,
      optCurve: true,
      optTolerance: 0.2
    }
  }
};

async function optimizeSvg(svgContent) {
  return svgContent
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*([{:}])\s*/g, '$1')
    .replace(/xml:space="preserve"/g, '')
    .replace(/\n/g, '')
    .trim();
}

async function processImage(inputPath, options = {}) {
  const {
    threshold = CONFIGS.optimizations.potrace.threshold,
    resize = 256
  } = options;

  return sharp(inputPath)
    .resize(resize, resize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toFormat('png')
    .threshold(threshold)
    .toBuffer();
}

async function convertToSvg(filename, isUiElement = false) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const baseName = path.basename(filename, '.webp')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[,()]/g, '');
  
  const outputDir = isUiElement ? UI_OUTPUT_DIR : ICONS_OUTPUT_DIR;
  
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
    
    const pngBuffer = await processImage(inputPath);
    
    const traceOptions = {
      ...CONFIGS.optimizations.potrace,
      color: CONFIGS.colors.primary.default
    };
    
    const rawSvgContent = await trace(pngBuffer, traceOptions);
    const svgContent = await optimizeSvg(rawSvgContent);
    
    await fs.mkdir(outputDir, { recursive: true });
    
    const svgPath = path.join(outputDir, `${baseName}.svg`);
    await fs.writeFile(svgPath, svgContent);
    
    const componentName = baseName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const componentContent = `import React from 'react';

interface ${componentName}Props {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'gray';
  theme?: 'light' | 'default' | 'dark';
  onClick?: () => void;
  title?: string;
}

const sizeMap = {
  sm: ${isUiElement ? 24 : 16},
  md: ${isUiElement ? 32 : 24},
  lg: ${isUiElement ? 48 : 32},
  xl: ${isUiElement ? 64 : 48}
};

const variantColors = {
  primary: {
    light: '${CONFIGS.colors.primary.light}',
    default: '${CONFIGS.colors.primary.default}',
    dark: '${CONFIGS.colors.primary.dark}'
  },
  secondary: {
    light: '${CONFIGS.colors.secondary.light}',
    default: '${CONFIGS.colors.secondary.default}',
    dark: '${CONFIGS.colors.secondary.dark}'
  },
  accent: {
    light: '${CONFIGS.colors.accent.light}',
    default: '${CONFIGS.colors.accent.default}',
    dark: '${CONFIGS.colors.accent.dark}'
  },
  gray: {
    light: '${CONFIGS.colors.gray.light}',
    default: '${CONFIGS.colors.gray.default}',
    dark: '${CONFIGS.colors.gray.dark}'
  }
};

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  size = 'md',
  color,
  className = '',
  variant = 'primary',
  theme = 'default',
  onClick,
  title
}) => {
  const finalSize = typeof size === 'number' ? size : sizeMap[size];
  const finalColor = color || variantColors[variant][theme];

  return (
    <svg 
      width={finalSize} 
      height={finalSize} 
      viewBox="0 0 256 256" 
      fill={finalColor}
      className={\`transition-colors duration-200 \${className}\`}
      role="${isUiElement ? 'img' : 'presentation'}"
      aria-hidden={!title}
      aria-label={title}
      onClick={onClick}
      {...(title && { 'data-tooltip': title })}
    >
      ${svgContent}
    </svg>
  );
};

export const Memoized${componentName} = React.memo(${componentName});`;

    const componentPath = path.join(outputDir, `${componentName}.tsx`);
    await fs.writeFile(componentPath, componentContent);
    
    const typesContent = `import { ${componentName}Props } from './${componentName}';

export type { ${componentName}Props };`;

    const typesPath = path.join(outputDir, `${componentName}.types.ts`);
    await fs.writeFile(typesPath, typesContent);
    
    console.log(`✅ Convertido: ${filename}`);
    console.log(`   → Componente: ${componentName}.tsx`);
    console.log(`   → Tipos: ${componentName}.types.ts`);
    console.log(`   → SVG: ${baseName}.svg\n`);
    
    return {
      name: componentName,
      type: isUiElement ? 'ui' : 'icon'
    };
  } catch (error) {
    console.error(`❌ Error convirtiendo ${filename}:`, error.message);
    return null;
  }
}

async function createIndexFile(directory, components) {
  const validComponents = components.filter(Boolean);
  if (validComponents.length === 0) return;

  const typeExports = validComponents
    .map(comp => `export type { ${comp.name}Props } from './${comp.name}.types';`)
    .join('\n');

  const componentExports = validComponents
    .map(comp => `export { ${comp.name}, Memoized${comp.name} } from './${comp.name}';`)
    .join('\n');

  const indexContent = `// Tipos
${typeExports}

// Componentes
${componentExports}`;
  
  await fs.writeFile(path.join(directory, 'index.ts'), indexContent);
}

async function cleanup() {
  try {
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  } catch (error) {
    console.error('Error en limpieza:', error.message);
  }
}

async function main() {
  try {
    console.log('\n🎨 Iniciando conversión de iconos y elementos UI...\n');
    
    const files = await fs.readdir(IMAGES_DIR);
    const iconComponents = [];
    const uiComponents = [];
    
    for (const file of files) {
      if (file.endsWith('.webp')) {
        if (file.includes('node-icons')) {
          const component = await convertToSvg(file, false);
          iconComponents.push(component);
        } else if (file.includes('UI Elements')) {
          const component = await convertToSvg(file, true);
          uiComponents.push(component);
        }
      }
    }
    
    await createIndexFile(ICONS_OUTPUT_DIR, iconComponents);
    await createIndexFile(UI_OUTPUT_DIR, uiComponents);
    
    await cleanup();
    
    console.log('\n✨ Proceso completado con éxito!\n');
    
    console.log('📊 Resumen:');
    console.log(`   Iconos convertidos: ${iconComponents.length}`);
    console.log(`   Elementos UI convertidos: ${uiComponents.length}`);
    console.log(`   Total componentes: ${iconComponents.length + uiComponents.length}\n`);
  } catch (error) {
    console.error('❌ Error:', error);
    await cleanup();
  }
}

main(); 