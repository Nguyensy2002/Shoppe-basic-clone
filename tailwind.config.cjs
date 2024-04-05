/*eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    corePlugins: {
      //xóa class container trong tailwindcss để không còn ăn thuộc tính css
      container: false
    },
    theme: {
      extend: {
        colors:{
          orange: '#ee4d2d'
        }
      },
    },
    plugins: [
      //tạo 1 class container mới để sử dụng thay cho container mặc định cảu tailwindcss
      plugin(function({addComponents, theme}){
        addComponents({
          '.container': {
            maxWidth: theme('columns.7xl'),
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingLeft: theme('spacing.4'),
            paddingRight: theme('spacing.4')
          }
        })
      }),
      require('@tailwindcss/line-clamp')
    ],
  }