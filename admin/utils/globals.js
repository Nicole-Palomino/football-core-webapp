// Global cache
window._catalogos = {
    roles: null,
    estados: null,
    ligas: null,
    seasons: null,
    teams: null,
    matches: null,
    matches_byplay: null,
}

// Función para cargar roles y estados (solo si aún no están cargados)
async function cargarCatalogos() {
    if (!window._catalogos.roles) {
        window._catalogos.roles = await window.api.getRoleData()
    }
    if (!window._catalogos.estados) {
        window._catalogos.estados = await window.api.getStateData()
    }
    if (!window._catalogos.ligas) {
        window._catalogos.ligas = await window.api.getLeagueData()
    }
    if (!window._catalogos.seasons) {
        window._catalogos.seasons = await window.api.getSeasonData()
    }
    if (!window._catalogos.teams) {
        window._catalogos.teams = await window.api.getTeamsActives()
    }
    if (!window._catalogos.matches) {
        window._catalogos.matches = await window.api.getMatchByStateData(8)
    }
    if (!window._catalogos.matches_byplay) {
        window._catalogos.matches_byplay = await window.api.getMatchByStateData(5)
    }
}