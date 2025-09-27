/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Mint & Navy Theme
        mint: { 
          DEFAULT: "#A8CBA5", 
          dark: "#96BA92" 
        },
        navy: { 
          DEFAULT: "#23404A", 
          hover: "#305A67" 
        },
        beige: { 
          paper: "#F4E7D2" 
        },
        sky: "#4F90C2",
        health: "#7BB77A",
        gold: "#E3B679",
        alert: "#D06363",
        g: { 
          50: "#FCFCFC",
          100: "#F7F7F7",
          200: "#EDEDED",
          400: "#B5B5B5",
          600: "#6D6D6D",
          700: "#4B4B4B"
        },
        // Legacy support for existing components
        primary: {
          50: '#F8FAF7',
          100: '#F0F7ED',
          200: '#E0EFD9',
          300: '#C8E2C0',
          400: '#A8C8A0',
          500: '#8FB885',
          600: '#6B9561',
          700: '#4A6B40',
          800: '#2C3E2D',
          900: '#1A251A',
        },
        secondary: {
          50: '#F0F7FF',
          100: '#E0F0FF',
          200: '#C0E0FF',
          300: '#90C7FF',
          400: '#6BA3E8',
          500: '#4A90E2',
          600: '#3875C4',
          700: '#2D5AA0',
          800: '#1E3A6B',
          900: '#0F1D35',
        },
        sage: {
          50: '#F8FAF7',
          100: '#F0F7ED',
          200: '#E0EFD9',
          300: '#C8E2C0',
          400: '#A8C8A0',
          500: '#8FB885',
          600: '#6B9561',
          700: '#4A6B40',
          800: '#2C3E2D',
          900: '#1A251A',
        },
        blue: {
          50: '#F0F7FF',
          100: '#E0F0FF',
          200: '#C0E0FF',
          300: '#90C7FF',
          400: '#6BA3E8',
          500: '#4A90E2',
          600: '#3875C4',
          700: '#2D5AA0',
          800: '#1E3A6B',
          900: '#0F1D35',
        },
        // Medical Specialty Colors
        specialty: {
          cardiology: '#8FB885',      /* Heart - Sage green */
          orthopedics: '#5BA3C7',     /* Bone - Medical blue */
          neurology: '#A8C692',       /* Brain - Light sage */
          oncology: '#7A9B7A',        /* Cancer - Deeper sage */
          fertility: '#D4B896',       /* Reproductive - Warm beige */
          dental: '#6BA3E8',          /* Tooth - Light blue */
          cosmetic: '#5BA3C7',        /* Surgery - Professional blue */
          spine: '#9BC49B',           /* Spine - Natural green */
          transplant: '#C5A572',      /* Organ - Earthy brown */
          pediatrics: '#B8D4B8',      /* Children - Soft green */
        },
        // Text Colors
        text: {
          primary: '#2C3E2D',         /* Dark green-gray for headings */
          secondary: '#4A5D4B',       /* Medium green-gray for body */
          tertiary: '#6B7B6C',        /* Light green-gray for captions */
          accent: '#8FB885',          /* Sage green for highlights */
          white: '#FFFFFF',           /* White text on dark backgrounds */
        },
        // Background Colors
        background: {
          primary: '#FFFFFF',         /* Pure white background */
          secondary: '#F8FAF7',       /* Very light sage tint */
          tertiary: '#F5F8F4',        /* Subtle green background */
        },
        // Status Colors
        success: '#7CB342',           /* Success messages */
        warning: '#FFB74D',           /* Warning messages */
        error: '#E57373',             /* Error messages */
        info: '#42A5F5',              /* Info messages */
        // Border Colors
        border: {
          light: '#E8F1E6',           /* Light borders */
          medium: '#D0E0CD',          /* Medium borders */
          dark: '#B8CDB5',            /* Dark borders */
        },
        // Legacy support
        palm: {
          50: '#F8FAF7',
          100: '#F0F7ED',
          200: '#E0EFD9',
          300: '#C8E2C0',
          400: '#A8C8A0',
          500: '#8FB885',
          600: '#6B9561',
          700: '#4A6B40',
          800: '#2C3E2D',
          900: '#1A251A',
        },
        oasis: {
          50: '#F0F7FF',
          100: '#E0F0FF',
          200: '#C0E0FF',
          300: '#90C7FF',
          400: '#6BA3E8',
          500: '#4A90E2',
          600: '#3875C4',
          700: '#2D5AA0',
          800: '#1E3A6B',
          900: '#0F1D35',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #8FB885 0%, #4A90E2 100%)',
        'gradient-sage': 'linear-gradient(135deg, #8FB885 0%, #A8C8A0 100%)',
        'gradient-blue': 'linear-gradient(135deg, #4A90E2 0%, #6BA3E8 100%)',
        'gradient-sage-blue': 'linear-gradient(135deg, #8FB885 0%, #4A90E2 100%)',
        'gradient-sage-light': 'linear-gradient(135deg, #A8C8A0 0%, #6BA3E8 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        heading: ["Poppins", "ui-sans-serif"],
        body: ["Inter", "ui-sans-serif"],
      },
      fontSize: {
        'h1': ['clamp(2.2rem,2.4vw+1.6rem,3.2rem)', { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.01em' }],
        'h2': ['clamp(1.6rem,1.4vw+1.2rem,2.2rem)', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['clamp(1.25rem,1vw+1rem,1.5rem)', { lineHeight: '1.25', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'lead': ['clamp(1.05rem,.6vw+.8rem,1.25rem)', { lineHeight: '1.55' }],
        'body': ['1rem', { lineHeight: '1.55' }],
        'body-large': ['1.125rem', { lineHeight: '1.6' }],
        'body-small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      lineHeight: {
        'tight': '1.2',
        'normal': '1.5',
        'relaxed': '1.7',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        'xxl': '3rem',
      },
      borderRadius: {
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'full': '50px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,.06)',
        'md': '0 8px 24px rgba(0,0,0,.08)',
        'xl': '0 20px 50px rgba(0,0,0,.18)',
        'sage': '0 4px 20px rgba(143, 184, 133, 0.15)',
        'blue': '0 4px 20px rgba(74, 144, 226, 0.15)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-soft': 'bounce-soft 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
