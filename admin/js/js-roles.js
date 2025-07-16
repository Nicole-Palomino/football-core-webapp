async function initRolesPage() {
    const roleModal = new bootstrap.Modal(document.getElementById('roleModal'))
    const roleForm = document.getElementById('roleForm')
    const roleIdInput = document.getElementById('roleId')
    const roleNameInput = document.getElementById('roleName')

    mostrarSpinnerTabla('roles-table-body', 'Cargando roles...')
    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getRoleData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('roles-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#roleTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_rol', title: 'ID' },
                { data: 'nombre_rol', title: 'Role Name' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_rol}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_rol}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún rol encontrado",
            }
        })

        // Eventos de botones
        document.getElementById('addNewRoleBtn').onclick = () => {
            roleForm.reset()
            roleIdInput.value = ''
            document.getElementById('roleModalLabel').textContent = 'Add New Role'
            roleModal.show()
        }

        roleForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre_rol = roleNameInput.value.trim()
            const id = roleIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateRole({ id: parseInt(id), nombre_rol })
                success = !!updated
            } else {
                const created = await window.api.addRole({ nombre_rol })
                success = !!created
            }

            if (success) {
                roleModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#roleTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_rol === id)
            if (data) {
                roleIdInput.value = data.id_rol
                roleNameInput.value = data.nombre_rol
                document.getElementById('roleModalLabel').textContent = 'Edit Role'
                roleModal.show()
            }
        })

        $('#roleTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar rol?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteRole(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getRoleData()
            table.clear().rows.add(newData).draw()
        }
    }, 200) // pequeño retraso para que el loader se vea
}