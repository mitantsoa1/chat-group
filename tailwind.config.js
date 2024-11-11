module.exports = {
  content: ["./assets/**/*.{js,jsx,ts,tsx}", "./templates/**/*.{html,twig}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },

      colors: {
        dark: "rgb(var(--color-dark) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        ternary: "rgb(var(--color-ternary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        "card-bg": "rgb(var(--color-card-bg) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        // social: "rgb(var(--color-social) / <alpha-value>)",
        // tech: "rgb(var(--color-tech) / <alpha-value>)",
        // contact: "rgb(var(--color-contact) / <alpha-value>)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: true,
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
