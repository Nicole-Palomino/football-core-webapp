import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useFavoritos } from "../hooks/FavoritosContext";

const FavoriteStar = ({ partidoId, esFavoritoInicial }) => {
    const { toggleFavorite } = useFavoritos()
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const result = await toggleFavorite(partidoId); // toggleFavorite ya maneja add/delete y actualiza el contexto
        if (result === 'error') {
            console.error("No se pudo actualizar el favorito en el backend.");
        }
        setLoading(false);
    };

    const favorito = esFavoritoInicial;

    return (
        <IconButton onClick={handleClick} disabled={loading} aria-label="favorito">
            {favorito ? (
                <StarIcon sx={{ fontSize: 25, color: "gold" }} />
            ) : (
                <StarBorderIcon sx={{ fontSize: 25, color: "white" }} />
            )}
        </IconButton>
    );
};

export default FavoriteStar;
