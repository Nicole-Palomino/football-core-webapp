import { useState } from 'react'
import { Box, Container, useTheme } from '@mui/material'
import { getTeams } from '../services/functions'
import CustomAnalysis from '../components/Dashboard/Details/CustomAnalysis'
import CustomStats from '../components/Dashboard/Details/CustomStats'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import SelectionControls from '../components/Forms/controls/SelectionControls'
import Header from '../components/Forms/controls/Header'
import LoadingMessage from '../components/Loading/LoadingMessage'
import { useLeagues } from '../hooks/useLeagues'

const Analysis = () => {

    const [loading, setLoading] = useState(false)
    const [equipos, setEquipos] = useState([])
    const [selectedLiga, setSelectedLiga] = useState('')
    const [selectedEquipo1, setSelectedEquipo1] = useState('')
    const [selectedEquipo2, setSelectedEquipo2] = useState('')
    const [showAnalysis, setShowAnalysis] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const theme = useTheme()

    const { ligas, isLoading } = useLeagues()

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    const fetchEquipos = async (liga) => {
        try {
            setLoading(true)
            const response = await getTeams(liga)
            setEquipos(response.equipos || [])
        } catch (error) {
            console.error('Error fetching equipos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLigaChange = (event) => {
        const liga = event.target.value
        setSelectedLiga(liga)
        setEquipos([])
        setSelectedEquipo1('')
        setSelectedEquipo2('')
        setShowAnalysis(false)
        setShowStats(false)
        if (liga) {
            fetchEquipos(liga)
        }
    }

    const handleEquipo1Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo1(equipo)
        setShowAnalysis(false)
        setShowStats(false)
    }

    const handleEquipo2Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo2(equipo)
        setShowAnalysis(false)
        setShowStats(false)
    }

    const handleShowAnalysis = () => {
        if (selectedLiga && selectedEquipo1 && selectedEquipo2) {
            setShowAnalysis(true)
            setShowStats(true)
        }
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            background: theme.palette.background.default
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header */}
                <Header 
                    title='Análisis Avanzado'
                    subtitle='Análisis estadístico profundo entre equipos'/>

                {/* Selection Controls */}
                <SelectionControls 
                    selectedLiga={selectedLiga}
                    handleLigaChange={handleLigaChange}
                    selectedEquipo1={selectedEquipo1}
                    handleEquipo1Change={handleEquipo1Change}
                    selectedEquipo2={selectedEquipo2}
                    handleEquipo2Change={handleEquipo2Change}
                    handleShowAnalysis={handleShowAnalysis}
                    ligas={ligas}
                    equipos={equipos}
                    loading={loading}/>

                {showAnalysis && (
                    <>
                        <CustomStats
                            nombre_liga={selectedLiga}
                            equipo_local={selectedEquipo1}
                            equipo_visita={selectedEquipo2}
                        />

                        <CustomAnalysis
                            nombre_liga={selectedLiga}
                            equipo_local={selectedEquipo1}
                            equipo_visita={selectedEquipo2}
                        />
                    </>
                )}

                {/* No analysis message */}
                {!showAnalysis && !loading && (
                    <LoadingMessage />
                )}
            </Container>
        </Box>
    )
}

export default Analysis