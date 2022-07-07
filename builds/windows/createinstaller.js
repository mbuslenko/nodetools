const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Nodetools-win32-ia32/'),
    authors: 'Mike Buslenko',
    noMsi: false,
    outputDirectory: path.join(outPath, 'installers', 'windows'),
    exe: 'Nodetools.exe',
    setupExe: 'NodetoolsInstaller.exe',
    setupIcon: path.join(rootPath, 'src', 'assets', 'build', 'icon.ico')
  })
}
