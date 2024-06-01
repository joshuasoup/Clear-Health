/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require("flowbite/plugin")
  ],
  theme: {
    extend:{
      fontFamily: {
        'inter': ['inter', 'sans-serif']
      },
      colors:{
        menu: '#fafafc',
        red: '#ff0000',
        hover: '#ebebeb'
      },
      width: {
        115: '115px',
        catalog: '420px',
        menu: "240px",
      },
      backgroundImage: {
        'fade-left': 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(250, 250, 252, 0.5))', 
      },
      scale: {
        '111': '1.1',
      },
      minHeight: {
        'pdf': '80%',
        'pdfbar': '63px',
        
      },
      minWidth: {
        'menu': '240px',
      },
      maxHeight: {
        'menu': '200px',
        'pdfbar': '64px',
      },
      flex: {
        7: '7 1 0%', // flex-grow: 7; flex-shrink: 1; flex-basis: 0%;
      },
    },
  },
};

