const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    projectVerse: (verseData) => ipcRenderer.send('project-verse', verseData),
    onUpdateVerse: (callback) => ipcRenderer.on('update-verse', callback)
});
