import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = './public/images';
const TEMP_DIR = './public/images/temp';

const IMAGE_CONFIGS = {
  // Imágenes para historias (800x600 y versión móvil 400x300)
  'portal-worlds.jpg': { 
    desktop: { width: 800, height: 600 },
    mobile: { width: 400, height: 300, suffix: '-mobile' }
  },
  'time-chronicles.jpg': { 
    desktop: { width: 800, height: 600 },
    mobile: { width: 400, height: 300, suffix: '-mobile' }
  },
  'ancient-magic.jpg': { 
    desktop: { width: 800, height: 600 },
    mobile: { width: 400, height: 300, suffix: '-mobile' }
  },
  
  // Assets para el Hero Banner (1920x1080 y versión móvil 960x540)
  'cosmic-particles.png': { 
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 960, height: 540, suffix: '-mobile' }
  },
  'portal-glow.png': { 
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 960, height: 540, suffix: '-mobile' }
  },
  'background-stars.jpg': { 
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 960, height: 540, suffix: '-mobile' }
  },
  
  // Avatares (200x200 y versión móvil 100x100)
  'default-avatar.jpg': { 
    desktop: { width: 200, height: 200 },
    mobile: { width: 100, height: 100, suffix: '-mobile' }
  },
  'author-placeholder.jpg': { 
    desktop: { width: 200, height: 200 },
    mobile: { width: 100, height: 100, suffix: '-mobile' }
  }
};

async function processImage(filename, config) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const fileExt = path.extname(filename);
  const baseName = path.basename(filename, fileExt);
  
  try {
    // Crear directorio temporal si no existe
    await fs.mkdir(TEMP_DIR, { recursive: true });
    
    // Procesar versión desktop
    const desktopTempPath = path.join(TEMP_DIR, filename);
    await sharp(inputPath)
      .resize(config.desktop.width, config.desktop.height, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(desktopTempPath);
    
    // Mover a la ubicación final
    await fs.rename(desktopTempPath, path.join(IMAGES_DIR, filename));
    console.log(`✅ Procesada versión desktop: ${filename} (${config.desktop.width}x${config.desktop.height})`);
    
    // Procesar versión móvil
    const mobileFilename = `${baseName}${config.mobile.suffix}${fileExt}`;
    const mobileTempPath = path.join(TEMP_DIR, mobileFilename);
    await sharp(inputPath)
      .resize(config.mobile.width, config.mobile.height, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(mobileTempPath);
    
    // Mover a la ubicación final
    await fs.rename(mobileTempPath, path.join(IMAGES_DIR, mobileFilename));
    console.log(`✅ Procesada versión móvil: ${mobileFilename} (${config.mobile.width}x${config.mobile.height})`);
  } catch (error) {
    console.error(`❌ Error procesando ${filename}:`, error.message);
  }
}

async function processAuthorAvatar() {
  try {
    const inputPath = path.join(IMAGES_DIR, 'author-placeholder.jpg.webp');
    const outputPath = path.join(IMAGES_DIR, 'author-placeholder.jpg');
    
    // Primero eliminar el archivo jpg existente
    try {
      await fs.unlink(outputPath);
      console.log('✅ Archivo anterior eliminado');
    } catch (error) {
      // Ignorar error si el archivo no existe
    }
    
    await sharp(inputPath)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    console.log('✅ Avatar de autor procesado correctamente (200x200)');
    
    // Eliminar el archivo webp original
    await fs.unlink(inputPath);
    console.log('✅ Archivo webp eliminado');
  } catch (error) {
    console.error('❌ Error procesando avatar:', error.message);
  }
}

async function main() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    
    for (const file of files) {
      if (IMAGE_CONFIGS[file]) {
        await processImage(file, IMAGE_CONFIGS[file]);
      }
    }
    
    await processAuthorAvatar();
    
    // Limpiar directorio temporal
    try {
      await fs.rm(TEMP_DIR, { recursive: true });
    } catch {}
    
    console.log('\n✨ Proceso completado');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 