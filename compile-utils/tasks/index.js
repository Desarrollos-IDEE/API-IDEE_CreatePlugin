#!/usr/bin/env node

const path = require('path')
const ROOT = path.join(__dirname, '..', '..')
const parentUtils = path.join(ROOT, 'compile-utils')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const readline = require('readline')
const chalk = require('chalk')
const hbs = require('handlebars')

const inquirer = require('inquirer')

/**
 * Final message
 * @const
 */
const FINAL_MSG = 'The project is ready for development. Happy coding!'

/**
 * Header output messages
 * @const
 */
const HEADER = '[API CNIG PLUGINS]:'

/**
 * npm install question
 * @const
 */
const ASK_NPM_INSTALL =
  ' Do you want API-CORE-plugins installs the npm dependencies? [y/n]: '

/**
 * Plugin name question
 * @const
 */
const ASK_PLUGIN_NAME = ' What is the name of your plugin?: '

/**
 * API-CORE version question
 * @const
 */
const ASK_API_CORE_VERSION = ' Choose API-CORE version: '
const API_CORE_VERSIONS = ['3.3.9']

/**
 * Override plugin question
 * @const
 */
const OVERRIDE_ASK =
  '[WARN] There is already a plugin project with that name. Do you want to overwrite it? [y/n]:'

/**
 * Name plugin warning
 * @const
 */
const WARN_PLUGIN_NAME = 'Plugin name cannot be empty or contains spaces.'

/**
 * Success message of archetype creation.
 * @function
 */
const successMsg = (name, destDir) =>
  `${name} project has been created successfully in ${destDir}.`
/**
 * This function replaces the content of the files of
 * plugin project with the custom class variables.
 * @function
 */
const replaceContent = (files, name, id) => {
  console.log(files)
  const hbsVar = {
    archetype: {
      plugin: {
        name,
        id,
      },
    },
  }
  files.forEach(file => {
    let fileContent = fs.readFileSync(file, {
      encoding: 'utf-8',
    })
    
    // Protect all non-archetype variables temporarily
    const placeholder = '__PLACEHOLDER_'
    const nonArchetypeVarMap = new Map()
    let placeholderIndex = 0
    
    // Find all {{...}} that are NOT {{archetype...}}
    fileContent = fileContent.replace(/\{\{(?!archetype)[\s\S]*?\}\}/g, match => {
      const placeKey = `${placeholder}${placeholderIndex++}__`
      nonArchetypeVarMap.set(placeKey, match)
      return placeKey
    })
    
    // Compile with Handlebars (only {{archetype.*}} will be replaced)
    const compiledContent = hbs.compile(fileContent)(hbsVar)
    
    // Restore non-archetype variables
    let finalContent = compiledContent
    nonArchetypeVarMap.forEach((originalValue, placeKey) => {
      finalContent = finalContent.replace(placeKey, originalValue)
    })
    
    fs.outputFileSync(file, finalContent)
  })
}

/**
 * This function renames the files of the project plugin.
 * @function
 */
const rename = (files, name) => {
  const regExp = /archetype([^\\]*\.\w+)$/
  const newNameRegExp = name + '$1'
  files.forEach(file => {
    fs.renameSync(file, file.replace(regExp, newNameRegExp))
  })
}

/**
 * Actualiza el nombre de la familia de fuentes dentro de los archivos de fuentes (binarios)
 * @function
 */
