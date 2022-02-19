/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
      PRINT_VIEW: boolean,
      NODE_ENV: 'development' | 'production' | 'test'
      PUBLIC_URL: string
    }
  }