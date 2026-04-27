import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			palatino: [
  				'Palatino Linotype',
  				'Palatino',
  				'Book Antiqua',
  				'Georgia',
  				'serif'
  			],
  			display: [
  				'Palatino Linotype',
  				'Palatino',
  				'Book Antiqua',
  				'Georgia',
  				'serif'
  			],
  			sans: [
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		colors: {
  			navy: {
  				'500': '#334155',
  				'600': '#1e293b',
  				'700': '#111827',
  				'800': '#0f172a',
  				'900': '#0a0f1e',
  				'950': '#050912'
  			},
  			gold: {
  				'300': '#e8c47a',
  				'400': '#d4a84b',
  				'500': '#b8902a',
  				'600': '#9a7520'
  			},
  			cream: {
  				'50': '#faf7f2',
  				'100': '#f5f0e8',
  				'200': '#e8e0d0'
  			}
  		},
  		animation: {
  			float: 'float 4s ease-in-out infinite',
  			'count-up': 'count-up 2s ease-out forwards',
  			'slide-up': 'slide-up 0.6s ease-out forwards',
  			marquee: 'marquee 20s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-12px)'
  				}
  			},
  			'count-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-50%)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
