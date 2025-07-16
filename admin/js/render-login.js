const themes = [
    {
        name: "Clásico Verde Cancha",
        background: "#0B6623",      // verde pasto oscuro
        color: "#FFFFFF",
        primaryColor: "#1DB954"     // verde vibrante
    },
    {
        name: "Rojo Pasión",
        background: "#8B0000",      // rojo oscuro estilo Liverpool
        color: "#FFFFFF",
        primaryColor: "#FF0000"     // rojo fuego
    },
    {
        name: "Azul Profesional",
        background: "#001F54",      // azul marino tipo Chelsea
        color: "#FFFFFF",
        primaryColor: "#007BFF"     // azul eléctrico
    },
    {
        name: "Negro y Amarillo Borussia",
        background: "#121212",
        color: "#FFD700",           // amarillo Borussia
        primaryColor: "#FFB800"
    },
    {
        name: "Blanco y Dorado",
        background: "#FFFFFF",
        color: "#000000",
        primaryColor: "#DAA520"     // dorado elegante
    },
    {
        name: "Gris Moderno Deportivo",
        background: "#2E2E2E",
        color: "#FFFFFF",
        primaryColor: "#00E0FF"     // azul deportivo neón
    }
];


const setTheme = (theme) => {
    const root = document.querySelector(":root");
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--color", theme.color);
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--glass-color", theme.glassColor);
};

const displayThemeButtons = () => {
    const btnContainer = document.querySelector(".theme-btn-container");
    themes.forEach((theme) => {
        const div = document.createElement("div");
        div.className = "theme-btn";
        div.style.cssText = `background: ${theme.background}; width: 25px; height: 25px`;
        btnContainer.appendChild(div);
        div.addEventListener("click", () => setTheme(theme));
    });
};

displayThemeButtons();