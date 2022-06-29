import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
} from 'electron';
import * as path from 'path';
import * as domains from './domains';
import { Currency } from './services/currencies-convertor/currencies-convertor.types';
import settings from './settings/settings.module';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

ipcMain.on('call-mainjsfunction', (event, arg) => {
  console.log('Settings was changed', JSON.stringify(arg));

  if (arg.type === 'convert-currencies') {
    settings.convertCurrencies = arg.data.convertCurrencies;
    settings.translate = arg.data.translate;
  }
});

app
  .whenReady()
  .then(() => {
    const InlineDomain = new domains.inline.InlineDomain();

    // * translate shortcut
    globalShortcut.register(
      settings.shortcuts.translate.join('+'),
      async () => {
        await InlineDomain.translateText();
      }
    );

    // * transliterator shortcut
    globalShortcut.register(
      settings.shortcuts.transliterate.join('+'),
      async () => {
        await InlineDomain.transliterateText();
      }
    );

    // * currency convertor shortcut
    globalShortcut.register(
      settings.shortcuts.convertCurrency.join('+'),
      async () => {
        await InlineDomain.convertCurrency();
      }
    );

    // * humanize shortcut
    globalShortcut.register(
      settings.shortcuts.humanizeText.join('+'),
      async () => {
        await InlineDomain.humanizeText();
      }
    );
  })
  .then(createWindow);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
