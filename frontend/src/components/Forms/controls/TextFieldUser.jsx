import { TextField, useTheme } from '@mui/material'
import { useForm } from 'react-hook-form'

const TextFieldUser = () => {
    const { register, formState: { errors } } = useForm()
    const theme = useTheme()

    return (
        <TextField
            label="Nombre de usuario"
            variant="outlined"
            fullWidth
            autoComplete="off"
            sx={{
                "& label": { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                    color: theme.palette.text.primary,
                    "& fieldset": { borderColor: theme.palette.text.primary },
                    "&:hover fieldset": { borderColor: theme.palette.primary.main },
                },
                "& .Mui-error": {
                    "& label": { color: theme.custom.rojo },
                    "& label.Mui-focused": { color: theme.custom.rojo },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.custom.rojo }
                },
            }}
            {...register("usuario", {
                required: {
                    value: true,
                    message: "Nombre de usuario requerido"
                }
            })}
            error={!!errors.usuario}
            helperText={errors.usuario ? errors.usuario.message : ''} />
    )
}

export default TextFieldUser