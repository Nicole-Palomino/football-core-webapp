import IconButton from "@mui/material/IconButton"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { useFavoritos } from "../../../hooks/FavoritosContext"
import { useTheme } from "@mui/material"

const FavoriteStar = ({ partidoId }) => {
    const theme = useTheme()
    const { favoritos, toggleFavorite, addFavoriteMutation, deleteFavoriteMutation } = useFavoritos()
    const favorito = favoritos.some(fav => fav.id_partido === partidoId)

    const loading = addFavoriteMutation.isLoading || deleteFavoriteMutation.isLoading

    const handleClick = async () => {
        toggleFavorite(partidoId)
    }

    return (
        <IconButton onClick={handleClick} disabled={loading} aria-label="favorito">
            {favorito ? (
                <StarIcon sx={{ fontSize: 25, color: theme.custom.amarillo }} />
            ) : (
                <StarBorderIcon sx={{ fontSize: 25, color: theme.palette.text.primary }} />
            )}
        </IconButton>
    )
}

export default FavoriteStar;
