const createWindowsInstaller =
  require("electron-winstaller").createWindowsInstaller;
const path = require("path");

/**
 * It returns a promise that resolves to an object containing the configuration for the installer
 * @returns A promise that resolves to an object.
 */
function getInstallerConfig() {
  console.log("creating windows installer");
  const rootPath = path.join("./");
  const outPath = path.join(rootPath, "builds");

  return Promise.resolve({
    appDirectory: path.join(outPath, 'release-builds', 'windows', "Nodetools-win32-x64/"),
    authors: "Mike Buslenko",
    noMsi: false,
    outputDirectory: path.join(outPath, "installers", "windows"),
    exe: "Nodetools.exe",
    setupExe: "NodetoolsInstaller.exe",
    setupIcon: path.join(rootPath, "src", "assets", "build", "icon.ico"),
  });
}

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
