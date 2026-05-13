const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const readline = require('readline');

/**
 * Verifica si un archivo tiene versión en su nombre
 * Patrón: -X.Y.Z. donde X, Y, Z son números
 * @param {string} fileName - Nombre del archivo
 * @returns {boolean} - true si tiene versión, false en caso contrario
 */
function hasVersion(fileName) {
  // Patrón para detectar versión: -X.Y.Z. donde X, Y, Z son números
  const versionPattern = /-\d+\.\d+\.\d+\./;
  return versionPattern.test(fileName);
}

/**
 * Verifica si un archivo .map está asociado a un archivo con versión
 * @param {string} fileName - Nombre del archivo .map
 * @returns {boolean} - true si el archivo base tiene versión
 */
function isMapFileForVersioned(fileName) {
  if (!fileName.endsWith('.map')) {
    return false;
  }
  // Remover la extensión .map para obtener el nombre base
  const baseName = fileName.replace(/\.map$/, '');
  return hasVersion(baseName);
}

/**
 * Extrae la versión del nombre del archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {string|null} - Versión extraída (ej: "1.0.0") o null si no tiene versión
 */
function extractVersion(fileName) {
  const versionMatch = fileName.match(/-(\d+\.\d+\.\d+)\./);
  return versionMatch ? versionMatch[1] : null;
}

/**
 * Obtiene el nombre del plugin desde el nombre del archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {string} - Nombre del plugin (ej: "archetype")
 */
function getPluginName(fileName) {
  // Extraer el nombre del plugin (parte antes de la versión o del punto)
  const match = fileName.match(/^([^-]+)/);
  return match ? match[1] : 'plugin';
}

/**
 * Verifica si un archivo debe ser copiado a legacy
 * @param {string} fileName - Nombre del archivo
 * @param {string} relativePath - Ruta relativa desde dist
 * @returns {boolean} - true si debe copiarse, false en caso contrario
 */
function shouldCopyFile(fileName, relativePath) {
  // Copiar archivos con versión
  if (hasVersion(fileName)) {
    return true;
  }
  
  // Copiar archivos .map asociados a archivos con versión
  if (isMapFileForVersioned(fileName)) {
    return true;
  }
  
  // Copiar archivos de configuración como api.json
  if (fileName === 'api.json' || (fileName.endsWith('.json') && !fileName.includes('package'))) {
    return true;
  }
  
  // Copiar archivos que están en subdirectorios (como images/, assets/, etc.)
  // Estos no son los archivos compilados principales
  if (relativePath && relativePath !== fileName) {
    return true;
  }
  
  // No copiar archivos sin versión que sean los compilados principales en la raíz
  return false;
}

/**
 * Verifica si un archivo debe sobrescribirse automáticamente sin preguntar
 * @param {string} fileName - Nombre del archivo
 * @param {string} relativePath - Ruta relativa desde dist
 * @returns {boolean} - true si debe sobrescribirse automáticamente, false si debe preguntar
 */
function shouldOverwriteAutomatically(fileName, relativePath) {
  // Sobrescribir automáticamente archivos de configuración como api.json
  if (fileName === 'api.json' || (fileName.endsWith('.json') && !fileName.includes('package'))) {
    return true;
  }
  
  // Sobrescribir automáticamente archivos que están en subdirectorios (como images/, assets/, etc.)
  if (relativePath && relativePath !== fileName) {
    return true;
  }
  
  // Para archivos con versión y sus .map, preguntar antes de sobrescribir
  return false;
}

/**
 * Pregunta al usuario si quiere sobrescribir una versión
 * @param {string} pluginName - Nombre del plugin
 * @param {string} version - Versión
 * @returns {Promise<boolean>} - true si quiere sobrescribir, false en caso contrario
 */
function askOverwriteVersion(pluginName, version) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`La versión ${pluginName}-${version} ya existe en legacy. ¿Deseas sobrescribirla? (s/n): `, (answer) => {
      rl.close();
      const shouldOverwrite = answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
      resolve(shouldOverwrite);
    });
  });
}

/**
 * Recopila todos los archivos que deben copiarse, agrupados por versión
 * @param {string} srcDir - Directorio origen
 * @param {string} destDir - Directorio destino
 * @param {string} distRoot - Ruta raíz del directorio dist
 * @param {Array} filesToCopy - Array para almacenar archivos a copiar
 * @returns {void}
 */
function collectFilesToCopy(srcDir, destDir, distRoot, filesToCopy) {
  const items = fs.readdirSync(srcDir);
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // Si es un directorio, crearlo y procesar recursivamente
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      collectFilesToCopy(srcPath, destPath, distRoot, filesToCopy);
    } else if (stats.isFile()) {
      // Calcular la ruta relativa desde dist
      const relativePath = path.relative(distRoot, srcPath);
      
      // Si es un archivo, verificar si debe copiarse
      if (shouldCopyFile(item, relativePath)) {
        const fileExists = fs.existsSync(destPath);
        filesToCopy.push({
          srcPath,
          destPath,
          relativePath,
          fileName: item,
          exists: fileExists,
          shouldAsk: !shouldOverwriteAutomatically(item, relativePath) && fileExists,
        });
      }
    }
  }
}

