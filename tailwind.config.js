module.exports = {
  theme: {
    extend: {
      colors: {
        customColor: {
          DEFAULT: '#cfd7d7'
         },
        customYellow: {
          DEFAULT: '#F7F052'
        },
        customGrey: {
          DEFAULT: '#D9D00A'
        },
        customBlue: {
          DEFAULT: '#4281A4'
        },
        customBlack: {
          DEFAULT: '#161918'
        },
        backgroundBlue: {
          DEFAULT: '#1F897E'
        },
          customOrange: {
            DEFAULT: '#111827'
          }
      },
      fontFamily: {
        handwritten: ['Architects Daughter']
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' }
        }
      },
      animation: {
        shake: 'shake 0.7s cubic-bezier(.36,.07,.19,.97) both'
      }
    }
  },
  variants: {
    extend: {
      animation: ['hover']
    }
  },
  plugins: [

  ],
  css: [
    '@/static/main.css',

  ],
}
