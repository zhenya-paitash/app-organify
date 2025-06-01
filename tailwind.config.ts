import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },

        // todo: { DEFAULT: "#F9B8AB", foreground: "#A76459" },
        // progress: { DEFAULT: "#FAD59A", foreground: "#BB754B" },
        // review: { DEFAULT: "#8AAAF9", foreground: "#4d57b4" },
        // done: { DEFAULT: "#70E1BB", foreground: "#228B68" },
        // backlog: { DEFAULT: "#D5D5D6", foreground: "#5D5B61" },
        todo: { DEFAULT: 'hsl(11, 89%, 84%)', foreground: 'hsl(10, 31%, 50%)' },
        progress: { DEFAULT: 'hsl(38, 92%, 80%)', foreground: 'hsl(24, 44%, 49%)' },
        review: { DEFAULT: 'hsl(221, 91%, 76%)', foreground: 'hsl(233, 44%, 49%)' },
        done: { DEFAULT: 'hsl(158, 65%, 69%)', foreground: 'hsl(158, 61%, 34%)' },
        backlog: { DEFAULT: 'hsl(240, 2%, 84%)', foreground: 'hsl(255, 3%, 36%)' }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'noise-light': "url('/noise-light.webp')",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
