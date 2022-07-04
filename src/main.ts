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
import { changeSettings, initSettings } from './settings';
import { openWebURL } from './shared/utils/open-website';
import settings from './settings';
import { ShortcutsSettings } from './settings/settings.types';

require('update-electron-app')({
  repo: 'mbuslenko/nodetools',
});

function createWindow(pathToHtmlFile: string) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
    icon: '../src/assets/app-icon.png',
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, pathToHtmlFile));
  mainWindow.setResizable(false);
  app.dock.show();
}

ipcMain.on('change-settings', (event, arg) => {
  console.log('Settings was changed', JSON.stringify(arg));

  changeSettings(arg.data);
});

ipcMain.handle('get-errors', (event, arg) => {
  return settings.get('errorsStorage');
});

app.whenReady().then(() => {
  initSettings();
  const shortcuts = settings.get('shortcuts') as ShortcutsSettings;
  const InlineDomain = new domains.inline.InlineDomain();

  // * translate shortcut
  globalShortcut.register(shortcuts.translate.join('+'), async () => {
    await InlineDomain.translateText();
  });

  // * transliterator shortcut
  globalShortcut.register(shortcuts.transliterate.join('+'), async () => {
    await InlineDomain.transliterateText();
  });

  // * currency convertor shortcut
  globalShortcut.register(shortcuts.convertCurrency.join('+'), async () => {
    await InlineDomain.convertCurrency();
  });

  // * humanize shortcut
  globalShortcut.register(shortcuts.humanizeText.join('+'), async () => {
    await InlineDomain.humanizeText();
  });

  // * spell checker shortcut
  globalShortcut.register(shortcuts.spellCheck.join('+'), async () => {
    await InlineDomain.spellCheck();
  });

  // * url shortener shortcut
  globalShortcut.register(shortcuts.shortenUrl.join('+'), async () => {
    await InlineDomain.shortenUrl();
  });

  // * calculate shortcut
  globalShortcut.register(shortcuts.calculate.join('+'), async () => {
    await InlineDomain.calculate();
  });
});

let tray: Tray;
app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../src/assets/tray-icon.png')
  );
  tray = new Tray(icon);

  const shortcuts = settings.get('shortcuts') as ShortcutsSettings;
  const InlineDomain = new domains.inline.InlineDomain();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Shortcuts',
          role: 'window',
          click: () => createWindow('../index.html'),
        },
        {
          label: 'Translate options',
          role: 'window',
          click: () => createWindow('../index.html'),
        },
        {
          label: 'Currency converter options',
          role: 'window',
          click: () => createWindow('../index.html'),
        },
        {
          label: 'Errors',
          role: 'window',
          click: () => createWindow('../errors-list.html'),
        },
      ],
    },
    { label: 'Separator', type: 'separator' },
    {
      label: 'Translate',
      accelerator: shortcuts.translate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.translateText();
      },
    },
    {
      label: 'Transliterate',
      accelerator: shortcuts.transliterate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.transliterateText();
      },
    },
    {
      label: 'Humanize',
      accelerator: shortcuts.humanizeText.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.humanizeText();
      },
    },
    {
      label: 'Fix spelling',
      accelerator: shortcuts.spellCheck.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.spellCheck();
      },
    },
    {
      label: 'Calculate',
      accelerator: shortcuts.calculate.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.calculate();
      },
    },
    {
      label: 'Convert currencies',
      accelerator: shortcuts.convertCurrency.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.convertCurrency();
      },
    },
    {
      label: 'Shorten URL',
      accelerator: shortcuts.shortenUrl.join('+'),
      role: 'help',
      click: async () => {
        await InlineDomain.shortenUrl();
      },
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

export const relaunchApp = () => {
  app.relaunch();
  app.exit();
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
