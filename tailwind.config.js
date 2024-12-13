/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/**/*.js",
  ],
  plugins: [require("flowbite/plugin"), require("tailwindcss-animate")],
  theme: {
  	extend: {
  		keyframes: {
  			typing: {
  				from: {
  					width: '0'
  				},
  				to: {
  					width: '100%'
  				}
  			},
  			blink: {
  				'from, to': {
  					borderColor: 'transparent'
  				},
  				'50%': {
  					borderColor: 'orange'
  				}
  			}
  		},
  		animation: {
  			typing: 'typing 3.5s steps(40, end) forwards, blink 0.75s step-end infinite'
  		},
  		marginBottom: {
  			small: '2px'
  		},
  		fontFamily: {
  			inter: [
  				'inter',
  				'sans-serif'
  			]
  		},
  		colors: {
  			menu: '#fafafc',
  			red: '#ff0000',
  			hover: '#ebebeb',
  			userchat: '#f4f4f4',
  			footer: '#000000',
  			footerBackground: '#f4f4f4',
  			footerHover: '#626262',
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
  			}
  		},
  		width: {
  			'115': '115px',
  			catalog: '380px',
  			menu: '240px',
  			page: '1500px'
  		},
  		height: {
  			catalog: '560px',
  			hero: '550px'
  		},
  		backgroundImage: {
  			'fade-left': 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(250, 250, 252, 0.5))'
  		},
  		scale: {
  			'111': '1.1'
  		},
  		minHeight: {
  			pdf: '80%',
  			pdfbar: '63px',
  			hero: '600px'
  		},
  		minWidth: {
  			menu: '240px',
  			hero: '600px'
  		},
  		maxHeight: {
  			menu: '200px',
  			pdfbar: '64px'
  		},
  		maxWidth: {
  			page: '1500px',
  			about: '1248px'
  		},
  		flex: {
  			'7': '7 1 0%'
  		},
  		zIndex: {
  			'5': '5',
  			'6': '6'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
};
