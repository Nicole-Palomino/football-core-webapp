export const setToken = (token) => {
    localStorage.setItem("accessToken", token)
}

export const getToken = () => {
    return localStorage.getItem("accessToken") || null
}

export const removeToken = () => {
    localStorage.removeItem("accessToken")
}