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
import { changeSetting, changeSettings, initSettings } from './settings';
import settings from './settings';
import { ShortcutsSettings } from './settings/settings.types';
import { openWebURL } from './shared/utils/open-website';

// import { askForAccessibilityAccess, getAuthStatus } from 'node-mac-permissions';

require('update-electron-app')({
  repo: 'mbuslenko/nodetools',
});

function createWindow(pathToHtmlFile: string) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    frame: false,
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

  if (process.platform === 'darwin') {
    app.dock.show();
  }
}

/**
 * It relaunches the app
 */
export const relaunchApp = () => {
  app.relaunch();
  app.exit();
};

ipcMain.on('change-settings', (_event, arg) => {
  changeSettings(arg.data);
});

ipcMain.on('change-language', (_event, arg) => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  if (!arg.to) {
    return;
  }

  changeSetting('translate', arg);
});

ipcMain.on('change-convert-currencies-settings', (_event, arg) => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  if (!arg.from || !arg.to) {
    return;
  }

  changeSetting('convertCurrencies', arg);
});

ipcMain.on('change-shortcuts', (_event, arg) => {
  if (
    !arg.translate ||
    !arg.transliterate ||
    !arg.convertCurrency ||
    !arg.humanizeText ||
    !arg.spellCheck ||
    !arg.shortenUrl ||
    !arg.calculate
  ) {
    return;
  }

  changeSetting('shortcuts', arg);

  relaunchApp();
});

ipcMain.on('close-window', (_event, _arg) => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
});

ipcMain.handle('get-errors', (_event, _arg) => {
  return settings.get('errorsStorage');
});

ipcMain.handle('get-settings', (_event, _arg) => {
  return settings.store;
});

app.whenReady().then(async () => {
  await initSettings();

  const shortcuts = settings.get('shortcuts') as ShortcutsSettings;
  const InlineDomain = new domains.inline.InlineDomain();

  // * Disabled for Windows and Linux
  // if (getAuthStatus('accessibility') === 'denied') {
  //   const errorsHandler = new ErrorsHandler();

  //   //@ts-ignore
  //   askForAccessibilityAccess().then((status: string) => {
  //     if (status === 'denied') {
  //       errorsHandler.handleError({
  //         message: 'Accessibility access is denied',
  //         environment: 'Nodetools',
  //         trace: null,
  //       });
  //     }
  //   });

  //   if (getAuthStatus('accessibility') === 'denied') {
  //     errorsHandler.handleError({
  //       message:
  //         'You have to grant Accessibility permission for Nodetools to work it correctly, open Settings -> Security & Privacy -> Privacy tab -> Accessibility -> Add Nodetools',
  //       environment: 'Nodetools',
  //       trace: null,
  //     });
  //   }
  // }

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
      label: 'About',
      role: 'window',
      click: () => openWebURL('https://nodetools.app/about'),
    },
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Shortcuts',
          role: 'window',
          click: () => createWindow('../src/views/shortcut-settings.html'),
        },
        {
          label: 'Translate options',
          role: 'window',
          click: () => createWindow('../src/views/translate-settings.html'),
        },
        {
          label: 'Currency converter options',
          role: 'window',
          click: () =>
            createWindow('../src/views/convert-currencies-settings.html'),
        },
        {
          label: 'Errors',
          role: 'window',
          click: () => createWindow('../src/views/errors-list.html'),
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
    { label: 'Quit', role: 'quit', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  tray.setToolTip('Nodetools');
});
