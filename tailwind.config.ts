import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			display: [
  				'Space Grotesk',
  				'sans-serif'
  			],
  			body: [
  				'DM Sans',
  				'sans-serif'
  			]
  		},
  		colors: {
  			brand: {
  				slate: '#0f172a',
  				amber: '#f59e0b',
  				'amber-light': '#fbbf24',
  				'amber-dark': '#d97706',
  				cream: '#fffbf5',
  				warm: '#f8f4ef'
  			}
  		},
  		animation: {
  			'fade-up': 'fadeUp 0.6s ease-out forwards',
  			'fade-in': 'fadeIn 0.4s ease-out forwards',
  			'slide-right': 'slideRight 0.4s ease-out forwards',
  			'count-up': 'countUp 2s ease-out forwards',
  			'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			countUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.5)'
  				},
  				'50%': {
  					transform: 'scale(1.1)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			pulseGlow: {
  				'0%, 100%': {
  					boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px 8px rgba(245, 158, 11, 0.1)'
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
  plugins: [],
};

export default config;
