export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				"brand-red": "#aa0000", // 800
				"brand-red-50": "#ffefef",
				"brand-red-100": "#ffdcdc",
				"brand-red-200": "#ffbfbf",
				"brand-red-300": "#ff9292",
				"brand-red-400": "#ff5454",
				"brand-red-500": "#ff1f1f",
				"brand-red-600": "#ff0000",
				"brand-red-700": "#db0000",
				"brand-red-800": "#aa0000",
				"brand-red-900": "#940808",
				"brand-red-950": "#520000",

				// Brand Gold
				"brand-gold": "#fff6d5",
			},
			gridTemplateColumns: {
				13: "repeat(13, minmax(0, 1fr))",
				14: "repeat(14, minmax(0, 1fr))",
				15: "repeat(15, minmax(0, 1fr))",
				16: "repeat(16, minmax(0, 1fr))",
			},
			container: {
				center: true,
				padding: {
					DEFAULT: "1rem",
					sm: "2rem",
					lg: "4rem",
					xl: "5rem",
					"2xl": "6rem",
				},
			},
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
				"3xl": "1792px",
				"4xl": "2160px",
			},
			fontSize: {
				xs: ".825rem",
				sm: "1rem",
				base: "1.125rem",
				lg: "1.25rem",
				xl: "1.625rem",
				"2xl": "2rem",
				"3xl": "2.5rem",
				"4xl": "3rem",
				"5xl": "4rem",
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
