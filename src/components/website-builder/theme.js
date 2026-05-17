export const THEMES = {
    blue: {
        primary: "#2563eb",
        light: "#eff6ff",
        grad: ["#1d4ed8", "#3b82f6"],
    },

    purple: {
        primary: "#7c3aed",
        light: "#f5f3ff",
        grad: ["#6d28d9", "#a78bfa"],
    },

    green: {
        primary: "#16a34a",
        light: "#f0fdf4",
        grad: ["#15803d", "#4ade80"],
    },

    orange: {
        primary: "#ea580c",
        light: "#fff7ed",
        grad: ["#c2410c", "#fb923c"],
    },

    rose: {
        primary: "#e11d48",
        light: "#fff1f2",
        grad: ["#be123c", "#fb7185"],
    },

    teal: {
        primary: "#0d9488",
        light: "#f0fdfa",
        grad: ["#0f766e", "#2dd4bf"],
    },

    indigo: {
        primary: "#4338ca",
        light: "#eef2ff",
        grad: ["#3730a3", "#818cf8"],
    },

    amber: {
        primary: "#d97706",
        light: "#fffbeb",
        grad: ["#b45309", "#fcd34d"],
    },

    cyan: {
        primary: "#0891b2",
        light: "#ecfeff",
        grad: ["#0e7490", "#67e8f9"],
    },

    pink: {
        primary: "#db2777",
        light: "#fdf2f8",
        grad: ["#be185d", "#f472b6"],
    },

    slate: {
        primary: "#475569",
        light: "#f8fafc",
        grad: ["#1e293b", "#64748b"],
    },

    emerald: {
        primary: "#059669",
        light: "#ecfdf5",
        grad: ["#047857", "#34d399"],
    },
};

export const getTheme = (
  name
) => THEMES[name] || THEMES.blue;