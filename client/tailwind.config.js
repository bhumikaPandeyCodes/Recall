/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily:{
			headFont: ["Kalnia", "serif"]
		},
      borderWidth:{
        1:"1px"
      },
      
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

