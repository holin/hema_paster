'use strict'

import { app, BrowserWindow, globalShortcut, Menu } from 'electron'

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
    height: 400,
    useContentSize: true,
    width: 700,
    title: '',
    transparent: false,
    frame: true,
    toolbar: false
  })

  let position = mainWindow.getPosition()
  mainWindow.setPosition(position[0], 200)

  // mainWindow.setMinimizable(false)
  // mainWindow.setMaximizable(false)
  // mainWindow.setFullScreenable(false)

  // hide dock
  // app.dock.hide()
  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.setVisibleOnAllWorkspaces(true)

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

  // Create the Application's main menu
  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'},
        {
          label: 'Toggle On Top',
          accelerator: 'CmdOrCtrl+T',
          click () {
            if (!mainWindow.isAlwaysOnTop()) {
              mainWindow.setAlwaysOnTop(true, 'floating')
            } else {
              mainWindow.setAlwaysOnTop(false)
            }
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
