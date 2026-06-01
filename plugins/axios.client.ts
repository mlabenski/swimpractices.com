import axios from 'axios'

export default defineNuxtPlugin({
  name: 'axios',
  setup () {
    return {
      provide: {
        axios,
      },
    }
  },
})
