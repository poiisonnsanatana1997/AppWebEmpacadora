import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      foreground: string
      border: string
      ring: string
      muted: {
        foreground: string
      }
    }
  }
} 