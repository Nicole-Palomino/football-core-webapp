export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const formatOnlyTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`)
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

export const formatTime = (timeString) => {
    if (!timeString) return ""

    // Si viene "HH:mm", le agregamos ":00"
    const normalized = timeString.length === 5 ? `${timeString}:00` : timeString

    const date = new Date(`1970-01-01T${normalized}`)
    return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

export const formatOnlyDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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

export const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
}