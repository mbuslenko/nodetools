import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  Tray,
} from 'electron';
import * as path from 'path';
import * as domains from './domains';
import settings from './settings/settings.module';
import { openWebURL } from './shared/utils/open-website';

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
  //mainWindow.webContents.openDevTools();
}

ipcMain.on('change-settings', (event, arg) => {
  console.log('Settings was changed', JSON.stringify(arg));

  settings.convertCurrencies = arg.data.convertCurrencies;
  settings.translate = arg.data.translate;
  settings.shortcuts = arg.data.shortcuts
});

app.whenReady().then(() => {
  const InlineDomain = new domains.inline.InlineDomain();

  // * translate shortcut
  globalShortcut.register(settings.shortcuts.translate.join('+'), async () => {
    await InlineDomain.translateText();
  });

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

  // * spell checker shortcut
  globalShortcut.register(settings.shortcuts.spellCheck.join('+'), async () => {
    await InlineDomain.spellCheck();
  });
});

// * Disabled for now
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', () => {
//   createWindow();

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

let tray;
app.whenReady().then(() => {
  const InlineDomain = new domains.inline.InlineDomain();

  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../src/assets/tray-icon.png')
  );
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'About', role: 'about' },
    {
      label: '🆕 Update Nodetools',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../src/assets/update.png')
      ),
      click: () => openWebURL('https://google.com'),
    },
    {
      label: 'Separator',
      type: 'separator',
    },
    {
      label: 'Preferences',
      submenu: [
        { label: 'Shortcuts', role: 'window', click: () => createWindow() },
        {
          label: 'Translate options',
          role: 'window',
          click: () => createWindow(),
        },
        {
          label: 'Currency converter options',
          role: 'window',
          click: () => createWindow(),
        },
      ],
    },
    { label: 'Separator', type: 'separator' },
    {
      label: 'Translate',
      accelerator: settings.shortcuts.translate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.translateText();
      }
    },
    {
      label: 'Transliterate',
      accelerator: settings.shortcuts.transliterate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.transliterateText();
      }
    },
    {
      label: 'Humanize',
      accelerator: settings.shortcuts.translate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.humanizeText();
      }
    },
    {
      label: 'Fix spelling',
      accelerator: settings.shortcuts.spellCheck.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.spellCheck();
      }
    },
    {
      label: 'Convert currencies',
      accelerator: settings.shortcuts.translate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.convertCurrency();
      }
    },
    { label: 'Separator', type: 'separator' },
    {
      label: 'FAQ',
      role: 'window',
      click: () => openWebURL('https://google.com'),
    },
    { label: 'Quit', role: 'quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip('Nodetools');
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
