async function initMatchesPage() {
    const matchModal = new bootstrap.Modal(document.getElementById('matchModal'))
    const matchForm = document.getElementById('matchForm')
    const statsForm = document.getElementById('statsForm')
    const matchIdInput = document.getElementById('matchId')
    const matchDateInput = document.getElementById('date')
    const matchThreeSixFiveUrl = document.getElementById('threesixfive')
    const matchFotmobUrl = document.getElementById('fotmob')
    const matchDataUrl = document.getElementById('datafactory')
    const uploadDataBtn = document.getElementById('upload-data-btn')

    mostrarSpinnerTabla('partidos-table-body', 'Cargando partidos...')

    await cargarCatalogos()

    const ligaSelect = document.getElementById('selectLeague')
    ligaSelect.innerHTML = window._catalogos.ligas.map(l =>
        `<option value="${l.id_liga}">${l.nombre_liga}</option>`
    ).join('')

    const seasonSelect = document.getElementById('selectSeason')
    seasonSelect.innerHTML = window._catalogos.seasons.map(l =>
        `<option value="${l.id_temporada}">${l.nombre_temporada}</option>`
    ).join('')

    const homeTeamSelect = document.getElementById('selectTeamHome')
    homeTeamSelect.innerHTML = window._catalogos.teams.map(l =>
        `<option value="${l.id_equipo}">${l.nombre_equipo}</option>`
    ).join('')

    const awayTeamSelect = document.getElementById('selectTeamAway')
    awayTeamSelect.innerHTML = window._catalogos.teams.map(l =>
        `<option value="${l.id_equipo}">${l.nombre_equipo}</option>`
    ).join('')

    const estadoSelect = document.getElementById('selectState')
    estadoSelect.innerHTML = window._catalogos.estados.map(e =>
        `<option value="${e.id_estado}">${e.nombre_estado}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getMatchData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('partidos-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#matchTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_partido', title: 'ID' },
                { data: 'dia', title: 'Date' },
                { 
                    data: 'equipo_local',
                    title: 'Home Name',
                    render: equipo_local => `<span class="badge bg-primary">${equipo_local?.nombre_equipo || 'Sin Equipo'}</span>`
                },
                { 
                    data: 'equipo_visita',
                    title: 'Away Name',
                    render: equipo_visita => `<span class="badge bg-primary">${equipo_visita?.nombre_equipo || 'Sin Equipo'}</span>`
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
                    data: 'temporada',
                    title: 'Season',
                    render: temporada => `<span class="badge bg-success">${temporada?.nombre_temporada || 'Sin Temporada'}</span>`
                },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_partido}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_partido}"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-sm btn-info stats-btn" data-id="${row.id_partido}"><i class="fas fa-chart-bar"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún partido encontrado",
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
        document.getElementById('addNewMatchBtn').onclick = () => {
            matchForm.reset()
            matchIdInput.value = ''
            document.getElementById('matchModalLabel').textContent = 'Add New Match'
            matchModal.show()
        }

        matchForm.onsubmit = async (e) => {
            e.preventDefault()
            const id_liga = ligaSelect.value.trim()
            const id_temporada = seasonSelect.value.trim()
            const dia = matchDateInput.value.trim()
            const id_equipo_local = homeTeamSelect.value.trim()
            const id_equipo_visita = awayTeamSelect.value.trim()
            const enlace_threesixfive = matchThreeSixFiveUrl.value.trim()
            const enlace_fotmob = matchFotmobUrl.value.trim()
            const enlace_datafactory = matchDataUrl.value.trim()
            const id_estado = estadoSelect.value.trim()
            const id = matchIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateMatch({ 
                    id: parseInt(id), 
                    id_liga, 
                    id_temporada, 
                    dia, 
                    id_equipo_local, 
                    id_equipo_visita,
                    enlace_threesixfive,
                    enlace_fotmob,
                    enlace_datafactory,
                    id_estado
                })
                success = !!updated
            } else {
                const created = await window.api.addMatch({ 
                    id_liga, 
                    id_temporada, 
                    dia, 
                    id_equipo_local, 
                    id_equipo_visita,
                    enlace_threesixfive,
                    enlace_fotmob,
                    enlace_datafactory,
                    id_estado
                })
                success = !!created
            }

            if (success) {
                matchModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#matchTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_partido === id)
            if (data) {
                ligaSelect.value = data.liga?.id_liga || ''
                seasonSelect.value = data.temporada?.id_temporada || ''
                matchDateInput.value = data.dia
                homeTeamSelect.value = data.equipo_local?.id_equipo || ''
                awayTeamSelect.value = data.equipo_visita?.id_equipo || ''
                matchThreeSixFiveUrl.value = data.enlace_threesixfive
                matchFotmobUrl.value = data.enlace_fotmob
                matchDataUrl.value = data.enlace_datafactory
                estadoSelect.value = data.estado?.id_estado || ''
                document.getElementById('matchModalLabel').textContent = 'Edit Match'
                matchModal.show()
            }
        })

        $('#matchTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar partido?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteMatch(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        let existeEstadistica = false
        $('#matchTable').on('click', '.stats-btn', function () {
            const partidoId = $(this).data('id')
            const rowData = table.row($(this).parents('tr')).data()
            const stats = rowData.estadisticas || {}

            existeEstadistica = !!stats

            const estadisticas = {
                FTHG: stats?.FTHG || 0,
                FTAG: stats?.FTAG || 0,
                FTR: stats?.FTR || '',
                HTHG: stats?.HTHG || 0,
                HTAG: stats?.HTAG || 0,
                HTR: stats?.HTR || '',
                HS: stats?.HS || 0,
                AS_: stats?.AS_ || 0,
                HST: stats?.HST || 0,
                AST: stats?.AST || 0,
                HF: stats?.HF || 0,
                AF: stats?.AF || 0,
                HC: stats?.HC || 0,
                AC: stats?.AC || 0,
                HY: stats?.HY || 0,
                AY: stats?.AY || 0,
                HR: stats?.HR || 0,
                AR: stats?.AR || 0,
            }

            $('#statsForm')[0].reset()
            $('#statsForm [name="id_partido"]').val(partidoId)
            for (const key in estadisticas) {
                $(`#statsForm input[name="${key}"]`).val(estadisticas[key])
            }

            $('#statsModal').modal('show')
        })

        $('#statsForm').on('submit', async function (e) {
            e.preventDefault()

            const formData = $(this).serializeArray()
            const data = {}
            formData.forEach(item => {
                // Si está vacío, usar null, si es número, parsear
                data[item.name] = item.value === '' ? null : isNaN(item.value) ? item.value : parseInt(item.value)
            })
            
            const id = data.id_partido
            delete data.id_partido

            let success = false

            try {
                if (existeEstadistica) {
                    const updated = await window.api.updateStats({ id_partido: parseInt(idPartido), ...data })
                    success = !!updated
                } else {
                    const created = await window.api.addStats({ id_partido: parseInt(idPartido), ...data })
                    success = !!created
                }

                if (success) {
                    mostrarAlertaExito('Estadísticas guardadas correctamente');
                    $('#statsModal').modal('hide');
                    reloadTable();
                } else {
                    mostrarAlertaError('Fallo al guardar las estadísticas');
                }
            } catch (error) {
                mostrarAlertaError('Error de ejecución: ' + error.message);
            }
        })

        // Manejador para el botón de subir datos
        uploadDataBtn.onclick = async () => {
            const result = await Swal.fire({
                title: 'Subir Datos de Partidos',
                text: 'Selecciona un archivo CSV o Excel con los datos de partidos y estadísticas.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Seleccionar Archivo',
                cancelButtonText: 'Cancelar'
            })

            if (!result.isConfirmed) {
                showAlert('info', 'Cancelado', 'No se seleccionó ningún archivo.')
                return
            }

            const filePath = await window.api.openFileDialog()
            if (!filePath) {
                showAlert('info', 'Cancelado', 'No se seleccionó ningún archivo.')
                return
            }

            // Mostrar spinner antes del await
            Swal.fire({
                title: 'Subiendo archivo...',
                html: 'Por favor espera mientras se procesa el archivo.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            // Espera el resultado mientras se muestra el spinner
            const uploadResult = await window.api.uploadMatchData(filePath)

            // Cierra el spinner
            Swal.close()

            // Mostrar resultado
            if (uploadResult.success) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Subida Exitosa!',
                    text: uploadResult.message || 'Archivo procesado con éxito.',
                    timer: 3000,
                    timerProgressBar: true
                })
                loadMatches()
                updateDashboard()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Subida',
                    text: uploadResult.message || 'No se pudo subir el archivo.'
                })
            }
        }

        async function reloadTable() {
            const newData = await window.api.getMatchData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}