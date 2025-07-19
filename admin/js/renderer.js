// js/renderer.js

// Cargar el sidebar una sola vez
fetch('components/sidebar.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('sidebar').innerHTML = html

        // Escuchar clics del menú
        document.querySelectorAll('#sidebar a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const vista = e.target.getAttribute('data-view')
                cargarVista(vista)
            })
        })

        // Escuchar logout (fuera del data-view)
        const logoutButton = document.getElementById('logout-button')
        logoutButton?.addEventListener('click', async () => {
            const content = document.getElementById('content') || document.body
            content.classList.add('fade-out')
            setTimeout(async () => {
                await window.api.logoutUser();
                window.api.loadMainWindow('login.html');
            }, 600)
        })
    })

// Función para cargar vistas dinámicas
function cargarVista(vista) {
    fetch(`views/${vista}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('content').innerHTML = html

            if (vista === 'states') {
                initStatesPage()
            } else if (vista === 'roles') {
                initRolesPage()
            } else if (vista === 'seasons') {
                initSeasonsPage()
            } else if (vista === 'leagues') {
                initLeaguesPage()
            } else if (vista === 'users') {
                initUsersPage()
            } else if (vista === 'teams') {
                initTeamsPage()
            } else if (vista === 'matches') {
                initMatchesPage()
            } else if (vista === 'summaries') {
                initSummariesPage()
            } else if (vista === 'dashboard') {
                initDashboardPage()
            } else if (vista === 'kmeans') {
                initKmeansPage()
            } else if (vista === 'randomforest') {
                initRfPage()
            }
        })
}

// Cargar vista por defecto
window.onload = () => cargarVista('dashboard')