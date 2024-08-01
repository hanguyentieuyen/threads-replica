/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      backgroundImage: {
        'threads-login-bg': "url('/assets/threads-bg-png.png')"
      }
    }
  }
}
