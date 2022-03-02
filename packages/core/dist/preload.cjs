const { contextBridge } = require('electron')

console.log('Preload context bridge')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {}
})
