import IconButton from "@mui/material/IconButton"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { useFavoritos } from "../../../hooks/FavoritosContext"

const FavoriteStar = ({ partidoId }) => {
    const { favoritos, toggleFavorite, addFavoriteMutation, deleteFavoriteMutation } = useFavoritos()
    const favorito = favoritos.some(fav => fav.id_partido === partidoId)

    const loading = addFavoriteMutation.isLoading || deleteFavoriteMutation.isLoading

    const handleClick = async () => {
        toggleFavorite(partidoId)
    }

    return (
        <IconButton onClick={handleClick} disabled={loading} aria-label="favorito">
            {favorito ? (
                <StarIcon sx={{ fontSize: 25, color: "gold" }} />
            ) : (
                <StarBorderIcon sx={{ fontSize: 25, color: "white" }} />
            )}
        </IconButton>
    )
}

export default FavoriteStar;
