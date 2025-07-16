async function initDashboardPage() {
    const seasons = await window.api.getSeasonsTotal()
    const leagues = await window.api.getLeaguesTotal()
    const users = await window.api.getUsersTotal()
    const teams = await window.api.getTeamsTotal()
    const matches = await window.api.getMatchesTotal()
    const rawData = await window.api.getUsersTotalByDate()

    document.getElementById('totalSeasons').textContent = seasons
    document.getElementById('totalLeagues').textContent = leagues
    document.getElementById('totalUsers').textContent = users
    document.getElementById('totalTeams').textContent = teams
    document.getElementById('totalMatches').textContent = matches

    // Agrupar por mes (YYYY-MM)
    const grouped = {}
    rawData.forEach(d => {
        const mes = d.fecha.slice(0, 7) // "2025-06"
        grouped[mes] = (grouped[mes] || 0) + d.cantidad
    })

    const labels = Object.keys(grouped)
    const data = Object.values(grouped)
    const ctx = document.getElementById('usersChart').getContext('2d')

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Usuarios por mes',
                data,
                backgroundColor: 'rgba(29, 151, 108, 0.5)',
                borderColor: 'rgba(29, 151, 108, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad' }
                },
                x: {
                    title: { display: true, text: 'Mes' }
                }
            }
        }
    })
}