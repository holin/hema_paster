'use strict'

import { app, BrowserWindow, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let shortcut = 'CommandOrControl+Shift+H'

let mainWindow
let isFocus = true
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 300,
    useContentSize: true,
    width: 500,
    maxHeight: 500,
    frame: true,
    title: ''
  })

  let position = mainWindow.getPosition()
  mainWindow.setPosition(position[0], 200)

  mainWindow.setMinimizable(false)
  mainWindow.setMaximizable(false)

  // hide dock
  // app.dock.hide()
  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.setFullScreenable(false)

  const ret = globalShortcut.register(shortcut, () => {
    if (isFocus) {
      isFocus = false
      if (mainWindow == null) {
        createWindow()
      } else {
        mainWindow.hide()
      }
    } else {
      if (mainWindow == null) {
        createWindow()
      }
      mainWindow.show()
      isFocus = true
      let size = mainWindow.getSize()
      mainWindow.focus()
      mainWindow.setSize(size[0], size[1] + 200)
    }
  })

  if (!ret) {
    console.log('registration failed')
  }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Emitted when the window is blurred.
  mainWindow.on('blur', () => {
    // mainWindow.hide()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.show()
  }
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister(shortcut)

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