const updateFontMetadata = (fontsDir, pluginId) => {
  let createFont
  let woff2

  const fonteditor = require('fonteditor-core')
  createFont = fonteditor.createFont
  woff2 = fonteditor.woff2

  const nameIds = [1, 4]
  const types = [
    { ext: 'eot', type: 'eot' },
    { ext: 'ji', type: 'ttf' },
    { ext: 'woff', type: 'woff' },
    { ext: 'woff2', type: 'woff2' },
  ]

  const processFont = (fontPath, fontType) => {
    if (!fs.existsSync(fontPath)) return
    const buffer = fs.readFileSync(fontPath)
    const font = createFont(buffer, { type: fontType })
    const fontObject = font.get()
    if (!fontObject.name || !fontObject.name.nameRecords) return
    fontObject.name.nameRecords.forEach(record => {
      if (nameIds.indexOf(record.nameID) !== -1) {
        record.value = pluginId
      }
    })
    font.set(fontObject)
    const out = font.write({ type: fontType })
    fs.writeFileSync(fontPath, Buffer.from(out))
  }

  const run = async () => {
    if (woff2 && typeof woff2.init === 'function') {
      await woff2.init()
    }
    for (const { ext, type } of types) {
      const fontPath = path.join(fontsDir, `${pluginId}.${ext}`)
      try {
        processFont(fontPath, type)
      } catch (err) {
        customConsole.warn(`No se pudo actualizar metadata en ${ext}: ${err.message}`)
      }
    }
  }

  return run()
}

/**
 * Custom console with colors
 * @class
 */
class CustomConsole {
  constructor(options) {
    this.header = chalk.hex('#e7338c').bold(options.header)
  }

  success(msg) {
    console.log(`${this.header} ${chalk.green('[SUCCESS] ' + msg)}`)
  }

  error(msg) {
    console.log(`${this.header} ${chalk.red('[ERROR] ' + msg)}`)
  }

  info(msg) {
    console.log(`${this.header} ${chalk.blue('[INFO] ' + msg)}`)
  }

  warn(msg) {
    console.log(`${this.header} ${chalk.hex('#f2a515')('[WARN] ' + msg)}`)
  }

  clear() {
    console.log('\x1Bc')
  }

  log(msg) {
    console.log(`${msg}`)
  }
}

/**
 * Instance of custom console class
 * @const
 */
const customConsole = new CustomConsole({
  header: HEADER,
})

/**
 * This function install extern node libraries.
 * @function
 * @async
 */
const npmInstall = async (destDir, progressBar) => {
  let npm = null
  if (!/^win/.test(process.platform)) {
    // linux
    npm = spawn('npm', ['i'], {
      cwd: path.resolve(destDir),
      stdio: 'inherit',
    })
  } else {
    // windows
    npm = spawn('cmd', ['/s', '/c', 'npm', 'i'], {
      cwd: path.resolve(destDir),
      stdio: 'inherit',
    })
  }

  return npm
}

/**
 * This function read the users's answer to override the folder
 * @function
 * @async
 */
const overrideAsk = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => {
    const question = chalk.hex('#f2a515')(OVERRIDE_ASK)
    rl.question(customConsole.header + question, answer => {
      resolve(answer)
      rl.close()
    })
  })
}

/**
 * This function read the users's answer to install node modules libraries.
 * @function
 * @async
 */
const askNPMInstall = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => {
    rl.question(customConsole.header + ASK_NPM_INSTALL, answer => {
      resolve(answer)
      rl.close()
    })
  })
}

/**
 * This function read the users's answer to override the folder
 * @function
 * @async
 */
const getPluginName = async () => {
  customConsole.clear()
  customConsole.warn(WARN_PLUGIN_NAME)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => {
    const question = ASK_PLUGIN_NAME
    rl.question(customConsole.header + question, async answer => {
      let finalAnswer = answer
      if (
        finalAnswer === '' ||
        finalAnswer.trim() !== finalAnswer ||
        /\s/.test(finalAnswer)
      ) {
        rl.close()
        const finalAnswer = await getPluginName()
        resolve(finalAnswer)
      } else {
        resolve(finalAnswer)
        rl.close()
      }
    })
  })
}

/**
 * Resolve the npm install task
 * @function
 * @async
 */
const taskNPMInstall = async destDir => {
  npmInstall(destDir)
    .then(npmProcess => {
      npmProcess.on('close', () => customConsole.success(FINAL_MSG))
    })
    .catch(error => {
      customConsole.error(error)
    })
}

