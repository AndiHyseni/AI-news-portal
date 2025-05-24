declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "local" | "development" | "production";
      PORT: string;
      SHOPWARE_API_URL: string;

      // DB
      DB_HOSTNAME: string;
      DB_PASSWORD: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_NAME: string;
      DB_DIALECT: string;

      // JWT
      JWT_ALGORITHM: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;

      // MAIL
      MAIL_DRIVER: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USERNAME: string;
      MAIL_PASSWORD: string;
      MAIL_FROM_NAME: string;
      MAIL_FROM_ADDRESS: string;

      // OpenAI
      OPENAI_API_KEY: string;

      // NewsAPI
      NEWSAPI_KEY: string;
    }
  }
}

export {};
