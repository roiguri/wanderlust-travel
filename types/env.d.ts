declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      BCRYPT_ROUNDS: string;
    }
  }
}

// Ensure this file is treated as a module
export {};