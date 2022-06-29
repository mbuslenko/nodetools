import { app, BrowserWindow, globalShortcut, clipboard } from 'electron';
import * as path from 'path';
import { keyTap } from 'robotjs';
import axios from 'axios';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

const translate = async (text: string) => {
  const encodedParams = new URLSearchParams();
encodedParams.append("to", "en");
encodedParams.append("text", text);

const options = {
  method: 'POST',
  url: 'https://translo.p.rapidapi.com/api/v3/translate',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'bf894bec23msha5bef7181df062ap11d0c3jsncec1e59dab77',
    'X-RapidAPI-Host': 'translo.p.rapidapi.com'
  },
  data: encodedParams
};

  return axios.request(options);
};

const getSelectedText = async () => {
  clipboard.clear();
  keyTap('c', process.platform === 'darwin' ? 'command' : 'control');
  await new Promise((resolve) => setTimeout(resolve, 200)); // add a delay before checking clipboard
  const selectedText = clipboard.readText();

  return selectedText;
};

async function read() {
  console.log(clipboard.readText())

  const previousRes = await clipboard.readText()
  const selectedText = await getSelectedText()
  console.log(selectedText)
  const translatedText = await translate(selectedText)
  console.log(translatedText.data)
  clipboard.writeText(translatedText.data.translated_text)
  keyTap("v", process.platform === "darwin" ? "command" : "control");
  await new Promise((resolve) => setTimeout(resolve, 200));

  clipboard.writeText(previousRes)
}

app
  .whenReady()
  .then(() => {
    globalShortcut.register('Control+I', async () => {
      await read();
    });
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
