window.api.onAuthExpired(() => {
    console.log('Token expirado. Redirigiendo al login...');
    window.location.href = 'login.html';
});
