import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = './public/images';

const EXPECTED_DIMENSIONS = {
  // Imágenes para historias (800x600)
  'portal-worlds.jpg': { width: 800, height: 600 },
  'time-chronicles.jpg': { width: 800, height: 600 },
  'ancient-magic.jpg': { width: 800, height: 600 },
  
  // Assets para el Hero Banner (1920x1080)
  'cosmic-particles.png': { width: 1920, height: 1080 },
  'portal-glow.png': { width: 1920, height: 1080 },
  'background-stars.jpg': { width: 1920, height: 1080 },
  
  // Avatares (200x200)
  'default-avatar.jpg': { width: 200, height: 200 },
  'author-placeholder.jpg': { width: 200, height: 200 }
};

async function verifyImage(filename) {
  const filePath = path.join(IMAGES_DIR, filename);
  const expected = EXPECTED_DIMENSIONS[filename];
  
  if (!expected) {
    return; // Ignorar archivos que no necesitan verificación
  }

  try {
    const metadata = await sharp(filePath).metadata();
    const status = {
      dimensions: metadata.width === expected.width && metadata.height === expected.height,
      format: metadata.format.toLowerCase(),
      size: Math.round(metadata.size / 1024) + 'KB'
    };

    if (status.dimensions) {
      console.log(`✅ ${filename}`);
      console.log(`   Dimensiones: ${metadata.width}x${metadata.height} (correcto)`);
      console.log(`   Formato: ${status.format}`);
      console.log(`   Tamaño: ${status.size}\n`);
    } else {
      console.log(`❌ ${filename}`);
      console.log(`   Dimensiones actuales: ${metadata.width}x${metadata.height}`);
      console.log(`   Dimensiones esperadas: ${expected.width}x${expected.height}`);
      console.log(`   Formato: ${status.format}`);
      console.log(`   Tamaño: ${status.size}\n`);
    }

    return status;
  } catch (error) {
    console.error(`❌ Error verificando ${filename}:`, error.message, '\n');
    return null;
  }
}

async function main() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    let allCorrect = true;
    
    console.log('\n🔍 Verificando imágenes...\n');
    
    for (const file of files) {
      if (EXPECTED_DIMENSIONS[file]) {
        const status = await verifyImage(file);
        if (status && !status.dimensions) {
          allCorrect = false;
        }
      }
    }
    
    console.log(allCorrect ? '✨ Todas las imágenes están correctas' : '⚠️ Algunas imágenes necesitan ajustes');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 