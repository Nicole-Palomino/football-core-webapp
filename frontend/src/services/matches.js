import axiosInstance from '../services/axiosConfig'
import { setToken, getToken } from './auth'

// -------------------------------------- matches --------------------------------------

// get all the matches by season and state
export const getMatchAll = async (seasonId) => {
    try {
        const response = await axiosInstance.get(`/partidos/season/${seasonId}`)
        return response.data
    } catch (err) {
        throw err
    }
}
// get all the matches by teams
export const getMatchesTeams = async (teams) => {
    try {
        const response = await axiosInstance.get(`/partidos/h2h/${teams.equipo_1_id}&${teams.equipo_2_id}`)
        console.log('h2h: ',response)
        return response.data
    } catch (err) {
        throw err
    }
}
// get all stats the matches
export const getMatchesStats = async (teams) => {
    try {
        const response = await axiosInstance.get(`/partidos/historicos/${teams.equipo_1_id}&${teams.equipo_2_id}`)
        return response.data
    } catch (err) {
        throw err
    }
}

export const getMatcheByID = async (teams) => {
    try {
        const response = await axiosInstance.get(`/partidos/by-id/${teams.id_partido}`)
        return response.data
    } catch (err) {
        throw err
    }
}