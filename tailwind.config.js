export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                // Brand Blue
                'brand-blue': '#243C96',
                'brand-blue-50': '#B7C0EB',
                'brand-blue-100': '#A7B2E7',
                'brand-blue-200': '#8796DE',
                'brand-blue-300': '#677AD5',
                'brand-blue-400': '#475ECC',
                'brand-blue-500': '#334AB8',
                'brand-blue-600': '#2A3D98',
                'brand-blue-700': '#1E2B6C',
                'brand-blue-800': '#121A40',
                'brand-blue-900': '#060814',
                'brand-blue-950': '#000000',

                // Brand Green
                'brand-green': '#74A333',
                'brand-green-50': '#D6F1B6',
                'brand-green-100': '#CCEEA4',
                'brand-green-200': '#B9E782',
                'brand-green-300': '#A6E060',
                'brand-green-400': '#93DA3E',
                'brand-green-500': '#7FC827',
                'brand-green-600': '#69A620',
                'brand-green-700': '#4B7717',
                'brand-green-800': '#2D480E',
                'brand-green-900': '#101905',
                'brand-green-950': '#010100',

                // Brand Light Blue
                'brand-light-blue': '#96D1F2',

                // Brand Gold
                'brand-gold': '#FDB515'
            },
            gridTemplateColumns: {
                13: 'repeat(13, minmax(0, 1fr))',
                14: 'repeat(14, minmax(0, 1fr))',
                15: 'repeat(15, minmax(0, 1fr))',
                16: 'repeat(16, minmax(0, 1fr))'
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                    '2xl': '6rem'
                }
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
                '3xl': '1792px',
                '4xl': '2160px'
            },
            fontSize: {
                xs: '.825rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.625rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
                '4xl': '3rem',
                '5xl': '4rem'
            }
        }
    },
    darkMode: 'class',
    plugins: []
};