/**
 * This function creates the archetype plugin
 * @function
 */
const createArchetype = async (srcDir, destDir, name, files, filesOnlyRename = []) => {
  const id = name.toLowerCase()
  fs.copySync(srcDir, destDir)
  replaceContent(files, name, id)
  rename([...files, ...filesOnlyRename], id)
  const fontsDir = path.join(destDir, 'src', 'facade', 'assets', 'fonts')
  await updateFontMetadata(fontsDir, id)
  customConsole.success(successMsg(name, destDir))
  const answerNPMInstall = await askNPMInstall()
  if (answerNPMInstall.toLowerCase() === 'y') {
    taskNPMInstall(destDir)
  } else {
    customConsole.success(FINAL_MSG)
  }
}

/**
 * Main task
 * @function
 */
const main = async () => {
  const pluginName = await getPluginName()
  const capitalizeName = pluginName[0].toUpperCase() + pluginName.slice(1)
  const id = pluginName.toLowerCase()
  const srcDir = path.join(parentUtils, 'archetype')
  const destDir = path.join(process.cwd(), id)

  const FILES = [
    path.join(destDir, 'package.json'),
    path.join(destDir, 'README.md'),
    path.join(destDir, 'LICENSE'),
    path.join(destDir, 'webpack-config', 'webpack.production-ol.config.js'),
    path.join(destDir, 'webpack-config', 'webpack.production-cesium.config.js'),
    path.join(destDir, 'src', 'api.json'),
    path.join(destDir, 'src', 'facade', 'assets', 'css', 'archetype.css'),
    path.join(destDir, 'src', 'facade', 'assets', 'css', 'fonts.css'),
    path.join(destDir, 'src', 'facade', 'assets', 'fonts', 'archetype.svg'),
    path.join(destDir, 'src', 'facade', 'js', 'archetype.js'),
    path.join(destDir, 'src', 'facade', 'js', 'archetypecontrol.js'),
    path.join(destDir, 'src', 'impl', 'ol', 'js', 'archetypecontrol.js'),
    path.join(destDir, 'src', 'impl', 'cesium', 'js', 'archetypecontrol.js'),
    path.join(destDir, 'src', 'templates', 'archetype.html'),
    path.join(destDir, 'src', 'templates', 'myhelp.html'),
    path.join(destDir, 'test', 'test.js'),
    path.join(destDir, 'test', 'dev.html'),
    path.join(destDir, 'test', 'dev-cesium.html'),
    path.join(destDir, 'test', 'prod.html'),
    path.join(destDir, 'test', 'prod-cesium.html'),
    path.join(destDir, 'test', 'playwright', 'ol', 'archetype-ol.html'),
    path.join(destDir, 'test', 'playwright', 'ol', 'PLAY-01-archetype.spec.js'),
  ]

  const FONT_FILES_ONLY_RENAME = [
    path.join(destDir, 'src', 'facade', 'assets', 'fonts', 'archetype.eot'),
    path.join(destDir, 'src', 'facade', 'assets', 'fonts', 'archetype.ttf'),
    path.join(destDir, 'src', 'facade', 'assets', 'fonts', 'archetype.woff'),
    path.join(destDir, 'src', 'facade', 'assets', 'fonts', 'archetype.woff2'),
  ]

  const existDir = fs.existsSync(destDir)
  if (existDir === true) {
    const answer = await overrideAsk()
    if (answer.toLowerCase() === 'y') {
      createArchetype(srcDir, destDir, capitalizeName, FILES, FONT_FILES_ONLY_RENAME)
    } else {
      customConsole.info('Aborted task.')
    }
  } else {
    createArchetype(srcDir, destDir, capitalizeName, FILES, FONT_FILES_ONLY_RENAME)
  }
}

/**
 * Run the program
 */
main().catch(err => customConsole.error(err))
