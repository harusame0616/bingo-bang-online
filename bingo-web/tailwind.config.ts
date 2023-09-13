import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/domains/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          lighten: '#d4d1c1',
          lighter: '#b4b1a1',
          normal: '#949181',
          darker: '#747161',
          darken: '#545141',
        },
      },
    },
  },
  plugins: [],
};
export default config;
