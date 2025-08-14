import { TextField, useTheme } from '@mui/material'
import { useForm } from 'react-hook-form'

const TextFieldEmail = () => {

    const { register, formState: { errors } } = useForm()
    const theme = useTheme()

    return (
        <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            type='email'
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
            {...register("correo", {
                required: {
                    value: true,
                    message: "Correo Electrónico requerido"
                },
                pattern: {
                    value: /^[a-z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/i,
                    message: "El correo electrónico debe proceder de Gmail, Hotmail o Outlook"
                }
            })}
            error={!!errors.correo}
            helperText={errors.correo ? errors.correo.message : ''} />
    )
}

export default TextFieldEmail