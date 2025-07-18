const { contextBridge, ipcRenderer } = require('electron')

// Expone un objeto 'api' al contexto global del renderizador (window.api)
// Esto es más seguro que habilitar nodeIntegration: true
contextBridge.exposeInMainWorld('api', {
    // Métodos para autenticación
    loginUser: (credentials) => ipcRenderer.invoke('login-user', credentials),
    loadMainWindow: (page) => ipcRenderer.invoke('load-main-window', page), // Ahora acepta un parámetro
    getUserAuthData: () => ipcRenderer.invoke('get-user-data'),
    logoutUser: () => ipcRenderer.invoke('logout-user'),
    
    // Métodos para interactuar con la gestión de estados
    getStateData: () => ipcRenderer.invoke('get-states'),
    addState: (state) => ipcRenderer.invoke('add-state', state),
    updateState: (state) => ipcRenderer.invoke('update-state', state),
    deleteState: (id) => ipcRenderer.invoke('delete-state', id),

    // Métodos para interactuar con la gestión de roles
    getRoleData: () => ipcRenderer.invoke('get-roles'),
    addRole: (role) => ipcRenderer.invoke('add-role', role),
    updateRole: (role) => ipcRenderer.invoke('update-role', role),
    deleteRole: (id) => ipcRenderer.invoke('delete-role', id),

    // Métodos para interactuar con la gestión de temporadas
    getSeasonData: () => ipcRenderer.invoke('get-seasons'),
    addSeason: (season) => ipcRenderer.invoke('add-season', season),
    updateSeason: (season) => ipcRenderer.invoke('update-season', season),
    deleteSeason: (id) => ipcRenderer.invoke('delete-season', id),
    getSeasonsTotal: () => ipcRenderer.invoke('get-total-seasons'),

    // Métodos para interactuar con la gestión de ligas
    getLeagueData: () => ipcRenderer.invoke('get-leagues'),
    addLeague: (league) => ipcRenderer.invoke('add-league', league),
    updateLeague: (league) => ipcRenderer.invoke('update-league', league),
    deleteLeague: (id) => ipcRenderer.invoke('delete-league', id),
    getLeaguesTotal: () => ipcRenderer.invoke('get-total-leagues'),

    // Métodos para interactuar con la gestión de ligas
    getUserData: () => ipcRenderer.invoke('get-users'),
    addUser: (user) => ipcRenderer.invoke('add-user', user),
    updateUser: (user) => ipcRenderer.invoke('update-user', user),
    deleteUser: (id) => ipcRenderer.invoke('delete-user', id),
    getUsersTotal: () => ipcRenderer.invoke('get-total-users'),
    getUsersTotalByDate: () => ipcRenderer.invoke('get-total-users-by-date'),

    // Métodos para interactuar con la gestión de equipos
    getTeamData: () => ipcRenderer.invoke('get-teams'),
    getTeamsActives: () => ipcRenderer.invoke('get-teams-actives'),
    addTeam: (team) => ipcRenderer.invoke('add-team', team),
    updateTeam: (team) => ipcRenderer.invoke('update-team', team),
    deleteTeam: (id) => ipcRenderer.invoke('delete-team', id),
    getTeamsTotal: () => ipcRenderer.invoke('get-total-teams'),

    // Métodos para interactuar con la gestión de partidos
    getMatchData: () => ipcRenderer.invoke('get-matches'),
    getMatchByStateData: () => ipcRenderer.invoke('get-matches-by-state'),
    addMatch: (match) => ipcRenderer.invoke('add-match', match),
    updateMatch: (match) => ipcRenderer.invoke('update-match', match),
    deleteMatch: (id) => ipcRenderer.invoke('delete-match', id),
    getMatchesTotal: () => ipcRenderer.invoke('get-total-matches'),

    // Métodos para la subida de archivos
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    uploadMatchData: (filePath) => ipcRenderer.invoke('upload-match-data', filePath),

    // Métodos para interactuar con la gestión de estadísticas
    getStatByMatchData: (stat) => ipcRenderer.invoke('get-stats-by-match', stat),
    addStats: (stat) => ipcRenderer.invoke('add-stats', stat),
    updateStats: (stat) => ipcRenderer.invoke('update-stats', stat),

    // Métodos para interactuar con la gestión de resúmenes
    getSummaryByStateData: (estados) => ipcRenderer.invoke('get-summary-by-state', estados),
    addSummary: (summary) => ipcRenderer.invoke('add-summary', summary),
    updateSummary: (summary) => ipcRenderer.invoke('update-summary', summary),
    deleteSummary: (id) => ipcRenderer.invoke('delete-summary', id),

    // Métodos para interactuar con la gestión de predicciones con k-means
    getKmeansData: () => ipcRenderer.invoke('get-kmeans'),
    addKmean: (kmeans) => ipcRenderer.invoke('add-kmeans', kmeans),
    updateKmean: (kmeans) => ipcRenderer.invoke('update-kmeans', kmeans),
    deleteKmean: (id) => ipcRenderer.invoke('delete-kmeans', id),

    // Métodos para interactuar con la gestión de predicciones con random forest
    getRfData: () => ipcRenderer.invoke('get-rf'),
    addRf: (rf) => ipcRenderer.invoke('add-rf', rf),
    updateRf: (rf) => ipcRenderer.invoke('update-rf', rf),
    deleteRf: (id) => ipcRenderer.invoke('delete-rf', id),
})