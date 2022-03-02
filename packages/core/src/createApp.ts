import { AppModule } from './camodules/AppModule'
import { URL } from 'url'
import path from 'path'
import { app, BrowserWindow } from 'electron'
import { Logger } from '@ionistor/logger'

export type CreateAppOptions = {
  window: {
    width: number
    height: number
  }
}

export const CreateApp = (options: CreateAppOptions, modules: AppModule[] = []) => {
  Logger.log('info', 'Initializing app')
  modules.forEach(m => m.onInit())
  let resolveHtmlPath: (htmlFileName: string) => string

  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 3000
    resolveHtmlPath = (htmlFileName: string) => {
      const url = new URL(`http://localhost:${port}`)
      url.pathname = htmlFileName
      return url.href
    }
  } else {
    resolveHtmlPath = (htmlFileName: string) => {
      return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
    }
  }

  // export class AppUpdater {
  //   constructor() {
  //     log.transports.file.level = 'info'
  //     autoUpdater.logger = log
  //     autoUpdater.checkForUpdatesAndNotify()
  //   }
  // }

  let mainWindow: BrowserWindow | null = null

  // IPC
  Logger.log('info', 'Setting up IPC Modules')
  modules.forEach(m => m.onIpc(app, mainWindow))

  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support')
    sourceMapSupport.install(true, true)
  }

  const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

  if (isDevelopment) {
    require('electron-debug')()
  }

  const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(console.log)
  }

  const createWindow = async () => {
    modules.forEach(m => m.onCreatingWindow(app, mainWindow))
    if (isDevelopment) {
      Logger.log('info', 'Installing extensions')
      await installExtensions()
    }

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../assets')

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths)
    }

    Logger.log('info', 'Creating window')
    mainWindow = new BrowserWindow({
      frame: false,
      width: options.window.width,
      height: options.window.height,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: path.join(process.cwd(), 'node_modules', 'ionistor', 'dist', 'preload.cjs')
      }
    })

    mainWindow.loadURL(resolveHtmlPath('index.html'))

    mainWindow.on('ready-to-show', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined')
      }
      modules.forEach(m => m.onReadyToShow(app, mainWindow))
      if (process.env.START_MINIMIZED) {
        mainWindow.minimize()
      } else {
        mainWindow.show()
      }
    })

    mainWindow.on('closed', () => {
      modules.forEach(m => m.onClose(app, mainWindow))
      mainWindow = null
    })

    // new AppUpdater()
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app
    .whenReady()
    .then(() => {
      createWindow()
      app.on('activate', () => {
        if (mainWindow === null) createWindow()
        modules.forEach(m => m.onStart(app, mainWindow))
      })
    })
    .catch(console.log)
}
