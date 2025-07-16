async function initLeaguesPage() {
    const leagueModal = new bootstrap.Modal(document.getElementById('leagueModal'))
    const leagueForm = document.getElementById('leagueForm')
    const leagueIdInput = document.getElementById('leagueId')
    const leagueNameInput = document.getElementById('leagueName')
    const leagueCountryInput = document.getElementById('country')
    const leagueImageInput = document.getElementById('leagueImage')
    const countryImageInput = document.getElementById('countryImage')

    mostrarSpinnerTabla('ligas-table-body', 'Cargando ligas...')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getLeagueData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('ligas-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#leagueTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_liga', title: 'ID' },
                { data: 'nombre_liga', title: 'League Name' },
                { data: 'pais', title: 'Country' },
                { 
                    data: 'imagen_liga', 
                    title: 'League Image',
                    orderable: false,
                    render: function (data, type, row) {
                        return `<img src="${data}" alt="${row.nombre_liga}" width="50" height="50" class="img-thumbnail">`
                    }
                },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_liga}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_liga}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ninguna liga encontrada",
            }
        })

        // Eventos de botones
        document.getElementById('addNewLeagueBtn').onclick = () => {
            leagueForm.reset()
            leagueIdInput.value = ''
            document.getElementById('leagueModalLabel').textContent = 'Add New League'
            leagueModal.show()
        }

        leagueForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre_liga = leagueNameInput.value.trim()
            const pais = leagueCountryInput.value.trim()
            const imagen_liga = leagueImageInput.value.trim()
            const imagen_pais = countryImageInput.value.trim()
            const id = leagueIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateLeague({ id: parseInt(id), nombre_liga, pais, imagen_liga, imagen_pais })
                success = !!updated
            } else {
                const created = await window.api.addLeague({ nombre_liga, pais, imagen_liga, imagen_pais })
                success = !!created
            }

            if (success) {
                leagueModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#leagueTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_liga === id)
            if (data) {
                leagueIdInput.value = data.id_liga
                leagueNameInput.value = data.nombre_liga
                leagueCountryInput.value = data.pais
                leagueImageInput.value = data.imagen_liga
                countryImageInput.value = data.imagen_pais
                document.getElementById('leagueModalLabel').textContent = 'Edit League'
                leagueModal.show()
            }
        })

        $('#leagueTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar liga?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteLeague(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getLeagueData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}