/**
 * Copia recursivamente archivos con versión de dist a legacy
 * @param {string} srcDir - Directorio origen
 * @param {string} destDir - Directorio destino
 * @param {string} distRoot - Ruta raíz del directorio dist
 * @param {boolean} autoOverwrite - Si es true, sobrescribe automáticamente sin preguntar
 * @returns {Promise<void>}
 */
async function copyVersionedFilesRecursive(srcDir, destDir, distRoot, autoOverwrite = false) {
  // Primero recopilar todos los archivos
  const filesToCopy = [];
  collectFilesToCopy(srcDir, destDir, distRoot, filesToCopy);
  
  // Agrupar archivos por versión para preguntar una sola vez
  const versionGroups = new Map(); // Map<version, {pluginName, files: []}>
  const filesWithoutVersion = [];
  
  for (const file of filesToCopy) {
    if (file.shouldAsk) {
      // Archivos que requieren pregunta (con versión)
      const version = extractVersion(file.fileName);
      if (version) {
        const pluginName = getPluginName(file.fileName);
        const key = `${pluginName}-${version}`;
        
        if (!versionGroups.has(key)) {
          versionGroups.set(key, {
            pluginName,
            version,
            files: [],
          });
        }
        versionGroups.get(key).files.push(file);
      } else {
        // Archivo .map asociado a versión
        // Buscar el archivo base sin .map para extraer versión
        const baseName = file.fileName.replace(/\.map$/, '');
        const version = extractVersion(baseName);
        if (version) {
          const pluginName = getPluginName(baseName);
          const key = `${pluginName}-${version}`;
          
          if (!versionGroups.has(key)) {
            versionGroups.set(key, {
              pluginName,
              version,
              files: [],
            });
          }
          versionGroups.get(key).files.push(file);
        } else {
          filesWithoutVersion.push(file);
        }
      }
    } else {
      // Archivos que se sobrescriben automáticamente
      filesWithoutVersion.push(file);
    }
  }
  
  // Procesar archivos agrupados por versión
  for (const [key, group] of versionGroups) {
    let shouldOverwrite;
    
    if (autoOverwrite) {
      // Sobrescribir automáticamente sin preguntar
      shouldOverwrite = true;
    } else {
      // Preguntar al usuario
      shouldOverwrite = await askOverwriteVersion(group.pluginName, group.version);
    }
    
    for (const file of group.files) {
      if (shouldOverwrite) {
        fsExtra.copySync(file.srcPath, file.destPath, { overwrite: true });
        console.log(`Archivo sobrescrito: ${file.relativePath}`);
      } else {
        console.log(`Archivo omitido: ${file.relativePath}`);
      }
    }
  }
  
  // Procesar archivos que no requieren pregunta (se sobrescriben automáticamente o no existen)
  for (const file of filesWithoutVersion) {
    if (file.exists) {
      // Sobrescribir automáticamente
      fsExtra.copySync(file.srcPath, file.destPath, { overwrite: true });
      console.log(`Archivo sobrescrito automáticamente: ${file.relativePath}`);
    } else {
      // El archivo no existe, copiarlo directamente
      fsExtra.copySync(file.srcPath, file.destPath, { overwrite: true });
      console.log(`Archivo copiado: ${file.relativePath}`);
    }
  }
}

/**
 * Obtiene el valor del parámetro de sobrescritura desde los argumentos de línea de comandos
 * @returns {boolean} - true si debe sobrescribir automáticamente, false si debe preguntar
 */
function getOverwriteParam() {
  const args = process.argv.slice(2);
  
  // Buscar --overwrite=true o --overwrite=false
  const overwriteArg = args.find(arg => arg.startsWith('--overwrite='));
  if (overwriteArg) {
    const value = overwriteArg.split('=')[1];
    return value.toLowerCase() === 'true';
  }
  
  // Buscar --ask (si está presente, no sobrescribir automáticamente)
  if (args.includes('--ask')) {
    return false;
  }
  
  // Por defecto, preguntar antes de sobrescribir
  return false;
}

/**
 * Script para copiar archivos con versión de dist a legacy
 */
async function copyVersionedFilesToLegacy() {
  const distPath = path.resolve(__dirname, '..', 'dist');
  const legacyPath = path.resolve(__dirname, '..', 'legacy');
  const autoOverwrite = getOverwriteParam();
    
  // Crear directorio legacy si no existe
  if (!fs.existsSync(legacyPath)) {
    fs.mkdirSync(legacyPath, { recursive: true });
  }
  
  // Verificar que dist existe
  if (!fs.existsSync(distPath)) {
    console.log('Error:El directorio dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  // Copiar solo archivos con versión
  try {
    await copyVersionedFilesRecursive(distPath, legacyPath, distPath, autoOverwrite);
  } catch (error) {
    console.error('Error al copiar archivos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  copyVersionedFilesToLegacy();
}

module.exports = copyVersionedFilesToLegacy;
