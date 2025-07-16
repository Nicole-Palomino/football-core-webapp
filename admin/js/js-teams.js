async function initTeamsPage() {
    const teamModal = new bootstrap.Modal(document.getElementById('teamModal'))
    const teamForm = document.getElementById('teamForm')
    const teamIdInput = document.getElementById('teamId')
    const teamNameInput = document.getElementById('teamName')
    const teamStadumInput = document.getElementById('stadiumName')
    const teamLogoInput = document.getElementById('logoUrl')

    mostrarSpinnerTabla('equipos-table-body', 'Cargando equipos...')

    await cargarCatalogos()

    const estadoSelect = document.getElementById('selectState')
    estadoSelect.innerHTML = window._catalogos.estados.map(e =>
        `<option value="${e.id_estado}">${e.nombre_estado}</option>`
    ).join('')

    const ligaSelect = document.getElementById('selectLeague')
    ligaSelect.innerHTML = window._catalogos.ligas.map(l =>
        `<option value="${l.id_liga}">${l.nombre_liga}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getTeamData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('equipos-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#teamTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_equipo', title: 'ID' },
                { data: 'nombre_equipo', title: 'Team Name' },
                { 
                    data: 'logo', 
                    title: 'Logo',
                    orderable: false,
                    render: function (data, type, row) {
                        return `<img src="${data}" alt="${row.nombre_equipo}" width="50" height="50" class="img-thumbnail">`
                    }
                },
                { 
                    data: 'estado',
                    title: 'State',
                    render: estado => `<span class="badge bg-danger">${estado?.nombre_estado || 'Sin estado'}</span>`
                },
                {
                    data: 'liga',
                    title: 'League Name',
                    render: nombre => `<span class="badge bg-success">${nombre?.nombre_liga || 'Sin Liga'}</span>`
                },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_equipo}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_equipo}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún equipo encontrado",
            },
            layout: {
                bottomEnd: {
                    paging: {
                        firstLast: false
                    }
                }
            }
        })

        // Eventos de botones
        document.getElementById('addNewTeamBtn').onclick = () => {
            teamForm.reset()
            teamIdInput.value = ''
            document.getElementById('teamModalLabel').textContent = 'Add New Team'
            teamModal.show()
        }

        teamForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre_equipo = teamNameInput.value.trim()
            const estadio = teamStadumInput.value.trim()
            const logo = teamLogoInput.value.trim()
            const id_estado = estadoSelect.value.trim()
            const id_liga = ligaSelect.value.trim()
            const id = teamIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateTeam({ id: parseInt(id), nombre_equipo, estadio, logo, id_estado, id_liga })
                success = !!updated
            } else {
                const created = await window.api.addTeam({ nombre_equipo, estadio, logo, id_estado, id_liga })
                success = !!created
            }

            if (success) {
                teamModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#teamTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_equipo === id)
            if (data) {
                teamIdInput.value = data.id_equipo
                teamNameInput.value = data.nombre_equipo
                teamStadumInput.value = data.estadio
                teamLogoInput.value = data.logo
                estadoSelect.value = data.estado?.id_estado || ''
                ligaSelect.value = data.liga?.id_liga || ''
                document.getElementById('teamModalLabel').textContent = 'Edit Team'
                teamModal.show()
            }
        })

        $('#teamTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar equipo?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteTeam(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getTeamData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}