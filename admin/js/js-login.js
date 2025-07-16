const loginForm = document.getElementById('login-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const loginButton = loginForm.querySelector('button')

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = emailInput.value
    const password = passwordInput.value

    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm spinner-border-white" role="status"></span> Iniciando...'
    loginButton.disabled = true

    try {
        const result = await window.api.loginUser({ username: email, password: password })
        console.log('Resultado del login:', result)
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Redirigiendo...',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                window.api.loadMainWindow()
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Credenciales incorrectas'
            })
            loginButton.innerHTML = 'Entrar'
            loginButton.disabled = false
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.'
        })
        loginButton.innerHTML = 'Entrar'
        loginButton.disabled = false
    }
})