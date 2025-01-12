/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF6B6B',   // Coral red for light mode
          dark: '#FF8787',    // Lighter coral for dark mode
        },
        secondary: {
          light: '#4ECDC4',   // Turquoise for light mode
          dark: '#66E3DA',    // Lighter turquoise for dark mode
        },
        background: {
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(0, 0, 0, 0.8)',
        }
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-100": "rgba(255,255,255,0.8)",
          "primary": "#FF6B6B",
          "secondary": "#4ECDC4",
          "neutral": "#1F2937",        // Dark text for light mode
          "neutral-content": "#F3F4F6" // Light text for dark mode
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "rgba(0,0,0,0.8)",
          "primary": "#FF8787",
          "secondary": "#66E3DA",
          "neutral": "#F3F4F6",        // Light text for dark mode
          "neutral-content": "#1F2937" // Dark text for light mode
        }
      },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]'],
}
