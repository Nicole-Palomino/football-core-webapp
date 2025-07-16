async function initUsersPage() {
    const userModal = new bootstrap.Modal(document.getElementById('userModal'))
    const userForm = document.getElementById('userForm')
    const userIdInput = document.getElementById('userId')
    const userNameInput = document.getElementById('userName')
    const userEmailInput = document.getElementById('email')
    const userPasswordInput = document.getElementById('password')

    mostrarSpinnerTabla('usuarios-table-body', 'Cargando usuarios...')

    await cargarCatalogos()

    const estadoSelect = document.getElementById('selectEstado')
    estadoSelect.innerHTML = window._catalogos.estados.map(e =>
        `<option value="${e.id_estado}">${e.nombre_estado}</option>`
    ).join('')

    const rolSelect = document.getElementById('selectRol')
    rolSelect.innerHTML = window._catalogos.roles.map(r =>
        `<option value="${r.id_rol}">${r.nombre_rol}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getUserData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('usuarios-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#userTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_usuario', title: 'ID' },
                { data: 'usuario', title: 'Username' },
                { data: 'correo', title: 'Email' },
                {
                    data: 'rol.nombre_rol',
                    title: 'Role',
                    render: nombre => `<span class="badge bg-success">${nombre}</span>`
                },
                { 
                    data: 'estado',
                    title: 'State',
                    render: estado => `<span class="badge bg-danger">${estado?.nombre_estado || 'Sin estado'}</span>`
                },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_usuario}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_usuario}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún usuario encontrado",
            }
        })

        // Eventos de botones
        document.getElementById('addNewUserBtn').onclick = () => {
            userForm.reset()
            userIdInput.value = ''
            document.getElementById('userModalLabel').textContent = 'Add New User'
            userModal.show()
        }

        userForm.onsubmit = async (e) => {
            e.preventDefault()
            const usuario = userNameInput.value.trim()
            const correo = userEmailInput.value.trim()
            const contrasena = userPasswordInput.value.trim()
            const id_estado = estadoSelect.value.trim()
            const id_rol = rolSelect.value.trim()
            const id = userIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateUser({ id: parseInt(id), usuario, correo, contrasena, id_estado, id_rol })
                success = !!updated
            } else {
                const created = await window.api.addUser({ usuario, correo, contrasena, id_estado, id_rol })
                success = !!created
            }

            if (success) {
                userModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#userTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_usuario === id)
            if (data) {
                userIdInput.value = data.id_usuario
                userNameInput.value = data.usuario
                userEmailInput.value = data.correo
                userPasswordInput.value = data.contrasena
                estadoSelect.value = data.estado?.id_estado || ''
                rolSelect.value = data.rol?.id_rol || ''
                document.getElementById('userModalLabel').textContent = 'Edit User'
                userModal.show()
            }
        })

        $('#userTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar usuario?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteUser(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getUserData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}