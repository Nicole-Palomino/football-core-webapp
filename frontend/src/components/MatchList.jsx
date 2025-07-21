import { useState } from 'react'
import { List, ListItem, Grid, Box, Typography, IconButton, Tooltip, Modal, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,  CircularProgress, Avatar } from "@mui/material"
import AutoFixHigh from "@mui/icons-material/AutoFixHigh"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { formatFecha } from '../services/encryptionService'
import { getMatchesTeams, getMatchesStats, getMatcheByID } from '../services/matches'
// import { getWinsDrawLoses, getMatchById, getAvgGoals, getFoulsTargetCorner, getTablePosition, getH2H, getUltimosPartidos } from "../../services/api"
import { HorizontalRule } from "@mui/icons-material"
import { a11yProps, CustomTabPanel } from '../utils/a11yProps'
import { motion } from "framer-motion"
import PieChart from './PieChart'
import RadarCharts from './Radar'
import Barra from './Radar'
import TotalMatch from './TotalMatch'

const MatchList = ({ partidos }) => {

    const [open, setOpen] = useState(false)
    const [stats, setStats] = useState([])
    const [match, setMatch] = useState([])
    const [goal, setGoals] = useState([])
    const [fouls, setFouls] = useState([])
    const [table, setTable] = useState([])
    const [local, setLocal] = useState([])
    const [visita, setVisita] = useState([])
    const [h2hMatches, setH2HMatches] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTeams, setSelectedTeams] = useState({ team1: null, team2: null })
    const [valueH2H, setValueH2H] = useState(0)
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => { setValue(newValue) }
    const handleChangeH2H = (event, newValue) => { setValueH2H(newValue) }

    const handleOpen = async (team1_id, team2_id, partido_id) => {
        setOpen(true)
        setIsLoading(true)
        
        let winsDrawLoses, partidos, goals, foulsTargetCorner, response, h2h, equipoLocal, equipoVisita
        
        try {
            const matchesData = await getMatchesTeams({ equipo_1_id: team1_id, equipo_2_id: team2_id })
            setH2HMatches(matchesData || [])

            const matchesStats = await getMatchesStats({ equipo_1_id: team1_id, equipo_2_id: team2_id })
            setStats(matchesStats || [])

            const getMatchId = await getMatcheByID({ id_partido: partido_id })
            setMatch(getMatchId || [])
            // [winsDrawLoses, partidos, goals, foulsTargetCorner, response, h2h, equipoLocal, equipoVisita] = await Promise.all([
            //     getWinsDrawLoses(team1_id, team2_id),
            //     getMatchById(id_partido),
            //     getAvgGoals(team1_id, team2_id),
            //     getFoulsTargetCorner(team1_id, team2_id),
            //     getTablePosition(leagueId),
            //     getH2H(team1_id, team2_id),
            //     getUltimosPartidos(team1_id),
            //     getUltimosPartidos(team2_id)
            // ])

            // setStats(winsDrawLoses?.[0] || {})
            // setMatch(partidos || [])
            // setGoals(goals?.[0] || {})
            // setFouls(foulsTargetCorner?.[0] || {})
            // setTable(response || [])
            // setH2HMatches(h2h || [])
            // setLocal(equipoLocal || [])
            // setVisita(equipoVisita || [])
        } catch (error) {
            console.error("Error al obtener estadísticas", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setOpen(false)
        setStats(null)
    }

    const matchArray = Array.isArray(match) ? match : [match]
    console.log('matcharray', matchArray)

    return (
        <div>
            <List sx={{ color: "white" }}>
                {partidos.map((partido, index) => (
                    <ListItem key={index}
                        alignItems="center"
                        sx={{ borderBottom: "1px solid #E0E0E0", fontFamily: "cursive" }}>
                        <Grid container alignItems="center" spacing={2} justifyContent="space-between" sx={{ display: "flex", flexWrap: "nowrap" }}>
                            <Grid item xs="auto" sx={{ display: "flex", alignItems: "center" }}>
                                <StarBorderIcon sx={{ fontSize: "20px" }} />{" "}
                            </Grid>

                            {/* Equipos */}
                            <Grid item xs={7} sm={5} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, textAlign: "left" }}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",width: "100%" }}>
                                    <Typography noWrap sx={{ minWidth: "106px", fontSize: '13px', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {partido.equipo_local.nombre_equipo}
                                    </Typography>
                                    <Avatar alt={partido.equipo_local.nombre_equipo} src={partido.equipo_local.logo}
                                        sx={{ 
                                            width: 25, 
                                            height: 25, 
                                            marginRight: 3, 
                                            // backgroundColor: '#f5f5dc', 
                                            '& img': {
                                                objectFit: 'contain'
                                            }
                                        }} />
                                    <Typography noWrap sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px', minWidth: "28px",  }}>
                                        {partido.estadisticas?.FTHG ?? " "}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center",width: "100%" }}>
                                    <Typography noWrap sx={{ minWidth: "106px", fontSize: '13px', overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {partido.equipo_visita.nombre_equipo}
                                    </Typography>
                                    <Avatar alt={partido.equipo_visita.nombre_equipo} src={partido.equipo_visita.logo}
                                        sx={{ 
                                            width: 25, 
                                            height: 25, 
                                            marginRight: 3, 
                                            // backgroundColor: '#f5f5dc', 
                                            '& img': {
                                                objectFit: 'contain'
                                            }
                                        }} />
                                    <Typography noWrap sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '13px', minWidth: "28px" }}>
                                        {partido.estadisticas?.FTAG ?? " "}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={4} sm={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                <Typography variant="body1" sx={{ color: "white", fontSize: "11px", textAlign: "center", mb: 1 }}>
                                    {formatFecha(partido.dia)}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                    <Tooltip title="Pronósticos">
                                        <IconButton>
                                            <AutoFixHigh sx={{ color: "white" }} />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Info">
                                        <IconButton onClick={() => handleOpen(partido.equipo_local.id_equipo, partido.equipo_visita.id_equipo, partido.id_partido)}>
                                            <InfoOutlined sx={{ color: "white" }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{ 
                    width: { xs: "90%", sm: "80%", md: 600 }, 
                    // height: { xs: "60vh", sm: "70vh", md: "60vh" },
                    maxWidth: "95vw",
                    bgcolor: "#202121", 
                    // padding: 3, 
                    borderRadius: 3, 
                    border: '2px solid #202121',
                    margin: "auto", 
                    mt: { xs: 5, sm: 8, md: 4 },
                    overflowY: "auto",
                    maxHeight: "90vh" }}>
                    { isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100vh",
                                width: "100%",
                            }}>
                                <CircularProgress size={80} sx={{ color: '#228B22' }} />
                                <Typography mt={2} variant="h6" sx={{ color: '#228B22' }}>
                                    Cargando datos...
                                </Typography>
                        </Box>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}>
                                {match ? (
                                    <>
                                        { matchArray.map((partidoID, index) => {
                                            return (
                                                <Grid container spacing={0} key={index}>
                                                    {/* Header - Liga */}
                                                    <Grid item xs={12} sx={{ backgroundColor: '#0e0f0f', width: '100%', padding: '2px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <span className="text-white font-subtitle text-xl">
                                                            {/* {partidoID.pais}: {partidoID.nombre_liga} */}
                                                            {partidoID.liga?.nombre_liga}
                                                        </span>
                                                    </Grid>

                                                    {/* Estadio */}
                                                    <Grid item xs={12} sx={{ width: '100%', padding: '2px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <span className="text-white font-subtitle text-sm">
                                                            {partidoID.equipo_local?.estadio}
                                                        </span>
                                                    </Grid>

                                                    {/* Equipos y marcador en una sola fila */}
                                                    <Box  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, width: '100%', paddingX: '9px' }}>
                                                        {/* Local */}
                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            <Avatar alt={partidoID.equipo_local?.nombre_equipo} src={partidoID.equipo_local?.logo} 
                                                                sx={{ width: 67, height: 67, '& img': { objectFit: 'contain' } }} />
                                                            <span className="text-white font-subtitle text-md mt-3">
                                                                {partidoID.equipo_local?.nombre_equipo}
                                                            </span>
                                                        </Box>

                                                        {/* Marcador */}
                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            <span className="text-white font-subtitle text-sm">
                                                                {formatFecha(partidoID.dia)}
                                                            </span>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <span className="text-white font-subtitle text-6xl">
                                                                    {partidoID.estadisticas?.FTHG ?? " "}
                                                                </span>
                                                                <span className="text-white font-subtitle text-6xl">
                                                                    <HorizontalRule />
                                                                </span>
                                                                <span className="text-white font-subtitle text-6xl">
                                                                    {partidoID.estadisticas?.FTAG ?? " "}
                                                                </span>
                                                            </div>
                                                        </Box>

                                                        {/* Visita */}
                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            <Avatar alt={partidoID.equipo_visita?.nombre_equipo} src={partidoID.equipo_visita?.logo} 
                                                                sx={{ width: 67, height: 67, '& img': { objectFit: 'contain' } }} />
                                                            <span className="text-white font-subtitle text-md mt-3">
                                                                {partidoID.equipo_visita?.nombre_equipo}
                                                            </span>
                                                        </Box>
                                                    </Box>

                                                    <Grid item xs={12} sx={{ width: '100%', padding: '2px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                                <Tabs 
                                                                    value={value} 
                                                                    onChange={handleChange} 
                                                                    aria-label="basic tabs example"
                                                                    variant="scrollable"
                                                                    allowScrollButtonsMobile
                                                                    sx={{
                                                                        "& .MuiTabs-indicator": { backgroundColor: "#00FF88" },
                                                                        "& .MuiTab-root": { color: "white", fontFamily: "cursive" },
                                                                        "& .MuiTab-root.Mui-selected": { color: "#00FF88" },
                                                                        "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 },
                                                                        "& .MuiButtonBase-root.MuiTabs-scrollButtons": { color: "#00FF88" }
                                                                    }}>
                                                                        <Tab label="Análisis" {...a11yProps(0)} sx={{ color: 'white', fontFamily: 'cursive' }}/>
                                                                        <Tab label="H2H" {...a11yProps(1)} sx={{ color: 'white', fontFamily: 'cursive' }}/>
                                                                </Tabs>
                                                            </Box>

                                                            <CustomTabPanel value={value} index={0}>
                                                                <div className='mb-4'>
                                                                    <TotalMatch totalMatches={stats.total_partidos} />
                                                                </div>

                                                                <div className='mb-4'>
                                                                    <PieChart stats={stats}/>
                                                                </div>

                                                                <div className='mb-4'>
                                                                    <Barra 
                                                                        label="⚽ Goles Totales ⚽"
                                                                        localName={match.equipo_local?.nombre_equipo}
                                                                        visitanteName={match.equipo_visita?.nombre_equipo}
                                                                        localValue={stats.goles_local}
                                                                        visitanteValue={stats.goles_visitante}/>
                                                                </div>

                                                                <div className='mb-4'>    
                                                                    <Barra 
                                                                        label="🥅 Tiros Totales 🥅"
                                                                        localName={match.equipo_local?.nombre_equipo}
                                                                        visitanteName={match.equipo_visita?.nombre_equipo}
                                                                        localValue={stats.total_tiros_local}
                                                                        visitanteValue={stats.total_tiros_visitante}/>
                                                                </div>

                                                                <div className='mb-4'>    
                                                                    <Barra 
                                                                        label="🎯 Tiros al Arco 🎯"
                                                                        localName={match.equipo_local?.nombre_equipo}
                                                                        visitanteName={match.equipo_visita?.nombre_equipo}
                                                                        localValue={stats.tiros_arco_local}
                                                                        visitanteValue={stats.tiros_arco_visitante}/>
                                                                </div>

                                                                <div className='mb-4'>    
                                                                    <Barra 
                                                                        label="🚩 Tiros de Esquina 🚩"
                                                                        localName={match.equipo_local?.nombre_equipo}
                                                                        visitanteName={match.equipo_visita?.nombre_equipo}
                                                                        localValue={stats.corners_local}
                                                                        visitanteValue={stats.corners_visitante}/>
                                                                </div>
                                                            </CustomTabPanel>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }) }
                                    </> 
                                ) : (
                                    <Typography color="white">No hay estadísticas disponibles</Typography>
                                )}
                        </motion.div>
                        )
                    }   
                </Box>
            </Modal>
        </div>
    )
}

export default MatchList