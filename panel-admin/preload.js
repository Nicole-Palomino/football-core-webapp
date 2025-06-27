// preload.js - Script de precarga para Electron
// Se ejecuta antes de que se cargue el renderizador y permite exponer APIs seguras al renderizador
const { contextBridge, ipcRenderer } = require('electron');

// Expone un objeto 'api' al contexto global del renderizador (window.api)
// Esto es más seguro que habilitar nodeIntegration: true
contextBridge.exposeInMainWorld('api', {
    // Métodos para autenticación
    loginUser: (credentials) => ipcRenderer.invoke('login-user', credentials),
    loadMainWindow: (page) => ipcRenderer.invoke('load-main-window', page),
    getUserData: () => ipcRenderer.invoke('get-user-data'),
    logoutUser: () => ipcRenderer.invoke('logout-user'),
    onAuthExpired: (callback) => ipcRenderer.on('auth-expired', callback),

    // Métodos para interactuar con la gestión de estados
    getEstados: () => ipcRenderer.invoke('get-estados'),
    addEstado: (estado) => ipcRenderer.invoke('add-estado', estado),
    updateEstado: (estado) => ipcRenderer.invoke('update-estado', estado),
    deleteEstado: (id) => ipcRenderer.invoke('delete-estado', id),

    // Métodos para interactuar con la gestión de roles
    getRoles: () => ipcRenderer.invoke('get-roles'),
    addRol: (rol) => ipcRenderer.invoke('add-rol', rol),
    updateRol: (rol) => ipcRenderer.invoke('update-rol', rol),
    deleteRol: (id) => ipcRenderer.invoke('delete-rol', id),

    // Métodos para interactuar con la gestión de usuarios
    getUsers: () => ipcRenderer.invoke('get-users'),
    addUser: (user) => ipcRenderer.invoke('add-user', user),
    updateUser: (user) => ipcRenderer.invoke('update-user', user),
    deleteUser: (id) => ipcRenderer.invoke('delete-user', id),
    getUsersTotal: () => ipcRenderer.invoke('get-total-users'),
    getUsersTotalByDia: () => ipcRenderer.invoke('get-total-users-by-dia'),

    // Métodos para interactuar con la gestión de partidos
    getMatches: () => ipcRenderer.invoke('get-matches'),
    addMatch: (match) => ipcRenderer.invoke('add-match', match),
    updateMatch: (match) => ipcRenderer.invoke('update-match', match),
    deleteMatch: (id) => ipcRenderer.invoke('delete-match', id),
    getMatchesTotal: () => ipcRenderer.invoke('get-total-matches'),

    // Métodos para la subida de archivos
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    uploadMatchData: (filePath) => ipcRenderer.invoke('upload-match-data', filePath),

    // Métodos para la gestión de estadísticas
    getStatisticsByMatchId: (matchId) => ipcRenderer.invoke('get-statistics-by-match-id', matchId),
    saveStatistics: (statsData) => ipcRenderer.invoke('save-statistics', statsData),

    // Métodos para interactuar con la gestión de equipos
    getTeams: () => ipcRenderer.invoke('get-teams'),
    addTeam: (team) => ipcRenderer.invoke('add-team', team),
    updateTeam: (team) => ipcRenderer.invoke('update-team', team),
    deleteTeam: (id) => ipcRenderer.invoke('delete-team', id),
    getTeamsTotal: () => ipcRenderer.invoke('get-total-teams'),

    // Métodos para interactuar con la gestión de ligas
    getLigas: () => ipcRenderer.invoke('get-ligas'),
    addLiga: (liga) => ipcRenderer.invoke('add-liga', liga),
    updateLiga: (liga) => ipcRenderer.invoke('update-liga', liga),
    deleteLiga: (id) => ipcRenderer.invoke('delete-liga', id),
    getLigasTotal: () => ipcRenderer.invoke('get-total-ligas'),
    
    // Métodos para interactuar con la gestión de temporadas
    getSeasons: () => ipcRenderer.invoke('get-seasons'),
    addSeason: (season) => ipcRenderer.invoke('add-season', season),
    updateSeason: (season) => ipcRenderer.invoke('update-season', season),
    deleteSeason: (id) => ipcRenderer.invoke('delete-season', id),
    getSeasonsTotal: () => ipcRenderer.invoke('get-total-seasons'),
});