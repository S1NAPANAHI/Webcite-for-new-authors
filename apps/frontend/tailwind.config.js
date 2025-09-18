/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			heading: [
  				'Orbitron',
  				'sans-serif'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Georgia',
  				'serif'
  			]
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				dark: '#b91c1c',
  				light: '#fca5a5',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				dark: '#d97706',
  				light: '#fcd34d',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				dark: '#00838f',
  				light: '#4dd0e1',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			text: {
  				DEFAULT: '#e0e0e0',
  				dark: '#a0a0a0',
  				light: '#ffffff',
  				rose: '#fecaca',
  				amber: '#fcd34d'
  			},
            light: {
              background: '#f8f5f0', // Soft beige
              surface: '#ffffff',   // White for cards/surfaces
              primary: '#8b5a2b',   // Warm brown
              secondary: '#6b4e3c', // Darker brown
              accent: '#d4a76a',    // Gold accent
              text: '#3a3a3a',      // Dark gray for text
              muted: '#8a8a8a'      // Muted text
            },
  			border: 'hsl(var(--border))',
  			success: '#28a745',
  			error: '#dc3545',
  			info: '#17a2b8',
  			warning: '#ffc107',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  corePlugins: {
    preflight: true,
  },
}