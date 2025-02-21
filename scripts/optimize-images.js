import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = './public/images';
const BACKUP_DIR = './public/images/originals';

const COMPRESSION_CONFIG = {
  jpeg: {
    quality: 80,
    progressive: true,
    mozjpeg: true
  },
  png: {
    quality: 80,
    compressionLevel: 9,
    palette: true
  },
  webp: {
    quality: 80,
    effort: 6,
    lossless: false
  }
};

async function optimizeImage(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);
  const fileExt = path.extname(filename).toLowerCase().slice(1);
  
  try {
    // Crear backup si no existe
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    try {
      await fs.access(backupPath);
    } catch {
      await fs.copyFile(inputPath, backupPath);
    }
    
    // Obtener metadata
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await fs.stat(inputPath)).size;
    
    // Optimizar según formato
    let pipeline = sharp(inputPath);
    
    switch(fileExt) {
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg(COMPRESSION_CONFIG.jpeg);
        break;
      case 'png':
        pipeline = pipeline.png(COMPRESSION_CONFIG.png);
        break;
      case 'webp':
        pipeline = pipeline.webp(COMPRESSION_CONFIG.webp);
        break;
      default:
        console.log(`⚠️ Formato no soportado: ${filename}`);
        return;
    }
    
    // Guardar imagen optimizada
    await pipeline.toFile(inputPath + '.tmp');
    
    // Verificar tamaño
    const newSize = (await fs.stat(inputPath + '.tmp')).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    // Reemplazar original si se logró reducir
    if (newSize < originalSize) {
      await fs.rename(inputPath + '.tmp', inputPath);
      console.log(`✅ Optimizada: ${filename}`);
      console.log(`   Tamaño original: ${(originalSize/1024).toFixed(2)}KB`);
      console.log(`   Nuevo tamaño: ${(newSize/1024).toFixed(2)}KB`);
      console.log(`   Ahorro: ${savings}%\n`);
    } else {
      await fs.unlink(inputPath + '.tmp');
      console.log(`ℹ️ No se optimizó: ${filename} (ya está optimizada)\n`);
    }
  } catch (error) {
    console.error(`❌ Error optimizando ${filename}:`, error.message);
    // Limpiar archivo temporal si existe
    try {
      await fs.unlink(inputPath + '.tmp');
    } catch {}
  }
}

async function main() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    
    console.log('\n🔍 Optimizando imágenes...\n');
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        await optimizeImage(file);
      }
    }
    
    console.log('✨ Proceso completado');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 