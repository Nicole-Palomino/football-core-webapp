export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getInitials = (name) => {
    if (!name) return ''
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
}